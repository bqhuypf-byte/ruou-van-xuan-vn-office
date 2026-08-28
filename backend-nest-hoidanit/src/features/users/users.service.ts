import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { assignDefined } from '../../shared/utils/assign-defined.util';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const SALT_ROUNDS = 10;

export type UserResponse = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  private sanitize(user: User): UserResponse {
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.sanitize(user));
  }

  async findOne(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.sanitize(user);
  }

  // Includes passwordHash — only for auth feature's internal credential checks, never return to a client
  findRawByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  findRawById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(`Email "${dto.email}" already exists`);
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const { password: _password, ...rest } = dto;
    const user = this.userRepository.create({ ...rest, passwordHash });
    const saved = await this.userRepository.save(user);
    return this.sanitize(saved);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException(`Email "${dto.email}" already exists`);
      }
    }

    assignDefined(user, dto);
    const saved = await this.userRepository.save(user);
    return this.sanitize(saved);
  }

  async setPasswordHash(id: number, passwordHash: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    user.passwordHash = passwordHash;
    await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    await this.userRepository.remove(user);
  }
}
