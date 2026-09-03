import { useQuery } from '@tanstack/react-query';
import { voucherService } from '../services/voucher.service';
import { useAuthStore } from '@/features/auth';

export const VOUCHER_QUERY_KEY = ['vouchers'] as const;
export const ADMIN_VOUCHER_QUERY_KEY = ['admin-vouchers'] as const;

export const useVouchers = () => {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: [...VOUCHER_QUERY_KEY, userId ?? 'guest'],
    queryFn: voucherService.getActiveVouchers,
  });
};

export const useAdminVouchers = () =>
  useQuery({
    queryKey: ADMIN_VOUCHER_QUERY_KEY,
    queryFn: voucherService.getAllVouchers,
  });
