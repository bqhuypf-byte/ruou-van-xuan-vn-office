import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CART_QUERY_KEY } from '@/features/cart';
import { ORDER_QUERY_KEY } from '@/features/order';
import { checkoutService } from '../services/checkout.service';

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutService.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
    },
  });
};
