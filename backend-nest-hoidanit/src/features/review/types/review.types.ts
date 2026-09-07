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
