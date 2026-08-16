import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

describe('Users (E2E Integration)', () => {
  let app: INestApplication<App>;
  let mockRepository: jest.Mocked<UserRepository>;

  const mockUsers: User[] = [
    {
      id: 1,
      roleId: 2,
      email: 'jane@example.com',
      passwordHash: 'hashed-existing',
      fullName: 'Jane Doe',
      phone: '0901234567',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      roleId: null,
      email: 'john@example.com',
      passwordHash: 'hashed-existing-2',
      fullName: 'John Roe',
      phone: null,
      isActive: true,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ];

  const mockUserRepoProvider = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepoProvider,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();

    mockRepository = moduleFixture.get(UserRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return all users without passwordHash, 200 OK', async () => {
      mockRepository.findAll.mockResolvedValue(mockUsers);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).not.toHaveProperty('passwordHash');
      expect(response.body[0].email).toBe('jane@example.com');
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id with 200 OK', async () => {
      mockRepository.findById.mockResolvedValue(mockUsers[0]);

      const response = await request(app.getHttpServer())
        .get('/users/1')
        .expect(200);

      expect(response.body.email).toBe('jane@example.com');
      expect(response.body).not.toHaveProperty('passwordHash');
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return 404 NOT FOUND if user does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/users/999')
        .expect(404);

      expect(response.body.message).toContain('User #999 not found');
    });

    it('should return 400 BAD REQUEST if id is not a number', async () => {
      await request(app.getHttpServer()).get('/users/abc').expect(400);
    });
  });

  describe('POST /users', () => {
    it('should create a user and return 201 Created without passwordHash', async () => {
      const dto = {
        email: 'new@example.com',
        password: 'plainPassword1',
        fullName: 'New User',
      };
      const created: User = {
        ...mockUsers[0],
        id: 3,
        email: dto.email,
        fullName: dto.fullName,
        passwordHash: 'hashed-password',
      };

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(created);
      mockRepository.save.mockResolvedValue(created);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(dto)
        .expect(201);

      expect(response.body.email).toBe(dto.email);
      expect(response.body).not.toHaveProperty('passwordHash');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 409 CONFLICT if email already exists', async () => {
      const dto = {
        email: 'jane@example.com',
        password: 'plainPassword1',
        fullName: 'Jane Doe',
      };
      mockRepository.findByEmail.mockResolvedValue(mockUsers[0]);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(dto)
        .expect(409);

      expect(response.body.message).toContain(
        'Email "jane@example.com" already exists',
      );
    });

    it('should return 400 BAD REQUEST for an invalid email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'not-an-email', password: 'plainPassword1', fullName: 'X' })
        .expect(400);
    });

    it('should return 400 BAD REQUEST if body is empty or invalid', async () => {
      await request(app.getHttpServer()).post('/users').send({}).expect(400);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update user and return 200 OK', async () => {
      const dto = { fullName: 'Jane Updated' };
      const updated: User = { ...mockUsers[0], fullName: 'Jane Updated' };

      mockRepository.findById.mockResolvedValue({ ...mockUsers[0] });
      mockRepository.save.mockResolvedValue(updated);

      const response = await request(app.getHttpServer())
        .patch('/users/1')
        .send(dto)
        .expect(200);

      expect(response.body.fullName).toBe('Jane Updated');
    });

    it('should return 409 CONFLICT if new email belongs to another user', async () => {
      const dto = { email: 'john@example.com' };
      mockRepository.findById.mockResolvedValue({ ...mockUsers[0] });
      mockRepository.findByEmail.mockResolvedValue(mockUsers[1]);

      await request(app.getHttpServer())
        .patch('/users/1')
        .send(dto)
        .expect(409);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user and return 200 OK', async () => {
      mockRepository.findById.mockResolvedValue(mockUsers[0]);
      mockRepository.remove.mockResolvedValue(undefined);

      await request(app.getHttpServer()).delete('/users/1').expect(200);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('should return 404 NOT FOUND if user to delete does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await request(app.getHttpServer()).delete('/users/999').expect(404);
    });
  });
});
