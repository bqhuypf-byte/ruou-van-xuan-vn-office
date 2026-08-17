import { axiosInstance } from '@/shared/lib/axios';
import type { AddCartItemInput, CartView, UpdateCartItemInput } from '../types/cart.types';

export const cartService = {
  getCart: async (): Promise<CartView> => {
    const response = await axiosInstance.get<{ data: CartView }>('/cart');
    return response.data.data;
  },

  addItem: async (input: AddCartItemInput): Promise<CartView> => {
    const response = await axiosInstance.post<{ data: CartView }>('/cart/items', input);
    return response.data.data;
  },

  updateItem: async (id: number, input: UpdateCartItemInput): Promise<CartView> => {
    const response = await axiosInstance.patch<{ data: CartView }>(`/cart/items/${id}`, input);
    return response.data.data;
  },

  removeItem: async (id: number): Promise<CartView> => {
    const response = await axiosInstance.delete<{ data: CartView }>(`/cart/items/${id}`);
    return response.data.data;
  },

  clearCart: async (): Promise<void> => {
    await axiosInstance.delete('/cart');
  },

  mergeCart: async (): Promise<CartView> => {
    const response = await axiosInstance.post<{ data: CartView }>('/cart/merge');
    return response.data.data;
  },
};
