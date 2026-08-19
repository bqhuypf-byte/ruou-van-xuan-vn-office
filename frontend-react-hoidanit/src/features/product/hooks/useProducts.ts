import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import type { ProductFilterParams } from '../types/product.types';

export const PRODUCT_QUERY_KEY = ['products'] as const;

export const useProducts = (params?: ProductFilterParams) => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;

  const query = useQuery({
    queryKey: [
      ...PRODUCT_QUERY_KEY,
      {
        search: params?.search,
        categoryId: params?.categoryId,
        isActive: params?.isActive,
        isFeaturedDeal: params?.isFeaturedDeal,
        page,
        limit,
      },
    ],
    queryFn: () =>
      productService.getProducts({
        search: params?.search,
        categoryId: params?.categoryId,
        isActive: params?.isActive,
        isFeaturedDeal: params?.isFeaturedDeal,
        page,
        limit,
      }),
  });

  const products = query.data?.products ?? [];

  return {
    ...query,
    products,
    meta: query.data?.meta,
    totalCount: query.data?.meta.total ?? 0,
  };
};
