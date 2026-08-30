export interface VariantAttributeGroup {
  name: string;
  values: string[];
  /** Optional per-value thumbnail (only meaningful for the first/primary group), keyed by the value string. */
  images?: Record<string, string>;
}

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
  /** Up to 2 Shopee-style "Phân loại" groups (name + value options) used to auto-generate the variant combination matrix. Empty/undefined/null means no configurable attributes. */
  variantAttributes?: VariantAttributeGroup[] | null;
  createdAt?: string;
  updatedAt?: string;
  /** Present on list endpoints only (e.g. GET /products) — cheapest active variant's price. */
  priceFrom?: number | null;
  /** Present on list endpoints only — id of the cheapest variant, used for quick "Add to Cart". */
  defaultVariantId?: number | null;
  /** Average rating (1-5), null if no reviews yet. */
  rating?: number | null;
  /** Total review count. */
  reviewCount?: number;
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
  variantAttributes?: VariantAttributeGroup[];
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
  variantAttributes?: VariantAttributeGroup[];
}

export interface ProductFilterParams {
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  isFeaturedDeal?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

