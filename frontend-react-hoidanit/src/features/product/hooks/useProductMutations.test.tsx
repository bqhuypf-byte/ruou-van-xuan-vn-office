import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from './useProductMutations';
import { productService } from '../services/product.service';
import type { Product } from '../types/product.types';

vi.mock('../services/product.service', () => ({
  productService: {
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

const mockProduct: Product = {
  id: 1,
  categoryId: 2,
  name: 'iPhone 15',
  slug: 'iphone-15',
  description: null,
  thumbnailUrl: null,
  isActive: true,
  isFeaturedDeal: false,
  dealSortOrder: 0,
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useCreateProduct', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls productService.createProduct with the given input', async () => {
    vi.mocked(productService.createProduct).mockResolvedValue(mockProduct);
    const { result } = renderHook(() => useCreateProduct(), { wrapper });

    result.current.mutate({ categoryId: 2, name: 'iPhone 15', slug: 'iphone-15' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(productService.createProduct).toHaveBeenCalledWith({
      categoryId: 2,
      name: 'iPhone 15',
      slug: 'iphone-15',
    });
  });
});

describe('useUpdateProduct', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls productService.updateProduct with id and input', async () => {
    vi.mocked(productService.updateProduct).mockResolvedValue(mockProduct);
    const { result } = renderHook(() => useUpdateProduct(), { wrapper });

    result.current.mutate({ id: 1, input: { isActive: false } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(productService.updateProduct).toHaveBeenCalledWith(1, { isActive: false });
  });
});

describe('useDeleteProduct', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls productService.deleteProduct with the id', async () => {
    vi.mocked(productService.deleteProduct).mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteProduct(), { wrapper });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(productService.deleteProduct).toHaveBeenCalledWith(1);
  });
});
