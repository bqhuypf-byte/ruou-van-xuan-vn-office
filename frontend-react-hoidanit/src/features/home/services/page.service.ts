import { axiosInstance } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type { CreatePageInput, Page, UpdatePageInput } from '../types/home.types';

export const pageService = {
  getBySlug: async (slug: string): Promise<Page> => {
    const response = await axiosInstance.get<ApiResponse<Page>>(`/pages/${slug}`);
    return response.data.data;
  },

  getAllPages: async (): Promise<Page[]> => {
    const response = await axiosInstance.get<ApiResponse<Page[]>>('/admin/pages');
    return response.data.data;
  },

  createPage: async (input: CreatePageInput): Promise<Page> => {
    const response = await axiosInstance.post<ApiResponse<Page>>('/admin/pages', input);
    return response.data.data;
  },

  updatePage: async (id: number, input: UpdatePageInput): Promise<Page> => {
    const response = await axiosInstance.patch<ApiResponse<Page>>(`/admin/pages/${id}`, input);
    return response.data.data;
  },

  deletePage: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/pages/${id}`);
  },
};
