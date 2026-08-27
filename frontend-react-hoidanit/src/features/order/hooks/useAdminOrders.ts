import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export const ADMIN_ORDERS_QUERY_KEY = ['admin-orders'] as const;

export const useAdminOrders = (status?: string) => {
  const query = useQuery({
    queryKey: [...ADMIN_ORDERS_QUERY_KEY, status ?? 'all'],
    queryFn: () => orderService.getAllOrdersAdmin(status),
  });

  return { ...query, orders: query.data ?? [] };
};
