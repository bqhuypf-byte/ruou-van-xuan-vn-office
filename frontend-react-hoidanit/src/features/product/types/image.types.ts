export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  sortOrder: number;
}

export interface AddImagesInput {
  images: { imageUrl: string; sortOrder?: number }[];
}

export interface ReorderImagesInput {
  imageIds: number[];
}
