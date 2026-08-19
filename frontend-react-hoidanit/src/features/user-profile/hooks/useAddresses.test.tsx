import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useAddresses } from './useAddresses';
import { addressService } from '../services/address.service';
import type { Address } from '../types/address.types';

vi.mock('../services/address.service', () => ({
  addressService: {
    getAddresses: vi.fn(),
  },
}));

const mockAddresses: Address[] = [
  { id: 1, userId: 1, fullName: 'Nguyen Van A', phone: '0901234567', addressLine: '123 ABC', city: 'HCM', isDefault: true },
  { id: 2, userId: 1, fullName: 'Nguyen Van A', phone: '0901234567', addressLine: '456 XYZ', city: 'Hanoi', isDefault: false },
];

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useAddresses', () => {
  beforeEach(() => {
    vi.mocked(addressService.getAddresses).mockResolvedValue(mockAddresses);
  });

  it('returns the list of addresses', async () => {
    const { result } = renderHook(() => useAddresses(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.addresses).toHaveLength(2);
    expect(result.current.addresses[0].isDefault).toBe(true);
  });

  it('returns an empty array before data loads', () => {
    const { result } = renderHook(() => useAddresses(), { wrapper });

    expect(result.current.addresses).toEqual([]);
  });
});
