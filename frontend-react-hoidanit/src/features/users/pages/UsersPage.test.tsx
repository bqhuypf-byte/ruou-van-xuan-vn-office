import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsersPage } from './UsersPage';
import { useUsers } from '../hooks/useUsers';
import {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../hooks/useUserMutations';
import { useRoles } from '@/features/roles';
import type { User } from '../types/user.types';

vi.mock('../hooks/useUsers');
vi.mock('../hooks/useUserMutations');
vi.mock('@/features/roles', () => ({
  useRoles: vi.fn(),
}));

const mockUsers: User[] = [
  { id: 1, roleId: 1, email: 'admin@example.com', fullName: 'Admin User', isActive: true },
  { id: 2, roleId: null, email: 'jane@example.com', fullName: 'Jane Doe', isActive: true },
];

const mockRoles = [{ id: 1, name: 'admin' }];

const baseMutation = () => ({
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  isPending: false,
});

describe('UsersPage', () => {
  beforeEach(() => {
    vi.mocked(useUsers).mockReturnValue({
      users: mockUsers,
      allUsers: mockUsers,
      totalCount: mockUsers.length,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useUsers>);

    vi.mocked(useRoles).mockReturnValue({
      roles: mockRoles,
    } as unknown as ReturnType<typeof useRoles>);

    vi.mocked(useCreateUser).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useCreateUser>,
    );
    vi.mocked(useUpdateUser).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useUpdateUser>,
    );
    vi.mocked(useDeleteUser).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useDeleteUser>,
    );
  });

  it('renders the page title and user list', () => {
    render(<UsersPage />);

    expect(screen.getByText('Quản Lý Người Dùng (User CRUD)')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('shows an API error banner with a retry button when loading fails', async () => {
    const refetch = vi.fn();
    vi.mocked(useUsers).mockReturnValue({
      users: [],
      allUsers: [],
      totalCount: 0,
      isLoading: false,
      isError: true,
      error: new Error('Network Error'),
      refetch,
    } as unknown as ReturnType<typeof useUsers>);

    const user = userEvent.setup();
    render(<UsersPage />);

    expect(screen.getByText(/Không thể tải danh sách người dùng/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Thử Lại' }));
    expect(refetch).toHaveBeenCalled();
  });

  it('opens the create modal and creates a user, showing a success banner', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useCreateUser).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateUser>);

    const user = userEvent.setup();
    render(<UsersPage />);

    await user.click(screen.getByRole('button', { name: /Thêm Người Dùng/i }));
    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.type(screen.getByLabelText('Mật khẩu'), 'password123');
    await user.type(screen.getByLabelText('Họ Tên'), 'New User');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@example.com',
          password: 'password123',
          fullName: 'New User',
        }),
      ),
    );
    expect(
      await screen.findByText('Đã tạo người dùng "New User" thành công.'),
    ).toBeInTheDocument();
  });

  it('opens the edit modal prefilled and updates the user without sending a password field', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useUpdateUser).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateUser>);

    const user = userEvent.setup();
    render(<UsersPage />);

    await user.click(screen.getAllByTitle('Chỉnh sửa')[1]);
    expect(screen.getByLabelText('Email')).toHaveValue('jane@example.com');

    await user.click(screen.getByRole('button', { name: 'Cập Nhật' }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    const call = mutateAsync.mock.calls[0][0];
    expect(call.id).toBe(2);
    expect(call.input).not.toHaveProperty('password');
    expect(call.input.email).toBe('jane@example.com');
  });

  it('deletes a user via the confirmation modal', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteUser).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteUser>);

    const user = userEvent.setup();
    render(<UsersPage />);

    await user.click(screen.getAllByTitle('Xóa')[0]);
    await user.click(screen.getByRole('button', { name: 'Xóa Người Dùng' }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith(1));
    expect(
      await screen.findByText('Đã xóa người dùng "Admin User" thành công.'),
    ).toBeInTheDocument();
  });

  it('shows an error banner when the create mutation fails', async () => {
    const mutateAsync = vi.fn().mockRejectedValue({
      response: { data: { message: 'Email đã tồn tại' } },
    });
    vi.mocked(useCreateUser).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateUser>);

    const user = userEvent.setup();
    render(<UsersPage />);

    await user.click(screen.getByRole('button', { name: /Thêm Người Dùng/i }));
    await user.type(screen.getByLabelText('Email'), 'admin@example.com');
    await user.type(screen.getByLabelText('Mật khẩu'), 'password123');
    await user.type(screen.getByLabelText('Họ Tên'), 'Admin User');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    expect(await screen.findByText('Email đã tồn tại')).toBeInTheDocument();
  });
});
