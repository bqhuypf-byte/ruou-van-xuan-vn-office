import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import { ORDER_QUERY_KEY } from './useOrders';
import { ORDER_DETAIL_QUERY_KEY } from './useOrderDetail';

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
