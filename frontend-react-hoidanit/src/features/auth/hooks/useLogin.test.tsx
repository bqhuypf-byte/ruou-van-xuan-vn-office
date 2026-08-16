import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useLogin } from './useLogin';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import type { LoginResult } from '../types/auth.types';

vi.mock('../services/auth.service', () => ({
  authService: {
    login: vi.fn(),
  },
}));

const mockResult: LoginResult = {
  accessToken: 'access-token',
  user: { id: 1, email: 'jane@example.com', fullName: 'Jane Doe', role: 'customer' },
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, isAuthenticated: false, isInitializing: false });
  });

  it('calls authService.login with the given credentials', async () => {
    vi.mocked(authService.login).mockResolvedValue(mockResult);
    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.mutate({ email: 'jane@example.com', password: 'password123' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(authService.login).toHaveBeenCalledWith({
      email: 'jane@example.com',
      password: 'password123',
    });
  });

  it('sets the authenticated user in the store on success', async () => {
    vi.mocked(authService.login).mockResolvedValue(mockResult);
    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.mutate({ email: 'jane@example.com', password: 'password123' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(useAuthStore.getState().user).toEqual(mockResult.user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('surfaces an error and leaves the store unauthenticated on failure', async () => {
    vi.mocked(authService.login).mockRejectedValue(new Error('Invalid credentials'));
    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.mutate({ email: 'jane@example.com', password: 'wrong-password' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
