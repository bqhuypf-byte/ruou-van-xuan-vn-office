import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useProductReviews } from './useProductReviews';
import { reviewService } from '../services/review.service';
import type { Review } from '../types/review.types';

vi.mock('../services/review.service', () => ({
  reviewService: {
    getProductReviews: vi.fn(),
  },
}));

const mockReviews: Review[] = [
  { id: 1, rating: 5, comment: 'Great!', createdAt: '2026-01-01T00:00:00Z', user: { id: 1, fullName: 'A' } },
  { id: 2, rating: 3, comment: 'Okay', createdAt: '2026-01-02T00:00:00Z', user: { id: 2, fullName: 'B' } },
];

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useProductReviews', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches reviews for the given product id and computes the average rating', async () => {
    vi.mocked(reviewService.getProductReviews).mockResolvedValue(mockReviews);
    const { result } = renderHook(() => useProductReviews(30), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(reviewService.getProductReviews).toHaveBeenCalledWith(30);
    expect(result.current.reviews).toHaveLength(2);
    expect(result.current.reviewCount).toBe(2);
    expect(result.current.averageRating).toBe(4);
  });

  it('returns zero average rating when there are no reviews', async () => {
    vi.mocked(reviewService.getProductReviews).mockResolvedValue([]);
    const { result } = renderHook(() => useProductReviews(30), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.averageRating).toBe(0);
    expect(result.current.reviewCount).toBe(0);
  });

  it('does not fetch when productId is undefined', () => {
    renderHook(() => useProductReviews(undefined), { wrapper });

    expect(reviewService.getProductReviews).not.toHaveBeenCalled();
  });
});
