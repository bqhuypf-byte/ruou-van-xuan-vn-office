import { axiosInstance } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
  CreateVoucherInput,
  UpdateVoucherInput,
  Voucher,
  VoucherValidationResult,
} from '../types/home.types';

export const voucherService = {
  getActiveVouchers: async (): Promise<Voucher[]> => {
    const response = await axiosInstance.get<ApiResponse<Voucher[]>>('/vouchers');
    return response.data.data;
  },

  getAllVouchers: async (): Promise<Voucher[]> => {
    const response = await axiosInstance.get<ApiResponse<Voucher[]>>('/admin/vouchers');
    return response.data.data;
  },

  validateVoucher: async (code: string, orderAmount: number): Promise<VoucherValidationResult> => {
    const response = await axiosInstance.post<ApiResponse<VoucherValidationResult>>(
      '/vouchers/validate',
      { code, orderAmount },
    );
    return response.data.data;
  },

  createVoucher: async (input: CreateVoucherInput): Promise<Voucher> => {
    const response = await axiosInstance.post<ApiResponse<Voucher>>('/admin/vouchers', input);
    return response.data.data;
  },

  updateVoucher: async (id: number, input: UpdateVoucherInput): Promise<Voucher> => {
    const response = await axiosInstance.patch<ApiResponse<Voucher>>(
      `/admin/vouchers/${id}`,
      input,
    );
    return response.data.data;
  },

  deleteVoucher: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/vouchers/${id}`);
  },
};
