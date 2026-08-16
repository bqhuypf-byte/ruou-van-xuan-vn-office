import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RolesPage } from './RolesPage';
import { useRoles } from '../hooks/useRoles';
import {
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from '../hooks/useRoleMutations';
import type { Role } from '../types/role.types';

vi.mock('../hooks/useRoles');
vi.mock('../hooks/useRoleMutations');

const mockRoles: Role[] = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'editor' },
];

const baseMutation = () => ({
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  isPending: false,
});

describe('RolesPage', () => {
  beforeEach(() => {
    vi.mocked(useRoles).mockReturnValue({
      roles: mockRoles,
      allRoles: mockRoles,
      totalCount: mockRoles.length,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useRoles>);

    vi.mocked(useCreateRole).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useCreateRole>,
    );
    vi.mocked(useUpdateRole).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useUpdateRole>,
    );
    vi.mocked(useDeleteRole).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useDeleteRole>,
    );
  });

  it('renders the page title and role metrics', () => {
    render(<RolesPage />);

    expect(screen.getByText('Quản Lý Vai Trò (Role CRUD)')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('editor')).toBeInTheDocument();
  });

  it('shows an API error banner with a retry button when loading fails', async () => {
    const refetch = vi.fn();
    vi.mocked(useRoles).mockReturnValue({
      roles: [],
      allRoles: [],
      totalCount: 0,
      isLoading: false,
      isError: true,
      error: new Error('Network Error'),
      refetch,
    } as unknown as ReturnType<typeof useRoles>);

    const user = userEvent.setup();
    render(<RolesPage />);

    expect(screen.getByText(/Không thể tải danh sách vai trò/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Thử Lại' }));
    expect(refetch).toHaveBeenCalled();
  });

  it('opens the create modal and creates a role, showing a success banner', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useCreateRole).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateRole>);

    const user = userEvent.setup();
    render(<RolesPage />);

    await user.click(screen.getByRole('button', { name: /Thêm Vai Trò/i }));
    await user.type(screen.getByLabelText(/Tên vai trò/i), 'support');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({ name: 'support' }),
    );
    expect(
      await screen.findByText('Đã tạo vai trò "support" thành công.'),
    ).toBeInTheDocument();
  });

  it('opens the edit modal prefilled and updates the role', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useUpdateRole).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateRole>);

    const user = userEvent.setup();
    render(<RolesPage />);

    await user.click(screen.getAllByTitle('Chỉnh sửa')[1]);
    expect(screen.getByLabelText(/Tên vai trò/i)).toHaveValue('editor');

    await user.clear(screen.getByLabelText(/Tên vai trò/i));
    await user.type(screen.getByLabelText(/Tên vai trò/i), 'content-editor');
    await user.click(screen.getByRole('button', { name: 'Cập Nhật' }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        id: 2,
        input: { name: 'content-editor' },
      }),
    );
  });

  it('deletes a role via the confirmation modal', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteRole).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteRole>);

    const user = userEvent.setup();
    render(<RolesPage />);

    await user.click(screen.getAllByTitle('Xóa')[0]);
    await user.click(screen.getByRole('button', { name: 'Xóa Vai Trò' }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith(1));
    expect(
      await screen.findByText('Đã xóa vai trò "admin" thành công.'),
    ).toBeInTheDocument();
  });

  it('shows an error banner when the create mutation fails', async () => {
    const mutateAsync = vi.fn().mockRejectedValue({
      response: { data: { message: 'Tên vai trò đã tồn tại' } },
    });
    vi.mocked(useCreateRole).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateRole>);

    const user = userEvent.setup();
    render(<RolesPage />);

    await user.click(screen.getByRole('button', { name: /Thêm Vai Trò/i }));
    await user.type(screen.getByLabelText(/Tên vai trò/i), 'admin');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    expect(
      await screen.findByText('Tên vai trò đã tồn tại'),
    ).toBeInTheDocument();
  });
});
