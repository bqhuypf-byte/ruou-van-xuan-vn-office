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
    expect(screen.getByLabelText(/Số Nhà, Tên Đường/i)).toHaveValue('456 Le Loi');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('shows validation errors when submitting empty required fields', async () => {
    const user = userEvent.setup();
    render(<AddressFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Thêm Địa Chỉ' }));

    expect(await screen.findByText('Họ tên không được để trống')).toBeInTheDocument();
    expect(screen.getByText('Số điện thoại không được để trống')).toBeInTheDocument();
    expect(screen.getByText('Số nhà, tên đường không được để trống')).toBeInTheDocument();
    expect(screen.getByText('Vui lòng chọn Tỉnh/Thành phố')).toBeInTheDocument();
  });

  it('cascades district/ward selects and submits the composed address', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(<AddressFormModal isOpen onClose={onClose} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Họ Tên Người Nhận/i), 'Le Van C');
    await user.type(screen.getByLabelText(/Số Điện Thoại/i), '0987654321');
    await user.type(screen.getByLabelText(/Số Nhà, Tên Đường/i), '789 Nguyen Trai');

    const provinceSelect = screen.getByLabelText(/Tỉnh \/ Thành Phố/i);
    await user.selectOptions(provinceSelect, 'Thành phố Hà Nội');

    const districtSelect = screen.getByLabelText(/Quận \/ Huyện/i);
    await waitFor(() => expect(districtSelect).not.toBeDisabled());
    await user.selectOptions(districtSelect, 'Quận Ba Đình');

    const wardSelect = screen.getByLabelText(/Phường \/ Xã/i);
    await waitFor(() => expect(wardSelect).not.toBeDisabled(), { timeout: 3000 });
    await user.selectOptions(wardSelect, 'Phường Phúc Xá');

    await user.click(screen.getByRole('button', { name: 'Thêm Địa Chỉ' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        fullName: 'Le Van C',
        phone: '0987654321',
        addressLine: '789 Nguyen Trai, Phường Phúc Xá, Quận Ba Đình',
        city: 'Thành phố Hà Nội',
        isDefault: false,
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('shows a live error and blocks submit when the phone number has fewer than 10 digits', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AddressFormModal isOpen onClose={vi.fn()} onSubmit={onSubmit} />);

    const phoneInput = screen.getByLabelText(/Số Điện Thoại/i);
    await user.type(phoneInput, '05621');

    expect(await screen.findByText('Số điện thoại không hợp lệ')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Họ Tên Người Nhận/i), 'Nguyen Van E');
    await user.type(screen.getByLabelText(/Số Nhà, Tên Đường/i), '1 Test Street');
    await user.click(screen.getByRole('button', { name: 'Thêm Địa Chỉ' }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('strips non-digit characters and caps the phone number at 10 digits', async () => {
    const user = userEvent.setup();
    render(<AddressFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />);

    const phoneInput = screen.getByLabelText(/Số Điện Thoại/i);
    await user.type(phoneInput, '09-11 222 333 999');

    expect(phoneInput).toHaveValue('0911222333');
  });

  it('auto-detects province/district/ward from free-typed address text and shows a banner', async () => {
    const user = userEvent.setup();
    render(<AddressFormModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} />);

    const streetInput = screen.getByLabelText(/Số Nhà, Tên Đường/i);
    await user.click(streetInput);
    await user.paste('183 HT44 phường Hiệp Thành Quận 12');

    await waitFor(() => expect(screen.getByText(/Đã tự động nhận diện/i)).toBeInTheDocument(), {
      timeout: 5000,
    });

    expect(screen.getByLabelText(/Tỉnh \/ Thành Phố/i)).toHaveValue('79');
    await waitFor(() => expect(screen.getByLabelText(/Quận \/ Huyện/i)).toHaveValue('761'));
    await waitFor(() => expect(screen.getByLabelText(/Phường \/ Xã/i)).toHaveValue('26770'));
    expect(streetInput).toHaveValue('183 HT44');
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
