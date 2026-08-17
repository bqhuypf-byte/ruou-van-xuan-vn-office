export interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
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
}

export interface UpdateProductInput {
  categoryId?: number;
  name?: string;
  slug?: string;
  description?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
}

export interface ProductFilterParams {
  search?: string;
  categoryId?: number;
  page?: number;
  limit?: number;
}
