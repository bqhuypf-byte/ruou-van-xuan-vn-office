export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string | null;
  imageUrls: string[];
  createdAt: Date;
  user: {
    id: number | null;
    fullName: string;
  };
}

export interface AdminReviewResponse extends ReviewResponse {
  status: import('../entities/review.entity').ReviewStatus;
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
