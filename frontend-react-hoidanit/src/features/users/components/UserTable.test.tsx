import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserTable } from './UserTable';
import type { User } from '../types/user.types';

const roles = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'editor' },
];

const users: User[] = [
  { id: 1, roleId: 1, email: 'admin@example.com', fullName: 'Admin User', isActive: true },
  { id: 2, roleId: null, email: 'jane@example.com', fullName: 'Jane Doe', isActive: false },
];

describe('UserTable', () => {
  it('renders a loading skeleton when isLoading is true', () => {
    const { container } = render(
      <UserTable users={[]} roles={roles} isLoading onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders an empty state when there are no users', () => {
    render(
      <UserTable users={[]} roles={roles} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText('Không tìm thấy người dùng nào')).toBeInTheDocument();
  });

  it('renders a row per user with name, email, resolved role name, and status', () => {
    render(
      <UserTable users={users} roles={roles} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('Đang hoạt động')).toBeInTheDocument();

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Chưa gán')).toBeInTheDocument();
    expect(screen.getByText('Vô hiệu hóa')).toBeInTheDocument();
  });

  it('calls onEdit with the user when its edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <UserTable users={users} roles={roles} isLoading={false} onEdit={onEdit} onDelete={vi.fn()} />,
    );

    await user.click(screen.getAllByTitle('Chỉnh sửa')[0]);

    expect(onEdit).toHaveBeenCalledWith(users[0]);
  });

  it('calls onDelete with the user when its delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <UserTable users={users} roles={roles} isLoading={false} onEdit={vi.fn()} onDelete={onDelete} />,
    );

    await user.click(screen.getAllByTitle('Xóa')[1]);

    expect(onDelete).toHaveBeenCalledWith(users[1]);
  });
});
