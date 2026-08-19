import { axiosInstance } from '@/shared/lib/axios';
import type { Review } from '../types/review.types';

export const reviewService = {
  getProductReviews: async (productId: number): Promise<Review[]> => {
    const response = await axiosInstance.get<{ data: Review[] }>(
      `/products/${productId}/reviews`,
    );
    return response.data.data;
  },
};
