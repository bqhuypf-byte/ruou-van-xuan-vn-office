import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleFormModal } from './RoleFormModal';

describe('RoleFormModal', () => {
  it('renders create title and empty field when no role is being edited', () => {
    render(
      <RoleFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />,
    );

    expect(screen.getByText('Tạo Vai Trò Mới')).toBeInTheDocument();
    expect(screen.getByLabelText(/Tên vai trò/i)).toHaveValue('');
  });

  it('prefills the field and shows edit title when editing a role', () => {
    render(
      <RoleFormModal
        isOpen
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        roleToEdit={{ id: 5, name: 'moderator' }}
      />,
    );

    expect(screen.getByText('Chỉnh Sửa Vai Trò')).toBeInTheDocument();
    expect(screen.getByLabelText(/Tên vai trò/i)).toHaveValue('moderator');
  });

  it('shows a validation error when submitting an empty name', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RoleFormModal isOpen onClose={vi.fn()} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /Tạo Mới/i }));

    expect(
      await screen.findByText('Tên vai trò không được để trống'),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows a validation error for names with invalid characters', async () => {
    const user = userEvent.setup();
    render(<RoleFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/Tên vai trò/i), 'admin role!');
    await user.click(screen.getByRole('button', { name: /Tạo Mới/i }));

    expect(
      await screen.findByText(
        'Tên vai trò chỉ chứa chữ cái, số, dấu gạch ngang (-) hoặc gạch dưới (_)',
      ),
    ).toBeInTheDocument();
  });

  it('submits the form data and closes the modal on valid input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(<RoleFormModal isOpen onClose={onClose} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Tên vai trò/i), 'moderator');
    await user.click(screen.getByRole('button', { name: /Tạo Mới/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ name: 'moderator' }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('calls onClose when the cancel button is clicked without submitting', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(<RoleFormModal isOpen onClose={onClose} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Hủy' }));

    expect(onClose).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<RoleFormModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.queryByText('Tạo Vai Trò Mới')).not.toBeInTheDocument();
  });
});
