export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  color: string | null;
  size: string | null;
  price: string;
  salePrice: string | null;
  stockQuantity: number;
}

export interface CreateVariantInput {
  sku: string;
  color?: string;
  size?: string;
  price: number;
  salePrice?: number;
  stockQuantity?: number;
}

export interface UpdateVariantInput {
  sku?: string;
  color?: string;
  size?: string;
  price?: number;
  salePrice?: number;
  stockQuantity?: number;
}
