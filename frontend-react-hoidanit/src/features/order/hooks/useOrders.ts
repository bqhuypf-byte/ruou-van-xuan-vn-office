import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export const ORDER_QUERY_KEY = ['orders'] as const;

export const useOrders = (enabled = true) => {
  const query = useQuery({
    queryKey: ORDER_QUERY_KEY,
    queryFn: orderService.getOrders,
    enabled,
  });

  return { ...query, orders: query.data ?? [] };
};
