import { useQuery } from '@tanstack/react-query';
import { voucherService } from '../services/voucher.service';

export const VOUCHER_QUERY_KEY = ['vouchers'] as const;
export const ADMIN_VOUCHER_QUERY_KEY = ['admin-vouchers'] as const;

export const useVouchers = () =>
  useQuery({
    queryKey: VOUCHER_QUERY_KEY,
    queryFn: voucherService.getActiveVouchers,
  });

export const useAdminVouchers = () =>
  useQuery({
    queryKey: ADMIN_VOUCHER_QUERY_KEY,
    queryFn: voucherService.getAllVouchers,
  });
