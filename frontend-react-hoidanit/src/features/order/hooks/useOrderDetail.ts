import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export const ORDER_DETAIL_QUERY_KEY = ['order-detail'] as const;

export const useOrderDetail = (id: number | undefined) => {
  return useQuery({
    queryKey: [...ORDER_DETAIL_QUERY_KEY, id],
    queryFn: () => orderService.getOrderById(id as number),
    enabled: id !== undefined,
  });
};
