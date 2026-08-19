import { axiosInstance } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type { Banner, CreateBannerInput, UpdateBannerInput } from '../types/home.types';

export const bannerService = {
  getActiveBanners: async (): Promise<Banner[]> => {
    const response = await axiosInstance.get<ApiResponse<Banner[]>>('/banners');
    return response.data.data;
  },

  getAllBanners: async (): Promise<Banner[]> => {
    const response = await axiosInstance.get<ApiResponse<Banner[]>>('/admin/banners');
    return response.data.data;
  },

  createBanner: async (input: CreateBannerInput): Promise<Banner> => {
    const response = await axiosInstance.post<ApiResponse<Banner>>('/admin/banners', input);
    return response.data.data;
  },

  updateBanner: async (id: number, input: UpdateBannerInput): Promise<Banner> => {
    const response = await axiosInstance.patch<ApiResponse<Banner>>(
      `/admin/banners/${id}`,
      input,
    );
    return response.data.data;
  },

  deleteBanner: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/banners/${id}`);
  },
};
