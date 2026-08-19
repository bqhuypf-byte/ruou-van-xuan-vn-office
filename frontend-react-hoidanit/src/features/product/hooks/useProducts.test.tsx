import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useProducts } from './useProducts';
import { productService } from '../services/product.service';
import type { Product } from '../types/product.types';

vi.mock('../services/product.service', () => ({
  productService: {
    getProducts: vi.fn(),
  },
}));

const mockProducts: Product[] = [
  { id: 1, categoryId: 2, name: 'iPhone 15', slug: 'iphone-15', description: null, thumbnailUrl: null, isActive: true, isFeaturedDeal: false, dealSortOrder: 0 },
  { id: 2, categoryId: 3, name: 'MacBook Pro', slug: 'macbook-pro', description: null, thumbnailUrl: null, isActive: true, isFeaturedDeal: false, dealSortOrder: 0 },
];

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useProducts', () => {
  beforeEach(() => {
    vi.mocked(productService.getProducts).mockResolvedValue({
      products: mockProducts,
      meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
    });
  });

  it('returns products and pagination meta', async () => {
    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.products).toHaveLength(2);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.meta?.totalPages).toBe(1);
  });

  it('requests the given page, limit, and categoryId', async () => {
    renderHook(() => useProducts({ page: 2, limit: 5, categoryId: 3 }), { wrapper });

    await waitFor(() =>
      expect(productService.getProducts).toHaveBeenCalledWith({
        search: undefined,
        categoryId: 3,
        isActive: undefined,
        page: 2,
        limit: 5,
      }),
    );
  });

  it('passes the search term to the server', async () => {
    renderHook(() => useProducts({ search: 'macbook' }), { wrapper });

    await waitFor(() =>
      expect(productService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'macbook' }),
      ),
    );
  });
});
