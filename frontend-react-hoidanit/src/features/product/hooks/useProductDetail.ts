import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';

export const PRODUCT_DETAIL_QUERY_KEY = ['product-detail'] as const;

export const useProductDetail = (slug: string | undefined) => {
  return useQuery({
    queryKey: [...PRODUCT_DETAIL_QUERY_KEY, slug],
    queryFn: () => productService.getProductBySlug(slug as string),
    enabled: Boolean(slug),
  });
};
