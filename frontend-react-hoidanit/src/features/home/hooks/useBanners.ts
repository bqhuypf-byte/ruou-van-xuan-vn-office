import { useQuery } from '@tanstack/react-query';
import { bannerService } from '../services/banner.service';

export const BANNER_QUERY_KEY = ['banners'] as const;
export const ADMIN_BANNER_QUERY_KEY = ['admin-banners'] as const;

export const useBanners = () =>
  useQuery({
    queryKey: BANNER_QUERY_KEY,
    queryFn: bannerService.getActiveBanners,
  });

export const useAdminBanners = () =>
  useQuery({
    queryKey: ADMIN_BANNER_QUERY_KEY,
    queryFn: bannerService.getAllBanners,
  });
