import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService, UserResponse } from '../users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const mockUser: UserResponse = {
    id: 1,
    roleId: 2,
    email: 'jane@example.com',
    fullName: 'Jane Doe',
    phone: '0901234567',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /users (findAll)', () => {
    it('should return an array of users', async () => {
      const expected = [mockUser];
      service.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  describe('GET /users/:id (findOne)', () => {
    it('should return a user by id', async () => {
      service.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('POST /users (create)', () => {
    it('should create a user and return it', async () => {
      const dto = {
        email: 'new@example.com',
        password: 'plainPassword1',
        fullName: 'New User',
      };
      const expected: UserResponse = {
        ...mockUser,
        id: 3,
        email: dto.email,
        fullName: dto.fullName,
      };
      service.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('PATCH /users/:id (update)', () => {
    it('should update user and return updated user', async () => {
      const dto = { fullName: 'Jane Updated' };
      const expected: UserResponse = { ...mockUser, fullName: 'Jane Updated' };
      service.update.mockResolvedValue(expected);

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(expected);
    });
  });

  describe('DELETE /users/:id (remove)', () => {
    it('should remove user by id', async () => {
      service.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
