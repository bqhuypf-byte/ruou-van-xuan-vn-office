import { axiosInstance } from '@/shared/lib/axios';
import type {
  HomepageContent,
  UpdateHomepageContentInput,
} from '../types/site-content.types';

export const siteContentService = {
  getHomepageContent: async (): Promise<HomepageContent> => {
    const response = await axiosInstance.get<{ data: HomepageContent }>(
      '/homepage-content',
    );
    return response.data.data;
  },

  updateHomepageContent: async (
    input: UpdateHomepageContentInput,
  ): Promise<HomepageContent> => {
    const response = await axiosInstance.patch<{ data: HomepageContent }>(
      '/admin/homepage-content',
      input,
    );
    return response.data.data;
  },
};
