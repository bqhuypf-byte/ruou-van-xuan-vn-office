import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';

export const REVIEW_QUERY_KEY = ['reviews'] as const;

export const useProductReviews = (productId: number | undefined) => {
  const query = useQuery({
    queryKey: [...REVIEW_QUERY_KEY, productId],
    queryFn: () => reviewService.getProductReviews(productId as number),
    enabled: productId !== undefined,
  });

  const reviews = query.data ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return { ...query, reviews, averageRating, reviewCount: reviews.length };
};
