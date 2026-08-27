export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  attributes: Record<string, string> | null;
  price: string;
  salePrice: string | null;
  stockQuantity: number;
  imageUrl: string | null;
}

export interface CreateVariantInput {
  sku: string;
  attributes?: Record<string, string>;
  price: number;
  salePrice?: number;
  stockQuantity?: number;
  imageUrl?: string;
}

export interface UpdateVariantInput {
  sku?: string;
  attributes?: Record<string, string>;
  price?: number;
  salePrice?: number;
  stockQuantity?: number;
  imageUrl?: string;
}
