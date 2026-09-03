import { useQuery } from '@tanstack/react-query';
import { voucherService } from '../services/voucher.service';
import { useAuthStore } from '@/features/auth';

export const useVoucherValidation = (code: string | null, orderAmount: number) => {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['voucher-validation', code, orderAmount, userId ?? 'guest'],
    queryFn: () => voucherService.validateVoucher(code ?? '', orderAmount),
    enabled: Boolean(code) && orderAmount > 0,
    retry: false,
  });
};
