import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voucherService } from '../services/voucher.service';
import { ADMIN_VOUCHER_QUERY_KEY, VOUCHER_QUERY_KEY } from './useVouchers';
import type { CreateVoucherInput, UpdateVoucherInput } from '../types/home.types';

const invalidate = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: VOUCHER_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: ADMIN_VOUCHER_QUERY_KEY });
};

export const useCreateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVoucherInput) => voucherService.createVoucher(input),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateVoucherInput }) =>
      voucherService.updateVoucher(id, input),
    onSuccess: () => invalidate(queryClient),
  });
};

export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => voucherService.deleteVoucher(id),
    onSuccess: () => invalidate(queryClient),
  });
};
