import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useCreateVariant, useUpdateVariant } from './useVariantMutations';
import { variantService } from '../services/variant.service';
import type { ProductVariant } from '../types/variant.types';

vi.mock('../services/variant.service', () => ({
  variantService: {
    createVariant: vi.fn(),
    updateVariant: vi.fn(),
  },
}));

const mockVariant: ProductVariant = {
  id: 1,
  productId: 1,
  sku: 'IP15-BLK-128',
  color: 'Black',
  size: '128GB',
  price: '999.99',
  salePrice: null,
  stockQuantity: 50,
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useCreateVariant', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls variantService.createVariant with productId and input', async () => {
    vi.mocked(variantService.createVariant).mockResolvedValue(mockVariant);
    const { result } = renderHook(() => useCreateVariant(), { wrapper });

    result.current.mutate({
      productId: 1,
      input: { sku: 'IP15-BLK-128', price: 999.99, stockQuantity: 50 },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(variantService.createVariant).toHaveBeenCalledWith(1, {
      sku: 'IP15-BLK-128',
      price: 999.99,
      stockQuantity: 50,
    });
  });
});

describe('useUpdateVariant', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls variantService.updateVariant with id and input', async () => {
    vi.mocked(variantService.updateVariant).mockResolvedValue(mockVariant);
    const { result } = renderHook(() => useUpdateVariant(), { wrapper });

    result.current.mutate({ id: 1, input: { stockQuantity: 40 } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(variantService.updateVariant).toHaveBeenCalledWith(1, { stockQuantity: 40 });
  });
});
