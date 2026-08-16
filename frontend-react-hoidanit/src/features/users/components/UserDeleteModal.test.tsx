import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserDeleteModal } from './UserDeleteModal';
import type { User } from '../types/user.types';

const user: User = {
  id: 3,
  roleId: 1,
  email: 'jane@example.com',
  fullName: 'Jane Doe',
  isActive: true,
};

describe('UserDeleteModal', () => {
  it('renders nothing when there is no user to delete', () => {
    const { container } = render(
      <UserDeleteModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        userToDelete={null}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('shows a confirmation message including the user name and id', () => {
    render(
      <UserDeleteModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        userToDelete={user}
      />,
    );

    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    expect(screen.getByText(/#3/)).toBeInTheDocument();
  });

  it('calls onClose without confirming when Hủy Bỏ is clicked', async () => {
    const userEventInstance = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <UserDeleteModal
        isOpen
        onClose={onClose}
        onConfirm={onConfirm}
        userToDelete={user}
      />,
    );

    await userEventInstance.click(screen.getByRole('button', { name: 'Hủy Bỏ' }));

    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('calls onConfirm then onClose when Xóa Người Dùng is clicked', async () => {
    const userEventInstance = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(
      <UserDeleteModal
        isOpen
        onClose={onClose}
        onConfirm={onConfirm}
        userToDelete={user}
      />,
    );

    await userEventInstance.click(
      screen.getByRole('button', { name: 'Xóa Người Dùng' }),
    );

    await waitFor(() => expect(onConfirm).toHaveBeenCalled());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
