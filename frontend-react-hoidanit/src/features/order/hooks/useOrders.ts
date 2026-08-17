import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export const ORDER_QUERY_KEY = ['orders'] as const;

export const useOrders = () => {
  const query = useQuery({
    queryKey: ORDER_QUERY_KEY,
    queryFn: orderService.getOrders,
  });

  return { ...query, orders: query.data ?? [] };
};
