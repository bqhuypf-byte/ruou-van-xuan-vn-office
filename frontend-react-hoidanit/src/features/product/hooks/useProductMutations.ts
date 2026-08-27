import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { PRODUCT_QUERY_KEY } from './useProducts';
import { PRODUCT_DETAIL_QUERY_KEY } from './useProductDetail';
import type { CreateProductInput, UpdateProductInput } from '../types/product.types';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => productService.createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateProductInput }) =>
      productService.updateProduct(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_DETAIL_QUERY_KEY });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
    },
  });
};

export const useHardDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.deleteProductPermanently(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
    },
  });
};
