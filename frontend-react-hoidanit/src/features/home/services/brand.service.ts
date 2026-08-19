import { axiosInstance } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type { Brand, CreateBrandInput, UpdateBrandInput } from '../types/home.types';

export const brandService = {
  getActiveBrands: async (): Promise<Brand[]> => {
    const response = await axiosInstance.get<ApiResponse<Brand[]>>('/brands');
    return response.data.data;
  },

  getAllBrands: async (): Promise<Brand[]> => {
    const response = await axiosInstance.get<ApiResponse<Brand[]>>('/admin/brands');
    return response.data.data;
  },

  createBrand: async (input: CreateBrandInput): Promise<Brand> => {
    const response = await axiosInstance.post<ApiResponse<Brand>>('/admin/brands', input);
    return response.data.data;
  },

  updateBrand: async (id: number, input: UpdateBrandInput): Promise<Brand> => {
    const response = await axiosInstance.patch<ApiResponse<Brand>>(
      `/admin/brands/${id}`,
      input,
    );
    return response.data.data;
  },

  deleteBrand: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/brands/${id}`);
  },
};
