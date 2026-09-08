export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  imageUrls: string[];
  createdAt: string;
  user: {
    id: number | null;
    fullName: string;
  };
}

export interface CreateReviewInput {
  fullName: string;
  email: string;
  phone: string;
  rating: number;
  comment?: string;
  imageUrls?: string[];
}

export const REVIEW_STATUSES = ['pending', 'approved', 'hidden'] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export interface AdminReview extends Review {
  status: ReviewStatus;
  reviewerEmail: string | null;
  reviewerPhone: string | null;
  orderId: number | null;
  product: {
    id: number;
    name: string;
    slug: string;
    thumbnailUrl: string | null;
  };
}

export interface AdminReviewFilters {
  status?: ReviewStatus;
  rating?: number;
  productId?: number;
  search?: string;
}
