import { useQueries, useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { PRODUCT_DETAIL_QUERY_KEY } from './useProductDetail';
import type { ProductDetail } from '../services/product.service';

export interface FeaturedDeal {
  product: Pick<
    ProductDetail,
    'id' | 'slug' | 'name' | 'thumbnailUrl' | 'rating' | 'reviewCount'
  >;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  savings: number | null;
  badgeText?: string | null;
}

const toDeal = (product: ProductDetail): FeaturedDeal | null => {
  const variant = product.variants[0];
  if (!variant) return null;

  const basePrice = Number(variant.price);
  const salePrice = variant.salePrice ? Number(variant.salePrice) : null;
  const price = salePrice ?? basePrice;
  const originalPrice = salePrice ? basePrice : null;
  const savings = originalPrice ? originalPrice - price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return { product, price, originalPrice, discountPercent, savings };
};

export const useFeaturedDeals = (limit = 5) => {
  const { data, isLoading: isLoadingList } = useQuery({
    queryKey: ['products', { isFeaturedDeal: true, isActive: true, limit }],
    queryFn: () =>
      productService.getProducts({ isFeaturedDeal: true, isActive: true, limit }),
  });

  const slugs = data?.products.map((p) => p.slug) ?? [];

  const detailQueries = useQueries({
    queries: slugs.map((slug) => ({
      queryKey: [...PRODUCT_DETAIL_QUERY_KEY, slug],
      queryFn: () => productService.getProductBySlug(slug),
    })),
  });

  const isLoading = isLoadingList || detailQueries.some((q) => q.isLoading);
  const deals = detailQueries
    .map((q) => (q.data ? toDeal(q.data) : null))
    .filter((deal): deal is FeaturedDeal => deal !== null);

  return { deals, isLoading };
};
