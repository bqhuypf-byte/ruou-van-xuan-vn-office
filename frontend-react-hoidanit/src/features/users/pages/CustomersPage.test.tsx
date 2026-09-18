import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRoles } from '@/features/roles';
import { useUpdateUser } from '../hooks/useUserMutations';
import { useUsers } from '../hooks/useUsers';
import { CustomersPage } from './CustomersPage';

vi.mock('@/features/roles', () => ({ useRoles: vi.fn() }));
vi.mock('../hooks/useUsers');
vi.mock('../hooks/useUserMutations');

describe('CustomersPage', () => {
  const mutateAsync = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRoles).mockReturnValue({
      allRoles: [
        { id: 1, name: 'admin' },
        { id: 2, name: 'customer' },
      ],
    } as ReturnType<typeof useRoles>);
    vi.mocked(useUsers).mockReturnValue({
      allUsers: [
        { id: 1, roleId: 1, fullName: 'Quản trị', email: 'admin@example.com', isActive: true },
        { id: 2, roleId: 2, fullName: 'Nguyễn Văn A', email: 'a@example.com', phone: '0901234567', isActive: true, createdAt: '2026-09-18T08:00:00.000Z' },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useUsers>);
    vi.mocked(useUpdateUser).mockReturnValue({ mutateAsync, isPending: false } as unknown as ReturnType<typeof useUpdateUser>);
  });

  it('shows only registered customers', () => {
    render(<CustomersPage />);
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
    expect(screen.queryByText('Quản trị')).not.toBeInTheDocument();
    expect(screen.getByText('0901234567')).toBeInTheDocument();
  });

  it('locks an active customer account', async () => {
    const user = userEvent.setup();
    render(<CustomersPage />);
    await user.click(screen.getByRole('button', { name: 'Khóa' }));
    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({ id: 2, input: { isActive: false } }),
    );
  });
});
