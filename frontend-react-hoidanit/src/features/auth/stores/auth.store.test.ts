import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from './auth.store';
import { authService } from '../services/auth.service';
import type { AuthUser } from '../types/auth.types';

vi.mock('../services/auth.service', () => ({
  authService: {
    refresh: vi.fn(),
    getMe: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockUser: AuthUser = {
  id: 1,
  email: 'jane@example.com',
  fullName: 'Jane Doe',
  role: 'customer',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, isAuthenticated: false, isInitializing: true });
  });

  describe('setUser', () => {
    it('sets the user and marks the store as authenticated', () => {
      useAuthStore.getState().setUser(mockUser);

      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('clears the user and marks the store as unauthenticated when given null', () => {
      useAuthStore.setState({ user: mockUser, isAuthenticated: true });

      useAuthStore.getState().setUser(null);

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('bootstrap', () => {
    it('restores the session when refresh + getMe succeed', async () => {
      vi.mocked(authService.refresh).mockResolvedValue({ accessToken: 'new-token' });
      vi.mocked(authService.getMe).mockResolvedValue(mockUser);

      await useAuthStore.getState().bootstrap();

      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().isInitializing).toBe(false);
    });

    it('leaves the store unauthenticated when there is no valid session', async () => {
      vi.mocked(authService.refresh).mockRejectedValue(new Error('No refresh token'));

      await useAuthStore.getState().bootstrap();

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().isInitializing).toBe(false);
    });
  });

  describe('logout', () => {
    it('calls authService.logout and clears the store', async () => {
      useAuthStore.setState({ user: mockUser, isAuthenticated: true });
      vi.mocked(authService.logout).mockResolvedValue(undefined);

      await useAuthStore.getState().logout();

      expect(authService.logout).toHaveBeenCalled();
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('still clears the store even when the API call fails', async () => {
      useAuthStore.setState({ user: mockUser, isAuthenticated: true });
      vi.mocked(authService.logout).mockRejectedValue(new Error('Network error'));

      await expect(useAuthStore.getState().logout()).rejects.toThrow('Network error');

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
