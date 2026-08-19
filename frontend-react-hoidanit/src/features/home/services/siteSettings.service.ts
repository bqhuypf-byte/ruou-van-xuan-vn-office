import { axiosInstance } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';
import type { SiteSettings, UpdateSiteSettingsInput } from '../types/home.types';

export const siteSettingsService = {
  getSiteSettings: async (): Promise<SiteSettings> => {
    const response = await axiosInstance.get<ApiResponse<SiteSettings>>('/site-settings');
    return response.data.data;
  },

  updateSiteSettings: async (input: UpdateSiteSettingsInput): Promise<SiteSettings> => {
    const response = await axiosInstance.patch<ApiResponse<SiteSettings>>(
      '/admin/site-settings',
      input,
    );
    return response.data.data;
  },
};
