import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { RolesService } from '../../roles/roles.service';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { RefreshToken } from '../entities/refresh-token.entity';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let rolesService: jest.Mocked<RolesService>;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const customerRole: Role = { id: 2, name: 'customer' };

  const mockUser: User = {
    id: 1,
    roleId: 2,
    email: 'jane@example.com',
    passwordHash: 'hashed-password',
    fullName: 'Jane Doe',
    phone: null,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockRefreshToken: RefreshToken = {
    id: 10,
    userId: 1,
    tokenHash: 'some-hash',
    deviceName: null,
    ipAddress: '127.0.0.1',
    userAgent: 'jest',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    isRevoked: false,
    createdAt: new Date('2024-01-01'),
  };

  const mockUsersService = {
    create: jest.fn(),
    update: jest.fn(),
    findRawByEmail: jest.fn(),
    findRawById: jest.fn(),
    setPasswordHash: jest.fn(),
  };

  const mockRolesService = {
    findOne: jest.fn(),
    findByName: jest.fn(),
  };

  const mockRefreshTokenRepository = {
    findByTokenHash: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    revoke: jest.fn(),
    revokeAllForUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'jwt.refreshExpiresIn') return '7d';
      return undefined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: RolesService, useValue: mockRolesService },
        {
          provide: RefreshTokenRepository,
          useValue: mockRefreshTokenRepository,
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    rolesService = module.get(RolesService);
    refreshTokenRepository = module.get(RefreshTokenRepository);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
    mockJwtService.sign.mockReturnValue('signed-access-token');
    mockRefreshTokenRepository.create.mockImplementation((data) => data);
    mockRefreshTokenRepository.save.mockResolvedValue(mockRefreshToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create the user with the default customer role', async () => {
      rolesService.findByName.mockResolvedValue(customerRole);
      usersService.create.mockResolvedValue({
        id: 1,
        roleId: 2,
        email: 'jane@example.com',
        fullName: 'Jane Doe',
        phone: null,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      });

      const dto = {
        email: 'jane@example.com',
        password: 'password123',
        fullName: 'Jane Doe',
      };
      const result = await service.register(dto);

      expect(rolesService.findByName).toHaveBeenCalledWith('customer');
      expect(usersService.create).toHaveBeenCalledWith({
        ...dto,
        roleId: customerRole.id,
      });
      expect(result).toEqual({
        id: 1,
        email: 'jane@example.com',
        fullName: 'Jane Doe',
        role: 'customer',
      });
    });
  });

  describe('login', () => {
    it('should return tokens and sanitized user on valid credentials', async () => {
      usersService.findRawByEmail.mockResolvedValue(mockUser);
      rolesService.findOne.mockResolvedValue(customerRole);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(
        { email: mockUser.email, password: 'password123' },
        { ipAddress: '127.0.0.1', userAgent: 'jest' },
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        mockUser.passwordHash,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: 'customer',
      });
      expect(result.accessToken).toBe('signed-access-token');
      expect(result.refreshToken).toEqual(expect.any(String));
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
        role: 'customer',
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      usersService.findRawByEmail.mockResolvedValue(null);

      await expect(
        service.login(
          { email: 'missing@example.com', password: 'password123' },
          {},
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password does not match', async () => {
      usersService.findRawByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login(
          { email: mockUser.email, password: 'wrong-password' },
          {},
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when account is inactive', async () => {
      usersService.findRawByEmail.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.login({ email: mockUser.email, password: 'password123' }, {}),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should rotate the refresh token and issue a new access token', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(
        mockRefreshToken,
      );
      usersService.findRawById.mockResolvedValue(mockUser);
      rolesService.findOne.mockResolvedValue(customerRole);

      const result = await service.refresh('raw-refresh-token', {});

      expect(refreshTokenRepository.revoke).toHaveBeenCalledWith(
        mockRefreshToken,
      );
      expect(result.accessToken).toBe('signed-access-token');
      expect(result.refreshToken).toEqual(expect.any(String));
    });

    it('should throw UnauthorizedException when no token is provided', async () => {
      await expect(service.refresh(undefined, {})).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when token is not found', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(null);

      await expect(service.refresh('unknown-token', {})).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when token is revoked', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue({
        ...mockRefreshToken,
        isRevoked: true,
      });

      await expect(service.refresh('revoked-token', {})).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when token is expired', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue({
        ...mockRefreshToken,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(service.refresh('expired-token', {})).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should revoke the matching refresh token', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(
        mockRefreshToken,
      );

      await service.logout('raw-refresh-token');

      expect(refreshTokenRepository.revoke).toHaveBeenCalledWith(
        mockRefreshToken,
      );
    });

    it('should do nothing when no token is provided', async () => {
      await service.logout(undefined);

      expect(refreshTokenRepository.findByTokenHash).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    it('should return the current user profile', async () => {
      usersService.findRawById.mockResolvedValue(mockUser);
      rolesService.findOne.mockResolvedValue(customerRole);

      const result = await service.me(1);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
        role: 'customer',
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersService.findRawById.mockResolvedValue(null);

      await expect(service.me(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('changePassword', () => {
    it('should hash and store the new password, then revoke all refresh tokens', async () => {
      usersService.findRawById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');

      await service.changePassword(1, {
        currentPassword: 'password123',
        newPassword: 'newPassword123',
      });

      expect(usersService.setPasswordHash).toHaveBeenCalledWith(
        1,
        'new-hashed-password',
      );
      expect(refreshTokenRepository.revokeAllForUser).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException when the current password is wrong', async () => {
      usersService.findRawById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword(1, {
          currentPassword: 'wrong-password',
          newPassword: 'newPassword123',
        }),
      ).rejects.toThrow(UnauthorizedException);
      expect(usersService.setPasswordHash).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersService.findRawById.mockResolvedValue(null);

      await expect(
        service.changePassword(999, {
          currentPassword: 'password123',
          newPassword: 'newPassword123',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
