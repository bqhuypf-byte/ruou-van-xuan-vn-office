import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { RolesController } from '../roles.controller';
import { RolesService } from '../roles.service';
import { RoleRepository } from '../repositories/role.repository';
import { Role } from '../entities/role.entity';

describe('Roles (E2E Integration)', () => {
  let app: INestApplication<App>;
  let mockRepository: jest.Mocked<RoleRepository>;

  const mockRoles: Role[] = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'customer' },
  ];

  const mockRoleRepoProvider = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        RolesService,
        {
          provide: RoleRepository,
          useValue: mockRoleRepoProvider,
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

    mockRepository = moduleFixture.get(RoleRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /roles', () => {
    it('should return all roles with 200 OK', async () => {
      mockRepository.findAll.mockResolvedValue(mockRoles);

      const response = await request(app.getHttpServer())
        .get('/roles')
        .expect(200);

      expect(response.body).toEqual(mockRoles);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /roles/:id', () => {
    it('should return a role by id with 200 OK', async () => {
      mockRepository.findById.mockResolvedValue(mockRoles[0]);

      const response = await request(app.getHttpServer())
        .get('/roles/1')
        .expect(200);

      expect(response.body).toEqual(mockRoles[0]);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return 404 NOT FOUND if role does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/roles/999')
        .expect(404);

      expect(response.body.message).toContain('Role #999 not found');
    });

    it('should return 400 BAD REQUEST if id is not a number', async () => {
      await request(app.getHttpServer()).get('/roles/abc').expect(400);
    });
  });

  describe('POST /roles', () => {
    it('should create a role and return 201 Created', async () => {
      const dto = { name: 'moderator' };
      const created: Role = { id: 3, name: 'moderator' };

      mockRepository.findByName.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(created);
      mockRepository.save.mockResolvedValue(created);

      const response = await request(app.getHttpServer())
        .post('/roles')
        .send(dto)
        .expect(201);

      expect(response.body).toEqual(created);
      expect(mockRepository.findByName).toHaveBeenCalledWith('moderator');
    });

    it('should return 409 CONFLICT if role name already exists', async () => {
      const dto = { name: 'admin' };
      mockRepository.findByName.mockResolvedValue(mockRoles[0]);

      const response = await request(app.getHttpServer())
        .post('/roles')
        .send(dto)
        .expect(409);

      expect(response.body.message).toContain('Role "admin" already exists');
    });

    it('should return 400 BAD REQUEST if body is empty or invalid', async () => {
      await request(app.getHttpServer()).post('/roles').send({}).expect(400);
    });
  });

  describe('PATCH /roles/:id', () => {
    it('should update role name and return 200 OK', async () => {
      const dto = { name: 'super_admin' };
      const updated: Role = { id: 1, name: 'super_admin' };

      mockRepository.findById.mockResolvedValue({ ...mockRoles[0] });
      mockRepository.findByName.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue(updated);

      const response = await request(app.getHttpServer())
        .patch('/roles/1')
        .send(dto)
        .expect(200);

      expect(response.body).toEqual(updated);
    });

    it('should return 409 CONFLICT if new name belongs to existing role', async () => {
      const dto = { name: 'customer' };
      mockRepository.findById.mockResolvedValue({ ...mockRoles[0] });
      mockRepository.findByName.mockResolvedValue(mockRoles[1]);

      await request(app.getHttpServer())
        .patch('/roles/1')
        .send(dto)
        .expect(409);
    });
  });

  describe('DELETE /roles/:id', () => {
    it('should delete role and return 200 OK', async () => {
      mockRepository.findById.mockResolvedValue(mockRoles[0]);
      mockRepository.remove.mockResolvedValue(undefined);

      await request(app.getHttpServer()).delete('/roles/1').expect(200);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockRoles[0]);
    });

    it('should return 404 NOT FOUND if role to delete does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await request(app.getHttpServer()).delete('/roles/999').expect(404);
    });
  });
});
