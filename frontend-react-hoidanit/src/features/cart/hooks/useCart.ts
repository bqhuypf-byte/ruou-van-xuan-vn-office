import { useQuery } from '@tanstack/react-query';
import { cartService } from '../services/cart.service';
import { variantService } from '@/features/product/services/variant.service';
import { useProductCacheStore } from '@/features/product/stores/productCache.store';
import type { EnrichedCartItem } from '../types/cart.types';

export const CART_QUERY_KEY = ['cart'] as const;

export const useCart = () => {
  const cacheByVariantId = useProductCacheStore((state) => state.byVariantId);

  const query = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async (): Promise<EnrichedCartItem[]> => {
      const cart = await cartService.getCart();
      const variants = await Promise.all(
        cart.items.map((item) => variantService.getVariantById(item.productVariantId)),
      );

      return cart.items.map((item, index) => {
        const variant = variants[index];
        const cached = cacheByVariantId[item.productVariantId];
        return {
          ...item,
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
          price: variant.price,
          salePrice: variant.salePrice,
          stockQuantity: variant.stockQuantity,
          productName: cached?.productName ?? null,
          productSlug: cached?.productSlug ?? null,
          thumbnailUrl: cached?.thumbnailUrl ?? null,
        };
      });
    },
  });

  const items = query.data ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = Number(item.salePrice ?? item.price);
    return sum + unitPrice * item.quantity;
  }, 0);

  return { ...query, items, itemCount, subtotal };
};
