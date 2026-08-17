import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useProductDetail } from './useProductDetail';
import { productService } from '../services/product.service';
import type { ProductDetail } from '../services/product.service';

vi.mock('../services/product.service', () => ({
  productService: {
    getProductBySlug: vi.fn(),
  },
}));

const mockDetail: ProductDetail = {
  id: 1,
  categoryId: 2,
  name: 'iPhone 15',
  slug: 'iphone-15',
  description: null,
  thumbnailUrl: null,
  isActive: true,
  variants: [],
  images: [],
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useProductDetail', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches the product by slug when a slug is given', async () => {
    vi.mocked(productService.getProductBySlug).mockResolvedValue(mockDetail);
    const { result } = renderHook(() => useProductDetail('iphone-15'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(productService.getProductBySlug).toHaveBeenCalledWith('iphone-15');
    expect(result.current.data).toEqual(mockDetail);
  });

  it('does not fetch when slug is undefined', () => {
    renderHook(() => useProductDetail(undefined), { wrapper });

    expect(productService.getProductBySlug).not.toHaveBeenCalled();
  });
});
