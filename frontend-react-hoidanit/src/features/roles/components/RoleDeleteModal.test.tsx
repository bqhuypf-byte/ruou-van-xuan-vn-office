import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleDeleteModal } from './RoleDeleteModal';
import type { Role } from '../types/role.types';

const role: Role = { id: 3, name: 'moderator' };

describe('RoleDeleteModal', () => {
  it('renders nothing when there is no role to delete', () => {
    const { container } = render(
      <RoleDeleteModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        roleToDelete={null}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('shows a confirmation message including the role name and id', () => {
    render(
      <RoleDeleteModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        roleToDelete={role}
      />,
    );

    expect(screen.getByText(/moderator/)).toBeInTheDocument();
    expect(screen.getByText(/#3/)).toBeInTheDocument();
  });

  it('calls onClose without confirming when Hủy Bỏ is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <RoleDeleteModal
        isOpen
        onClose={onClose}
        onConfirm={onConfirm}
        roleToDelete={role}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Hủy Bỏ' }));

    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('calls onConfirm then onClose when Xóa Vai Trò is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(
      <RoleDeleteModal
        isOpen
        onClose={onClose}
        onConfirm={onConfirm}
        roleToDelete={role}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Xóa Vai Trò' }));

    await waitFor(() => expect(onConfirm).toHaveBeenCalled());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
