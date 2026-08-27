import { axiosInstance } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type { CreateFaqInput, Faq, UpdateFaqInput } from '../types/home.types';

export const faqService = {
  getActiveFaqs: async (): Promise<Faq[]> => {
    const response = await axiosInstance.get<ApiResponse<Faq[]>>('/faqs');
    return response.data.data;
  },

  getAllFaqs: async (): Promise<Faq[]> => {
    const response = await axiosInstance.get<ApiResponse<Faq[]>>('/admin/faqs');
    return response.data.data;
  },

  createFaq: async (input: CreateFaqInput): Promise<Faq> => {
    const response = await axiosInstance.post<ApiResponse<Faq>>('/admin/faqs', input);
    return response.data.data;
  },

  updateFaq: async (id: number, input: UpdateFaqInput): Promise<Faq> => {
    const response = await axiosInstance.patch<ApiResponse<Faq>>(`/admin/faqs/${id}`, input);
    return response.data.data;
  },

  deleteFaq: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/faqs/${id}`);
  },
};
