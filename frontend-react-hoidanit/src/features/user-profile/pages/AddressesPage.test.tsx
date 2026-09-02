import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddressesPage } from './AddressesPage';
import { useAddresses } from '../hooks/useAddresses';
import {
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '../hooks/useAddressMutations';
import type { Address } from '../types/address.types';

vi.mock('../hooks/useAddresses');
vi.mock('../hooks/useAddressMutations');

const mockAddresses: Address[] = [
  { id: 1, userId: 1, fullName: 'Nguyen Van A', phone: '0901234567', addressLine: '123 ABC', city: 'HCM', isDefault: true },
  { id: 2, userId: 1, fullName: 'Nguyen Van A', phone: '0901234567', addressLine: '456 XYZ', city: 'Hanoi', isDefault: false },
];

const baseMutation = () => ({
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  isPending: false,
});

describe('AddressesPage', () => {
  beforeEach(() => {
    vi.mocked(useAddresses).mockReturnValue({
      addresses: mockAddresses,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useAddresses>);

    vi.mocked(useCreateAddress).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useCreateAddress>,
    );
    vi.mocked(useUpdateAddress).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useUpdateAddress>,
    );
    vi.mocked(useDeleteAddress).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useDeleteAddress>,
    );
    vi.mocked(useSetDefaultAddress).mockReturnValue(
      baseMutation() as unknown as ReturnType<typeof useSetDefaultAddress>,
    );
  });

  it('renders the page title and address cards', () => {
    render(<AddressesPage />);

    expect(screen.getByText('Địa Chỉ Của Tôi')).toBeInTheDocument();
    expect(screen.queryByText('Đổi Mật Khẩu')).not.toBeInTheDocument();
    expect(screen.getByText('123 ABC, HCM')).toBeInTheDocument();
    expect(screen.getByText('456 XYZ, Hanoi')).toBeInTheDocument();
    expect(screen.getAllByText('Mặc Định').length).toBeGreaterThan(0);
  });

  it('shows an API error banner with a retry button when loading fails', async () => {
    const refetch = vi.fn();
    vi.mocked(useAddresses).mockReturnValue({
      addresses: [],
      isLoading: false,
      isError: true,
      error: new Error('Network Error'),
      refetch,
    } as unknown as ReturnType<typeof useAddresses>);

    const user = userEvent.setup();
    render(<AddressesPage />);

    expect(screen.getByText(/Không thể tải danh sách địa chỉ/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Thử Lại' }));
    expect(refetch).toHaveBeenCalled();
  });

  it('creates an address via the form modal', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useCreateAddress).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateAddress>);

    const user = userEvent.setup();
    render(<AddressesPage />);

    await user.click(screen.getByRole('button', { name: /Thêm Địa Chỉ/i }));
    await user.type(screen.getByLabelText(/Họ Tên Người Nhận/i), 'Pham Van D');
    await user.type(screen.getByLabelText(/Số Điện Thoại/i), '0911222333');
    await user.type(screen.getByLabelText(/Số Nhà, Tên Đường/i), '99 Tran Phu');

    await user.selectOptions(screen.getByLabelText(/Tỉnh \/ Thành Phố/i), 'Thành phố Cần Thơ');
    const districtSelect = screen.getByLabelText(/Quận \/ Huyện/i);
    await waitFor(() => expect(districtSelect).not.toBeDisabled());
    await user.selectOptions(districtSelect, 'Quận Ninh Kiều');
    const wardSelect = screen.getByLabelText(/Phường \/ Xã/i);
    await waitFor(() => expect(wardSelect).not.toBeDisabled(), { timeout: 3000 });
    await user.selectOptions(wardSelect, 'Phường Cái Khế');

    const submitButtons = screen.getAllByRole('button', { name: 'Thêm Địa Chỉ' });
    await user.click(submitButtons[submitButtons.length - 1]);

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        fullName: 'Pham Van D',
        phone: '0911222333',
        addressLine: '99 Tran Phu, Phường Cái Khế, Quận Ninh Kiều',
        city: 'Thành phố Cần Thơ',
        isDefault: false,
      }),
    );
    expect(await screen.findByText('Đã thêm địa chỉ thành công.')).toBeInTheDocument();
  });

  it('deletes an address via the confirmation modal', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteAddress).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteAddress>);

    const user = userEvent.setup();
    render(<AddressesPage />);

    await user.click(screen.getAllByTitle('Xóa')[0]);
    await user.click(screen.getByRole('button', { name: 'Xóa Địa Chỉ' }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith(1));
    expect(await screen.findByText('Đã xóa địa chỉ thành công.')).toBeInTheDocument();
  });

  it('sets an address as default', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useSetDefaultAddress).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useSetDefaultAddress>);

    const user = userEvent.setup();
    render(<AddressesPage />);

    await user.click(screen.getByTitle('Đặt làm mặc định'));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith(2));
  });
});
