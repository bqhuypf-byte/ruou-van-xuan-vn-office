import { axiosInstance } from '@/shared/lib/axios';
import { API_ORIGIN } from '@/config/constants';
import type { ApiResponse } from '@/shared/types/api.types';

const uploadFile = async (endpoint: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post<ApiResponse<{ url: string }>>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return `${API_ORIGIN}${response.data.data.url}`;
};

export const uploadService = {
  uploadImage: (file: File): Promise<string> => uploadFile('/admin/uploads/image', file),
  uploadVideo: (file: File): Promise<string> => uploadFile('/admin/uploads/video', file),
};
