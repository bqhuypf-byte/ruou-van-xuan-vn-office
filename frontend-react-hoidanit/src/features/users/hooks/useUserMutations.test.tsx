import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useCreateUser, useUpdateUser, useDeleteUser } from './useUserMutations';
import { userService } from '../services/user.service';
import type { User } from '../types/user.types';

vi.mock('../services/user.service', () => ({
  userService: {
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

const mockUser: User = {
  id: 1,
  roleId: 2,
  email: 'jane@example.com',
  fullName: 'Jane Doe',
  isActive: true,
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCreateUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls userService.createUser with the given input', async () => {
    vi.mocked(userService.createUser).mockResolvedValue(mockUser);
    const { result } = renderHook(() => useCreateUser(), { wrapper });

    result.current.mutate({
      email: 'jane@example.com',
      password: 'password123',
      fullName: 'Jane Doe',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(userService.createUser).toHaveBeenCalledWith({
      email: 'jane@example.com',
      password: 'password123',
      fullName: 'Jane Doe',
    });
  });

  it('surfaces an error when the API call fails', async () => {
    vi.mocked(userService.createUser).mockRejectedValue(new Error('conflict'));
    const { result } = renderHook(() => useCreateUser(), { wrapper });

    result.current.mutate({
      email: 'jane@example.com',
      password: 'password123',
      fullName: 'Jane Doe',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error('conflict'));
  });
});

describe('useUpdateUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls userService.updateUser with id and input', async () => {
    vi.mocked(userService.updateUser).mockResolvedValue(mockUser);
    const { result } = renderHook(() => useUpdateUser(), { wrapper });

    result.current.mutate({ id: 1, input: { fullName: 'Jane Updated' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(userService.updateUser).toHaveBeenCalledWith(1, {
      fullName: 'Jane Updated',
    });
  });
});

describe('useDeleteUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls userService.deleteUser with the id', async () => {
    vi.mocked(userService.deleteUser).mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteUser(), { wrapper });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(userService.deleteUser).toHaveBeenCalledWith(1);
  });
});
