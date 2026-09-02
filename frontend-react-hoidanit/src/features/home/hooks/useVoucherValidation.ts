import { useQuery } from '@tanstack/react-query';
import { voucherService } from '../services/voucher.service';

export const useVoucherValidation = (code: string | null, orderAmount: number) =>
  useQuery({
    queryKey: ['voucher-validation', code, orderAmount],
    queryFn: () => voucherService.validateVoucher(code ?? '', orderAmount),
    enabled: Boolean(code) && orderAmount > 0,
    retry: false,
  });
