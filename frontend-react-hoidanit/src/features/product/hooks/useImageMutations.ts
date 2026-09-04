import { useMutation, useQueryClient } from '@tanstack/react-query';
import { imageService } from '../services/image.service';
import { PRODUCT_DETAIL_QUERY_KEY } from './useProductDetail';
import type { AddImagesInput, ReorderImagesInput } from '../types/image.types';

export const useAddImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, input }: { productId: number; input: AddImagesInput }) =>
      imageService.addImages(productId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_DETAIL_QUERY_KEY });
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => imageService.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_DETAIL_QUERY_KEY });
    },
  });
};

export const useReorderImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, input }: { productId: number; input: ReorderImagesInput }) =>
      imageService.reorderImages(productId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_DETAIL_QUERY_KEY });
    },
  });
};
