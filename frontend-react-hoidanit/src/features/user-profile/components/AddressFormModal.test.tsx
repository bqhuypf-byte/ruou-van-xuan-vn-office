import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddressFormModal } from './AddressFormModal';
import type { Address } from '../types/address.types';

const mockAddress: Address = {
  id: 3,
  userId: 1,
  fullName: 'Tran Thi B',
  phone: '0912345678',
  addressLine: '456 Le Loi',
  city: 'Da Nang',
  isDefault: true,
};

describe('AddressFormModal', () => {
  it('renders create title and empty fields when no address is being edited', () => {
    render(<AddressFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByText('Thêm Địa Chỉ Mới')).toBeInTheDocument();
    expect(screen.getByLabelText(/Họ Tên Người Nhận/i)).toHaveValue('');
  });

  it('prefills fields and shows edit title when editing an address', () => {
    render(<AddressFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} addressToEdit={mockAddress} />);

    expect(screen.getByText('Chỉnh Sửa Địa Chỉ')).toBeInTheDocument();
    expect(screen.getByLabelText(/Họ Tên Người Nhận/i)).toHaveValue('Tran Thi B');
    expect(screen.getByLabelText(/Tỉnh \/ Thành Phố/i)).toHaveValue('Da Nang');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('shows validation errors when submitting empty required fields', async () => {
    const user = userEvent.setup();
    render(<AddressFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Thêm Địa Chỉ' }));

    expect(await screen.findByText('Họ tên không được để trống')).toBeInTheDocument();
    expect(screen.getByText('Số điện thoại không được để trống')).toBeInTheDocument();
    expect(screen.getByText('Địa chỉ không được để trống')).toBeInTheDocument();
    expect(screen.getByText('Tỉnh/Thành phố không được để trống')).toBeInTheDocument();
  });

  it('submits the form data and closes the modal on valid input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(<AddressFormModal isOpen onClose={onClose} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Họ Tên Người Nhận/i), 'Le Van C');
    await user.type(screen.getByLabelText(/Số Điện Thoại/i), '0987654321');
    await user.type(screen.getByLabelText(/^Địa Chỉ$/i), '789 Nguyen Trai');
    await user.type(screen.getByLabelText(/Tỉnh \/ Thành Phố/i), 'Hue');
    await user.click(screen.getByRole('button', { name: 'Thêm Địa Chỉ' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        fullName: 'Le Van C',
        phone: '0987654321',
        addressLine: '789 Nguyen Trai',
        city: 'Hue',
        isDefault: false,
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('calls onClose when the cancel button is clicked without submitting', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(<AddressFormModal isOpen onClose={onClose} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Hủy' }));

    expect(onClose).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<AddressFormModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.queryByText('Thêm Địa Chỉ Mới')).not.toBeInTheDocument();
  });
});
