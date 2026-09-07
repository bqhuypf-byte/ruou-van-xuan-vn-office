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
