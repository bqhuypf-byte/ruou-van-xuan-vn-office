import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import type { CreateReviewInput } from '../types/review.types';
import { REVIEW_QUERY_KEY } from './useProductReviews';

export const useCreateReview = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReviewInput) =>
      reviewService.createProductReview(productId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...REVIEW_QUERY_KEY, productId] });
      void queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
