import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { parseDurationToMs } from '../../shared/utils/duration.util';
import { RolesService } from '../roles/roles.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { JwtPayload } from './types/jwt-payload.type';
import { VoucherService } from '../voucher/voucher.service';

const SALT_ROUNDS = 10;
const DEFAULT_ROLE_NAME = 'customer';

export interface RequestMeta {
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthUserResponse {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface RegisterResponse extends AuthUserResponse {
  welcomeVoucher: { code: string; title: string } | null;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUserResponse;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly voucherService: VoucherService,
  ) {}

  private async resolveRoleName(roleId: number | null): Promise<string> {
    if (!roleId) return DEFAULT_ROLE_NAME;
    const role = await this.rolesService.findOne(roleId).catch(() => null);
    return role?.name ?? DEFAULT_ROLE_NAME;
  }

  private toAuthUser(user: User, role: string): AuthUserResponse {
    return { id: user.id, email: user.email, fullName: user.fullName, role };
  }

  private signAccessToken(
    user: Pick<User, 'id' | 'email'>,
    role: string,
  ): string {
    const payload: JwtPayload = { sub: user.id, email: user.email, role };
    return this.jwtService.sign(payload);
  }

  private async issueRefreshToken(
    userId: number,
    meta: RequestMeta,
  ): Promise<string> {
    const rawToken = randomBytes(48).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const refreshExpiresIn =
      this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d';
    const expiresAt = new Date(
      Date.now() + parseDurationToMs(refreshExpiresIn),
    );

    const token = this.refreshTokenRepository.create({
      userId,
      tokenHash,
      deviceName: meta.deviceName ?? null,
      ipAddress: meta.ipAddress ?? null,
      userAgent: meta.userAgent ?? null,
      expiresAt,
      isRevoked: false,
    });
    await this.refreshTokenRepository.save(token);
    return rawToken;
  }

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const customerRole = await this.rolesService.findByName(DEFAULT_ROLE_NAME);
    const created = await this.usersService.create({
      ...dto,
      roleId: customerRole?.id,
    });
    const welcomeVoucher = await this.voucherService.grantWelcomeVoucher(created.id);
    return {
      id: created.id,
      email: created.email,
      fullName: created.fullName,
      role: customerRole?.name ?? DEFAULT_ROLE_NAME,
      welcomeVoucher: welcomeVoucher
        ? { code: welcomeVoucher.code, title: welcomeVoucher.title }
        : null,
    };
  }

  async login(dto: LoginDto, meta: RequestMeta): Promise<LoginResult> {
    const user = await this.usersService.findRawByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const roleName = await this.resolveRoleName(user.roleId);
    const accessToken = this.signAccessToken(user, roleName);
    const refreshToken = await this.issueRefreshToken(user.id, meta);

    return { accessToken, refreshToken, user: this.toAuthUser(user, roleName) };
  }

  async refresh(
    rawToken: string | undefined,
    meta: RequestMeta,
  ): Promise<RefreshResult> {
    if (!rawToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    await this.refreshTokenRepository.revoke(stored);

    const user = await this.usersService.findRawById(stored.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    const roleName = await this.resolveRoleName(user.roleId);
    const accessToken = this.signAccessToken(user, roleName);
    const refreshToken = await this.issueRefreshToken(user.id, meta);

    return { accessToken, refreshToken };
  }

  async logout(rawToken: string | undefined): Promise<void> {
    if (!rawToken) return;
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    if (stored && !stored.isRevoked) {
      await this.refreshTokenRepository.revoke(stored);
    }
  }

  async me(userId: number): Promise<AuthUserResponse> {
    const user = await this.usersService.findRawById(userId);
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    const roleName = await this.resolveRoleName(user.roleId);
    return this.toAuthUser(user, roleName);
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
  ): Promise<AuthUserResponse> {
    const updated = await this.usersService.update(userId, dto);
    const roleName = await this.resolveRoleName(updated.roleId);
    return {
      id: updated.id,
      email: updated.email,
      fullName: updated.fullName,
      role: roleName,
    };
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
    const user = await this.usersService.findRawById(userId);
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    const matches = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!matches) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.usersService.setPasswordHash(userId, passwordHash);
    await this.refreshTokenRepository.revokeAllForUser(userId);
  }
}
