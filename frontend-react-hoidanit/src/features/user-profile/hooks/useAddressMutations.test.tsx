import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import {
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from './useAddressMutations';
import { addressService } from '../services/address.service';
import type { Address } from '../types/address.types';

vi.mock('../services/address.service', () => ({
  addressService: {
    createAddress: vi.fn(),
    updateAddress: vi.fn(),
    deleteAddress: vi.fn(),
    setDefaultAddress: vi.fn(),
  },
}));

const mockAddress: Address = {
  id: 1,
  userId: 1,
  fullName: 'Nguyen Van A',
  phone: '0901234567',
  addressLine: '123 ABC',
  city: 'HCM',
  isDefault: false,
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useCreateAddress', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls addressService.createAddress with the given input', async () => {
    vi.mocked(addressService.createAddress).mockResolvedValue(mockAddress);
    const { result } = renderHook(() => useCreateAddress(), { wrapper });

    result.current.mutate({
      fullName: 'Nguyen Van A',
      phone: '0901234567',
      addressLine: '123 ABC',
      city: 'HCM',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(addressService.createAddress).toHaveBeenCalledWith({
      fullName: 'Nguyen Van A',
      phone: '0901234567',
      addressLine: '123 ABC',
      city: 'HCM',
    });
  });
});

describe('useUpdateAddress', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls addressService.updateAddress with id and input', async () => {
    vi.mocked(addressService.updateAddress).mockResolvedValue(mockAddress);
    const { result } = renderHook(() => useUpdateAddress(), { wrapper });

    result.current.mutate({ id: 1, input: { city: 'Da Nang' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(addressService.updateAddress).toHaveBeenCalledWith(1, { city: 'Da Nang' });
  });
});

describe('useDeleteAddress', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls addressService.deleteAddress with the id', async () => {
    vi.mocked(addressService.deleteAddress).mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteAddress(), { wrapper });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(addressService.deleteAddress).toHaveBeenCalledWith(1);
  });
});

describe('useSetDefaultAddress', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls addressService.setDefaultAddress with the id', async () => {
    vi.mocked(addressService.setDefaultAddress).mockResolvedValue({ ...mockAddress, isDefault: true });
    const { result } = renderHook(() => useSetDefaultAddress(), { wrapper });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(addressService.setDefaultAddress).toHaveBeenCalledWith(1);
  });
});
