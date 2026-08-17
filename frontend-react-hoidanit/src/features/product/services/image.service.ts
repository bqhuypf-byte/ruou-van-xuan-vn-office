import { axiosInstance } from '@/shared/lib/axios';
import type { AddImagesInput, ProductImage } from '../types/image.types';

export const imageService = {
  addImages: async (
    productId: number,
    input: AddImagesInput,
  ): Promise<ProductImage[]> => {
    const response = await axiosInstance.post<{ data: ProductImage[] }>(
      `/admin/products/${productId}/images`,
      input,
    );
    return response.data.data;
  },

  deleteImage: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/images/${id}`);
  },
};
