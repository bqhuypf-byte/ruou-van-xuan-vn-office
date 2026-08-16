import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users.service';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UserRepository>;

  const mockUser: User = {
    id: 1,
    roleId: 2,
    email: 'jane@example.com',
    passwordHash: 'hashed-password',
    fullName: 'Jane Doe',
    phone: '0901234567',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUserRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UserRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return users without passwordHash', async () => {
      repository.findAll.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        {
          id: 1,
          roleId: 2,
          email: 'jane@example.com',
          fullName: 'Jane Doe',
          phone: '0901234567',
          isActive: true,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        },
      ]);
      expect(result[0]).not.toHaveProperty('passwordHash');
    });
  });

  describe('findOne', () => {
    it('should return a sanitized user by id if found', async () => {
      repository.findById.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).not.toHaveProperty('passwordHash');
      expect(result.email).toBe('jane@example.com');
    });

    it('should throw NotFoundException if user is not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith(99);
    });
  });

  describe('create', () => {
    it('should hash the password and create a new user successfully', async () => {
      const dto = {
        email: 'new@example.com',
        password: 'plainPassword1',
        fullName: 'New User',
      };
      const createdUser: User = {
        ...mockUser,
        id: 3,
        email: dto.email,
        fullName: dto.fullName,
        passwordHash: 'hashed-plainPassword1',
      };

      repository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-plainPassword1');
      repository.create.mockReturnValue(createdUser);
      repository.save.mockResolvedValue(createdUser);

      const result = await service.create(dto);

      expect(repository.findByEmail).toHaveBeenCalledWith('new@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword1', 10);
      expect(repository.create).toHaveBeenCalledWith({
        email: dto.email,
        fullName: dto.fullName,
        passwordHash: 'hashed-plainPassword1',
      });
      expect(repository.save).toHaveBeenCalledWith(createdUser);
      expect(result).not.toHaveProperty('passwordHash');
      expect(result.email).toBe(dto.email);
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto = {
        email: 'jane@example.com',
        password: 'plainPassword1',
        fullName: 'Jane Doe',
      };
      repository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repository.findByEmail).toHaveBeenCalledWith('jane@example.com');
      expect(repository.create).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user fields successfully when email is unchanged', async () => {
      const dto = { fullName: 'Jane Updated' };
      repository.findById.mockResolvedValue({ ...mockUser });
      repository.save.mockResolvedValue({ ...mockUser, fullName: 'Jane Updated' });

      const result = await service.update(1, dto);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.findByEmail).not.toHaveBeenCalled();
      expect(result.fullName).toBe('Jane Updated');
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should update email successfully when new email is unique', async () => {
      const dto = { email: 'changed@example.com' };
      repository.findById.mockResolvedValue({ ...mockUser });
      repository.findByEmail.mockResolvedValue(null);
      repository.save.mockResolvedValue({ ...mockUser, email: 'changed@example.com' });

      const result = await service.update(1, dto);

      expect(repository.findByEmail).toHaveBeenCalledWith('changed@example.com');
      expect(result.email).toBe('changed@example.com');
    });

    it('should throw ConflictException if updated email belongs to another user', async () => {
      const dto = { email: 'taken@example.com' };
      const otherUser: User = { ...mockUser, id: 2, email: 'taken@example.com' };
      repository.findById.mockResolvedValue({ ...mockUser });
      repository.findByEmail.mockResolvedValue(otherUser);

      await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user to update does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update(99, { fullName: 'x' })).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove user successfully', async () => {
      repository.findById.mockResolvedValue(mockUser);
      repository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user to remove does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
