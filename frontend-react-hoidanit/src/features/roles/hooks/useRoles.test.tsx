import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useRoles } from './useRoles';
import { roleService } from '../services/role.service';
import type { Role } from '../types/role.types';

vi.mock('../services/role.service', () => ({
  roleService: {
    getRoles: vi.fn(),
  },
}));

const mockRoles: Role[] = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'moderator' },
  { id: 3, name: 'editor' },
];

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useRoles', () => {
  beforeEach(() => {
    vi.mocked(roleService.getRoles).mockResolvedValue(mockRoles);
  });

  it('returns all roles when no search filter is given', async () => {
    const { result } = renderHook(() => useRoles(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.roles).toHaveLength(3);
    expect(result.current.allRoles).toHaveLength(3);
    expect(result.current.totalCount).toBe(3);
  });

  it('filters roles by name (case-insensitive)', async () => {
    const { result } = renderHook(() => useRoles({ search: 'ADMIN' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.roles).toEqual([{ id: 1, name: 'admin' }]);
    expect(result.current.totalCount).toBe(3);
  });

  it('filters roles by id', async () => {
    const { result } = renderHook(() => useRoles({ search: '2' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.roles).toEqual([{ id: 2, name: 'moderator' }]);
  });

  it('returns empty roles array when search matches nothing', async () => {
    const { result } = renderHook(() => useRoles({ search: 'nope' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.roles).toEqual([]);
    expect(result.current.allRoles).toHaveLength(3);
  });
});
