export interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
  isFeaturedDeal: boolean;
  dealSortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  categoryId: number;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  isFeaturedDeal?: boolean;
  dealSortOrder?: number;
}

export interface UpdateProductInput {
  categoryId?: number;
  name?: string;
  slug?: string;
  description?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  isFeaturedDeal?: boolean;
  dealSortOrder?: number;
}

export interface ProductFilterParams {
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  isFeaturedDeal?: boolean;
  page?: number;
  limit?: number;
}
