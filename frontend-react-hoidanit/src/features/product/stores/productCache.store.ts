import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductDetail } from '../services/product.service';

export interface CachedProductInfo {
  productName: string;
  productSlug: string;
  thumbnailUrl: string | null;
}

interface ProductCacheState {
  byVariantId: Record<number, CachedProductInfo>;
  cacheProductDetail: (product: ProductDetail) => void;
}

export const useProductCacheStore = create<ProductCacheState>()(
  persist(
    (set, get) => ({
      byVariantId: {},
      cacheProductDetail: (product) => {
        const entry: CachedProductInfo = {
          productName: product.name,
          productSlug: product.slug,
          thumbnailUrl: product.thumbnailUrl,
        };
        const next = { ...get().byVariantId };
        for (const variant of product.variants) {
          next[variant.id] = entry;
        }
        set({ byVariantId: next });
      },
    }),
    { name: 'product-cache' },
  ),
);
