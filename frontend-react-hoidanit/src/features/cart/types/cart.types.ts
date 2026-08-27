export interface CartItem {
  id: number;
  cartId: number;
  productVariantId: number;
  quantity: number;
}

export interface CartView {
  id: number | null;
  items: CartItem[];
}

export interface AddCartItemInput {
  productVariantId: number;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export interface EnrichedCartItem extends CartItem {
  sku: string;
  attributes: Record<string, string> | null;
  price: string;
  salePrice: string | null;
  stockQuantity: number;
  productName: string | null;
  productSlug: string | null;
  thumbnailUrl: string | null;
}
