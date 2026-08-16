import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useUsers } from './useUsers';
import { userService } from '../services/user.service';
import type { User } from '../types/user.types';

vi.mock('../services/user.service', () => ({
  userService: {
    getUsers: vi.fn(),
  },
}));

const mockUsers: User[] = [
  { id: 1, roleId: 1, email: 'admin@example.com', fullName: 'Admin User', isActive: true },
  { id: 2, roleId: 2, email: 'jane@example.com', fullName: 'Jane Doe', isActive: true },
  { id: 3, roleId: null, email: 'inactive@example.com', fullName: 'Old Account', isActive: false },
];

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useUsers', () => {
  beforeEach(() => {
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);
  });

  it('returns all users when no search filter is given', async () => {
    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.users).toHaveLength(3);
    expect(result.current.allUsers).toHaveLength(3);
    expect(result.current.totalCount).toBe(3);
  });

  it('filters users by full name (case-insensitive)', async () => {
    const { result } = renderHook(() => useUsers({ search: 'JANE' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.users).toEqual([mockUsers[1]]);
  });

  it('filters users by email', async () => {
    const { result } = renderHook(() => useUsers({ search: 'inactive@' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.users).toEqual([mockUsers[2]]);
  });

  it('filters users by id', async () => {
    const { result } = renderHook(() => useUsers({ search: '2' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.users).toEqual([mockUsers[1]]);
  });

  it('returns empty users array when search matches nothing', async () => {
    const { result } = renderHook(() => useUsers({ search: 'nope' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.users).toEqual([]);
    expect(result.current.allUsers).toHaveLength(3);
  });
});
