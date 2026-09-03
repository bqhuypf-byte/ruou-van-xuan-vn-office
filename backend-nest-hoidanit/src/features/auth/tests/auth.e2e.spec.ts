import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import { Role } from '../../roles/entities/role.entity';
import { RoleRepository } from '../../roles/repositories/role.repository';
import { RolesService } from '../../roles/roles.service';
import { User } from '../../users/entities/user.entity';
import { UserRepository } from '../../users/repositories/user.repository';
import { UsersService } from '../../users/users.service';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { VoucherService } from '../../voucher/voucher.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcrypt');

describe('Auth (E2E Integration)', () => {
  let app: INestApplication<App>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRoleRepository: jest.Mocked<RoleRepository>;
  let mockRefreshTokenRepository: jest.Mocked<RefreshTokenRepository>;

  const customerRole: Role = { id: 2, name: 'customer' };

  const existingUser: User = {
    id: 1,
    roleId: 2,
    email: 'jane@example.com',
    passwordHash: 'hashed-existing',
    fullName: 'Jane Doe',
    phone: null,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUserRepoProvider = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockRoleRepoProvider = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockRefreshTokenRepoProvider = {
    findByTokenHash: jest.fn(),
    create: jest.fn((data) => data),
    save: jest.fn((data) => Promise.resolve({ id: 99, ...data })),
    revoke: jest.fn(),
    revokeAllForUser: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        'jwt.secret': 'test-secret',
        'jwt.expiresIn': '15m',
        'jwt.refreshExpiresIn': '7d',
        'app.nodeEnv': 'test',
      };
      return values[key];
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '15m' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        RolesService,
        JwtStrategy,
        { provide: UserRepository, useValue: mockUserRepoProvider },
        { provide: RoleRepository, useValue: mockRoleRepoProvider },
        {
          provide: RefreshTokenRepository,
          useValue: mockRefreshTokenRepoProvider,
        },
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: VoucherService,
          useValue: { grantWelcomeVoucher: jest.fn().mockResolvedValue(null) },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    mockUserRepository = moduleFixture.get(UserRepository);
    mockRoleRepository = moduleFixture.get(RoleRepository);
    mockRefreshTokenRepository = moduleFixture.get(RefreshTokenRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    mockRefreshTokenRepository.create.mockImplementation(
      (data: unknown) => data as RefreshToken,
    );
    mockRefreshTokenRepository.save.mockImplementation((data: RefreshToken) =>
      Promise.resolve({ ...data, id: data.id ?? 99 }),
    );
  });

  describe('POST /auth/register', () => {
    it('should register a new user with the default customer role and 201', async () => {
      mockRoleRepository.findByName.mockResolvedValue(customerRole);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({
        ...existingUser,
        id: 3,
        email: 'new@example.com',
        fullName: 'New User',
      });
      mockUserRepository.save.mockResolvedValue({
        ...existingUser,
        id: 3,
        email: 'new@example.com',
        fullName: 'New User',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'new@example.com',
          password: 'password123',
          fullName: 'New User',
        })
        .expect(201);

      expect(response.body).toEqual({
        id: 3,
        email: 'new@example.com',
        fullName: 'New User',
        role: 'customer',
        welcomeVoucher: null,
      });
    });

    it('should return 409 CONFLICT when the email already exists', async () => {
      mockRoleRepository.findByName.mockResolvedValue(customerRole);
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: existingUser.email,
          password: 'password123',
          fullName: 'Jane Doe',
        })
        .expect(409);
    });

    it('should return 400 BAD REQUEST for an invalid payload', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should return an access token, user, and set the refresh cookie on success', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);
      mockRoleRepository.findById.mockResolvedValue(customerRole);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: existingUser.email, password: 'password123' })
        .expect(200);

      expect(response.body.accessToken).toEqual(expect.any(String));
      expect(response.body.user).toEqual({
        id: existingUser.id,
        email: existingUser.email,
        fullName: existingUser.fullName,
        role: 'customer',
      });
      expect(response.headers['set-cookie']?.[0]).toContain('refreshToken=');
    });

    it('should return 401 UNAUTHORIZED for invalid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: existingUser.email, password: 'wrong-password' })
        .expect(401);
    });
  });

  describe('GET /auth/me', () => {
    it('should return 401 UNAUTHORIZED without a Bearer token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('should return the current user profile with a valid Bearer token', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);
      mockRoleRepository.findById.mockResolvedValue(customerRole);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: existingUser.email, password: 'password123' })
        .expect(200);

      mockUserRepository.findById.mockResolvedValue(existingUser);

      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .expect(200);

      expect(response.body).toEqual({
        id: existingUser.id,
        email: existingUser.email,
        fullName: existingUser.fullName,
        role: 'customer',
      });
    });
  });

  describe('POST /auth/refresh', () => {
    it('should return 401 UNAUTHORIZED when there is no refresh cookie', async () => {
      await request(app.getHttpServer()).post('/auth/refresh').expect(401);
    });
  });
});
