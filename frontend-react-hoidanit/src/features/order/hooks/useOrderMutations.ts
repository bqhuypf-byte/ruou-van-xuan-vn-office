import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import { ORDER_QUERY_KEY } from './useOrders';
import { ORDER_DETAIL_QUERY_KEY } from './useOrderDetail';
import { ADMIN_ORDERS_QUERY_KEY } from './useAdminOrders';
import type { OrderStatus, PaymentStatus } from '../types/order.types';

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => orderService.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDER_DETAIL_QUERY_KEY });
    },
  });
};

export const useUpdateOrderStatusAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDER_DETAIL_QUERY_KEY });
    },
  });
};

export const useUpdateOrderPaymentAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, paymentStatus }: { id: number; paymentStatus: PaymentStatus }) =>
      orderService.updateOrderPayment(id, paymentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDER_DETAIL_QUERY_KEY });
    },
  });
};

export const useBulkDeleteOrdersAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => orderService.bulkDeleteOrders(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY });
    },
  });
};
