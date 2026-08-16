import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useCreateRole, useUpdateRole, useDeleteRole } from './useRoleMutations';
import { roleService } from '../services/role.service';
import type { Role } from '../types/role.types';

vi.mock('../services/role.service', () => ({
  roleService: {
    createRole: vi.fn(),
    updateRole: vi.fn(),
    deleteRole: vi.fn(),
  },
}));

const mockRole: Role = { id: 1, name: 'editor' };

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCreateRole', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls roleService.createRole with the given input', async () => {
    vi.mocked(roleService.createRole).mockResolvedValue(mockRole);
    const { result } = renderHook(() => useCreateRole(), { wrapper });

    result.current.mutate({ name: 'editor' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(roleService.createRole).toHaveBeenCalledWith({ name: 'editor' });
  });

  it('surfaces an error when the API call fails', async () => {
    vi.mocked(roleService.createRole).mockRejectedValue(new Error('conflict'));
    const { result } = renderHook(() => useCreateRole(), { wrapper });

    result.current.mutate({ name: 'editor' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error('conflict'));
  });
});

describe('useUpdateRole', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls roleService.updateRole with id and input', async () => {
    vi.mocked(roleService.updateRole).mockResolvedValue(mockRole);
    const { result } = renderHook(() => useUpdateRole(), { wrapper });

    result.current.mutate({ id: 1, input: { name: 'editor' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(roleService.updateRole).toHaveBeenCalledWith(1, { name: 'editor' });
  });
});

describe('useDeleteRole', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls roleService.deleteRole with the id', async () => {
    vi.mocked(roleService.deleteRole).mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteRole(), { wrapper });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(roleService.deleteRole).toHaveBeenCalledWith(1);
  });
});
