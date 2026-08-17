import { axiosInstance } from '@/shared/lib/axios';
import type { CreateVariantInput, ProductVariant, UpdateVariantInput } from '../types/variant.types';

export const variantService = {
  getVariantById: async (id: number): Promise<ProductVariant> => {
    const response = await axiosInstance.get<{ data: ProductVariant }>(`/variants/${id}`);
    return response.data.data;
  },

  createVariant: async (
    productId: number,
    input: CreateVariantInput,
  ): Promise<ProductVariant> => {
    const response = await axiosInstance.post<{ data: ProductVariant }>(
      `/admin/products/${productId}/variants`,
      input,
    );
    return response.data.data;
  },

  updateVariant: async (
    id: number,
    input: UpdateVariantInput,
  ): Promise<ProductVariant> => {
    const response = await axiosInstance.patch<{ data: ProductVariant }>(
      `/admin/variants/${id}`,
      input,
    );
    return response.data.data;
  },
};
