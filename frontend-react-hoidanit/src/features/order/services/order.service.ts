import { axiosInstance } from '@/shared/lib/axios';
import type { Order } from '../types/order.types';

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get<{ data: Order[] }>('/orders');
    return response.data.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await axiosInstance.get<{ data: Order }>(`/orders/${id}`);
    return response.data.data;
  },

  cancelOrder: async (id: number): Promise<Order> => {
    const response = await axiosInstance.patch<{ data: Order }>(`/orders/${id}/cancel`);
    return response.data.data;
  },
};
