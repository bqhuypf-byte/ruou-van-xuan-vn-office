import type { Order } from '@/features/order';

export const getEligibleReviewOrders = (orders: Order[], variantIds: number[]): Order[] => {
  const productVariantIds = new Set(variantIds.map(Number));

  return orders.filter(
    (order) =>
      order.status !== 'cancelled' &&
      order.items.some((item) => productVariantIds.has(Number(item.productVariantId))),
  );
};
