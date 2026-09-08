import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { REVIEW_QUERY_KEY } from './useProductReviews';
import type { AdminReviewFilters, ReviewStatus } from '../types/review.types';

export const ADMIN_REVIEWS_QUERY_KEY = ['admin-reviews'] as const;

export const useAdminReviews = (filters?: AdminReviewFilters) => {
  const query = useQuery({
    queryKey: [...ADMIN_REVIEWS_QUERY_KEY, filters ?? {}],
    queryFn: () => reviewService.getAdminReviews(filters),
  });
  return { ...query, reviews: query.data ?? [] };
};

export const useModerateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ReviewStatus }) =>
      reviewService.moderateReview(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEY });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEY });
    },
  });
};
