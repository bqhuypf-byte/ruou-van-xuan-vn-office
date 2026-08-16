import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleTable } from './RoleTable';
import type { Role } from '../types/role.types';

const roles: Role[] = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'editor' },
];

describe('RoleTable', () => {
  it('renders a loading skeleton when isLoading is true', () => {
    const { container } = render(
      <RoleTable roles={[]} isLoading onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders an empty state when there are no roles', () => {
    render(
      <RoleTable roles={[]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText('Không tìm thấy vai trò nào')).toBeInTheDocument();
  });

  it('renders a row for each role with its id and name', () => {
    render(
      <RoleTable roles={roles} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('editor')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  it('marks the admin role with a System Admin badge and others as Standard Role', () => {
    render(
      <RoleTable roles={roles} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText('System Admin')).toBeInTheDocument();
    expect(screen.getByText('Standard Role')).toBeInTheDocument();
  });

  it('calls onEdit with the role when its edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <RoleTable roles={roles} isLoading={false} onEdit={onEdit} onDelete={vi.fn()} />,
    );

    const editButtons = screen.getAllByTitle('Chỉnh sửa');
    await user.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith(roles[0]);
  });

  it('calls onDelete with the role when its delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <RoleTable roles={roles} isLoading={false} onEdit={vi.fn()} onDelete={onDelete} />,
    );

    const deleteButtons = screen.getAllByTitle('Xóa');
    await user.click(deleteButtons[1]);

    expect(onDelete).toHaveBeenCalledWith(roles[1]);
  });
});
