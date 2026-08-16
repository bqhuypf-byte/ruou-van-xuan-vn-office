import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import type { Request, Response } from 'express';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    me: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'jwt.refreshExpiresIn') return '7d';
      if (key === 'app.nodeEnv') return 'test';
      return undefined;
    }),
  };

  const createMockResponse = () =>
    ({
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    }) as unknown as Response;

  const createMockRequest = (cookies: Record<string, string> = {}) =>
    ({
      ip: '127.0.0.1',
      headers: { 'user-agent': 'jest' },
      cookies,
    }) as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/register', () => {
    it('should delegate to authService.register', async () => {
      const dto = { email: 'jane@example.com', password: 'password123', fullName: 'Jane Doe' };
      const expected = { id: 1, email: dto.email, fullName: dto.fullName, role: 'customer' };
      service.register.mockResolvedValue(expected);

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('POST /auth/login', () => {
    it('should set the refresh cookie and return the access token + user', async () => {
      const dto = { email: 'jane@example.com', password: 'password123' };
      const res = createMockResponse();
      const req = createMockRequest();
      service.login.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'raw-refresh-token',
        user: { id: 1, email: dto.email, fullName: 'Jane Doe', role: 'customer' },
      });

      const result = await controller.login(dto, req, res);

      expect(service.login).toHaveBeenCalledWith(dto, {
        ipAddress: '127.0.0.1',
        userAgent: 'jest',
      });
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'raw-refresh-token',
        expect.objectContaining({ httpOnly: true, path: '/api/v1/auth' }),
      );
      expect(result).toEqual({
        accessToken: 'access-token',
        user: { id: 1, email: dto.email, fullName: 'Jane Doe', role: 'customer' },
      });
    });
  });

  describe('POST /auth/refresh', () => {
    it('should read the cookie, rotate the token, and return a new access token', async () => {
      const res = createMockResponse();
      const req = createMockRequest({ refreshToken: 'old-raw-token' });
      service.refresh.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-raw-token',
      });

      const result = await controller.refresh(req, res);

      expect(service.refresh).toHaveBeenCalledWith('old-raw-token', {
        ipAddress: '127.0.0.1',
        userAgent: 'jest',
      });
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'new-raw-token',
        expect.any(Object),
      );
      expect(result).toEqual({ accessToken: 'new-access-token' });
    });
  });

  describe('POST /auth/logout', () => {
    it('should revoke the token and clear the cookie', async () => {
      const res = createMockResponse();
      const req = createMockRequest({ refreshToken: 'raw-token' });

      const result = await controller.logout(req, res);

      expect(service.logout).toHaveBeenCalledWith('raw-token');
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', { path: '/api/v1/auth' });
      expect(result).toEqual({ success: true });
    });
  });

  describe('GET /auth/me', () => {
    it('should return the current user', async () => {
      const user = { id: 1, email: 'jane@example.com', role: 'customer' };
      const expected = { id: 1, email: user.email, fullName: 'Jane Doe', role: 'customer' };
      service.me.mockResolvedValue(expected);

      const result = await controller.me(user);

      expect(service.me).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });

  describe('PATCH /auth/me', () => {
    it('should delegate to authService.updateProfile', async () => {
      const user = { id: 1, email: 'jane@example.com', role: 'customer' };
      const dto = { fullName: 'Jane Updated' };
      const expected = { id: 1, email: user.email, fullName: 'Jane Updated', role: 'customer' };
      service.updateProfile.mockResolvedValue(expected);

      const result = await controller.updateProfile(user, dto);

      expect(service.updateProfile).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(expected);
    });
  });

  describe('PATCH /auth/change-password', () => {
    it('should delegate to authService.changePassword', async () => {
      const user = { id: 1, email: 'jane@example.com', role: 'customer' };
      const dto = { currentPassword: 'old-password', newPassword: 'new-password123' };

      const result = await controller.changePassword(user, dto);

      expect(service.changePassword).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ success: true });
    });
  });
});
