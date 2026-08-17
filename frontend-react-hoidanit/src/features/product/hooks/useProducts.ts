import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import type { ProductFilterParams } from '../types/product.types';

export const PRODUCT_QUERY_KEY = ['products'] as const;

export const useProducts = (params?: ProductFilterParams) => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;

  const query = useQuery({
    queryKey: [...PRODUCT_QUERY_KEY, { categoryId: params?.categoryId, page, limit }],
    queryFn: () => productService.getProducts({ categoryId: params?.categoryId, page, limit }),
  });

  const allProducts = query.data?.products ?? [];
  const filteredProducts = allProducts.filter((product) => {
    if (!params?.search) return true;
    const term = params.search.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.slug.toLowerCase().includes(term) ||
      product.id.toString().includes(term)
    );
  });

  return {
    ...query,
    products: filteredProducts,
    allProducts,
    meta: query.data?.meta,
    totalCount: query.data?.meta.total ?? 0,
  };
};
