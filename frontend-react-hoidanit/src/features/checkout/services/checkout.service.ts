import { axiosInstance } from '@/shared/lib/axios';
import type { Order } from '@/features/order';
import type { CheckoutInput } from '../types/checkout.types';

export const checkoutService = {
  checkout: async (input: CheckoutInput): Promise<Order> => {
    const response = await axiosInstance.post<{ data: Order }>('/orders/checkout', input);
    return response.data.data;
  },
};
