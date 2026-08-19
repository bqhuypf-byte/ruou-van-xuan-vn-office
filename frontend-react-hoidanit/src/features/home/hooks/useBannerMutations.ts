import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerService } from '../services/banner.service';
import { ADMIN_BANNER_QUERY_KEY, BANNER_QUERY_KEY } from './useBanners';
import type { CreateBannerInput, UpdateBannerInput } from '../types/home.types';

const invalidate = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: ADMIN_BANNER_QUERY_KEY });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBannerInput) => bannerService.createBanner(input),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateBannerInput }) =>
      bannerService.updateBanner(id, input),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bannerService.deleteBanner(id),
    onSuccess: () => invalidate(queryClient),
  });
};
