import { axiosInstance } from '@/shared/lib/axios';
import type {
  AdminReview,
  AdminReviewFilters,
  CreateReviewInput,
  Review,
  ReviewStatus,
} from '../types/review.types';

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
  getAdminReviews: async (filters?: AdminReviewFilters): Promise<AdminReview[]> => {
    const response = await axiosInstance.get<{ data: AdminReview[] }>('/admin/reviews', {
      params: filters,
    });
    return response.data.data;
  },
  moderateReview: async (id: number, status: ReviewStatus): Promise<void> => {
    await axiosInstance.patch(`/admin/reviews/${id}/status`, { status });
  },
  deleteReview: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/reviews/${id}`);
  },
};
