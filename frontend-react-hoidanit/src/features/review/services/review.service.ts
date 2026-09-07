import { axiosInstance } from '@/shared/lib/axios';
import type { CreateReviewInput, Review } from '../types/review.types';

export const reviewService = {
  getProductReviews: async (productId: number): Promise<Review[]> => {
    const response = await axiosInstance.get<{ data: Review[] }>(
      `/products/${productId}/reviews`,
    );
    return response.data.data;
  },
  createProductReview: async (
    productId: number,
    input: CreateReviewInput,
  ): Promise<Review> => {
    const response = await axiosInstance.post<{ data: Review }>(
      `/products/${productId}/reviews`,
      input,
    );
    return response.data.data;
  },
};
