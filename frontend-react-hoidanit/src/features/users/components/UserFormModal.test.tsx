import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserFormModal } from './UserFormModal';
import { useRoles } from '@/features/roles';

vi.mock('@/features/roles', () => ({
  useRoles: vi.fn(),
}));

const mockRoles = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'editor' },
];

describe('UserFormModal', () => {
  beforeEach(() => {
    vi.mocked(useRoles).mockReturnValue({ roles: mockRoles } as unknown as ReturnType<
      typeof useRoles
    >);
  });

  it('renders create title with empty fields when no user is being edited', () => {
    render(<UserFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByText('Tạo Người Dùng Mới')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Mật khẩu')).toHaveValue('');
  });

  it('populates the role select with roles from useRoles', () => {
    render(<UserFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByRole('option', { name: 'admin' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'editor' })).toBeInTheDocument();
  });

  it('prefills fields and shows edit title when editing a user', () => {
    render(
      <UserFormModal
        isOpen
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        userToEdit={{
          id: 5,
          roleId: 2,
          email: 'jane@example.com',
          fullName: 'Jane Doe',
          phone: '0901234567',
          isActive: true,
        }}
      />,
    );

    expect(screen.getByText('Chỉnh Sửa Người Dùng')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveValue('jane@example.com');
    expect(screen.getByLabelText('Họ Tên')).toHaveValue('Jane Doe');
    expect(screen.getByLabelText('Số Điện Thoại')).toHaveValue('0901234567');
    expect(screen.getByLabelText(/Mật khẩu/)).toHaveValue('');
  });

  it('shows a validation error when email is invalid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<UserFormModal isOpen onClose={vi.fn()} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.type(screen.getByLabelText('Mật khẩu'), 'password123');
    await user.type(screen.getByLabelText('Họ Tên'), 'Jane Doe');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    expect(await screen.findByText('Email không hợp lệ')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('requires a password when creating a new user', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<UserFormModal isOpen onClose={vi.fn()} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Họ Tên'), 'Jane Doe');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    expect(
      await screen.findByText('Mật khẩu không được để trống'),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows a validation error for a too-short password', async () => {
    const user = userEvent.setup();
    render(<UserFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Mật khẩu'), 'short');
    await user.type(screen.getByLabelText('Họ Tên'), 'Jane Doe');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    expect(
      await screen.findByText('Mật khẩu tối thiểu 8 ký tự'),
    ).toBeInTheDocument();
  });

  it('allows submitting an edit with an empty password (keeps current password)', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(
      <UserFormModal
        isOpen
        onClose={onClose}
        onSubmit={onSubmit}
        userToEdit={{
          id: 5,
          roleId: null,
          email: 'jane@example.com',
          fullName: 'Jane Doe',
          isActive: true,
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Cập Nhật' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'jane@example.com',
          fullName: 'Jane Doe',
          password: undefined,
        }),
      ),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('submits create data with a selected role converted to a number', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<UserFormModal isOpen onClose={vi.fn()} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.type(screen.getByLabelText('Mật khẩu'), 'password123');
    await user.type(screen.getByLabelText('Họ Tên'), 'New User');
    await user.selectOptions(screen.getByLabelText('Vai Trò'), '2');
    await user.click(screen.getByRole('button', { name: 'Tạo Mới' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        fullName: 'New User',
        phone: undefined,
        roleId: 2,
        isActive: true,
      }),
    );
  });

  it('calls onClose when the cancel button is clicked without submitting', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(<UserFormModal isOpen onClose={onClose} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Hủy' }));

    expect(onClose).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<UserFormModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.queryByText('Tạo Người Dùng Mới')).not.toBeInTheDocument();
  });
});
