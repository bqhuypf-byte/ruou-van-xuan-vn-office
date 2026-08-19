import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '../services/brand.service';
import { ADMIN_BRAND_QUERY_KEY, BRAND_QUERY_KEY } from './useBrands';
import type { CreateBrandInput, UpdateBrandInput } from '../types/home.types';

const invalidate = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: ADMIN_BRAND_QUERY_KEY });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBrandInput) => brandService.createBrand(input),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateBrandInput }) =>
      brandService.updateBrand(id, input),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => brandService.deleteBrand(id),
    onSuccess: () => invalidate(queryClient),
  });
};
