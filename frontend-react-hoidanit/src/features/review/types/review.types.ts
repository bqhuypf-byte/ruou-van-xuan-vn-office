export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  imageUrls: string[];
  createdAt: string;
  user: {
    id: number;
    fullName: string;
  };
}

export interface CreateReviewInput {
  orderId: number;
  rating: number;
  comment?: string;
  imageUrls?: string[];
}
