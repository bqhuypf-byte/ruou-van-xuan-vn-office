import { useQuery } from '@tanstack/react-query';
import { brandService } from '../services/brand.service';

export const BRAND_QUERY_KEY = ['brands'] as const;
export const ADMIN_BRAND_QUERY_KEY = ['admin-brands'] as const;

export const useBrands = () =>
  useQuery({
    queryKey: BRAND_QUERY_KEY,
    queryFn: brandService.getActiveBrands,
  });

export const useAdminBrands = () =>
  useQuery({
    queryKey: ADMIN_BRAND_QUERY_KEY,
    queryFn: brandService.getAllBrands,
  });
