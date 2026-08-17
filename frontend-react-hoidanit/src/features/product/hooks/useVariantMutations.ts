import { useMutation, useQueryClient } from '@tanstack/react-query';
import { variantService } from '../services/variant.service';
import { PRODUCT_DETAIL_QUERY_KEY } from './useProductDetail';
import type { CreateVariantInput, UpdateVariantInput } from '../types/variant.types';

export const useCreateVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, input }: { productId: number; input: CreateVariantInput }) =>
      variantService.createVariant(productId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_DETAIL_QUERY_KEY });
    },
  });
};

export const useUpdateVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateVariantInput }) =>
      variantService.updateVariant(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_DETAIL_QUERY_KEY });
    },
  });
};
