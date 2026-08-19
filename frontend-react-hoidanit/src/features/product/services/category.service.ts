import { axiosInstance } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../types/category.types';

export const categoryService = {
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await axiosInstance.get<ApiResponse<Category>>(
      `/categories/${slug}`,
    );
    return response.data.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<ApiResponse<Category[]> | Category[]>(
      '/categories',
    );
    if ('data' in response.data && Array.isArray((response.data as ApiResponse<Category[]>).data)) {
      return (response.data as ApiResponse<Category[]>).data;
    }
    return response.data as Category[];
  },

  createCategory: async (input: CreateCategoryInput): Promise<Category> => {
    const response = await axiosInstance.post<ApiResponse<Category> | Category>(
      '/admin/categories',
      input,
    );
    if ('data' in response.data && (response.data as ApiResponse<Category>).data) {
      return (response.data as ApiResponse<Category>).data;
    }
    return response.data as Category;
  },

  updateCategory: async (id: number, input: UpdateCategoryInput): Promise<Category> => {
    const response = await axiosInstance.patch<ApiResponse<Category> | Category>(
      `/admin/categories/${id}`,
      input,
    );
    if ('data' in response.data && (response.data as ApiResponse<Category>).data) {
      return (response.data as ApiResponse<Category>).data;
    }
    return response.data as Category;
  },

  deleteCategory: async (id: number, targetCategoryId?: number): Promise<void> => {
    await axiosInstance.delete(`/admin/categories/${id}`, {
      data: { targetCategoryId },
    });
  },
};
