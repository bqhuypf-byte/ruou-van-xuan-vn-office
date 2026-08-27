import { axiosInstance } from '@/shared/lib/axios';
import type { Order, OrderStatus, PaymentStatus } from '../types/order.types';

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

  getAllOrdersAdmin: async (status?: string): Promise<Order[]> => {
    const response = await axiosInstance.get<{ data: Order[] }>('/admin/orders', {
      params: status ? { status } : undefined,
    });
    return response.data.data;
  },

  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const response = await axiosInstance.patch<{ data: Order }>(`/admin/orders/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  updateOrderPayment: async (id: number, paymentStatus: PaymentStatus): Promise<Order> => {
    const response = await axiosInstance.patch<{ data: Order }>(`/admin/orders/${id}/payment`, {
      paymentStatus,
    });
    return response.data.data;
  },

  bulkDeleteOrders: async (ids: number[]): Promise<void> => {
    await axiosInstance.post('/admin/orders/bulk-delete', { ids });
  },
};
