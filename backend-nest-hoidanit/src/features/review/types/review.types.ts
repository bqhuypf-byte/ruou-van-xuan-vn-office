export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    id: number;
    fullName: string;
  };
}
