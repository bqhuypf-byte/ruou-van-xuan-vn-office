import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useRegister } from './useRegister';
import { authService } from '../services/auth.service';
import type { AuthUser } from '../types/auth.types';

vi.mock('../services/auth.service', () => ({
  authService: {
    register: vi.fn(),
  },
}));

const mockUser: AuthUser = {
  id: 1,
  email: 'jane@example.com',
  fullName: 'Jane Doe',
  role: 'customer',
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useRegister', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls authService.register with the given input', async () => {
    vi.mocked(authService.register).mockResolvedValue(mockUser);
    const { result } = renderHook(() => useRegister(), { wrapper });

    const input = { email: 'jane@example.com', password: 'password123', fullName: 'Jane Doe' };
    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(authService.register).toHaveBeenCalledWith(input);
    expect(result.current.data).toEqual(mockUser);
  });

  it('surfaces an error when the API call fails', async () => {
    vi.mocked(authService.register).mockRejectedValue(new Error('Email already exists'));
    const { result } = renderHook(() => useRegister(), { wrapper });

    result.current.mutate({
      email: 'jane@example.com',
      password: 'password123',
      fullName: 'Jane Doe',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error('Email already exists'));
  });
});
