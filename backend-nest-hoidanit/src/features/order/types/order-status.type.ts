export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'shipping',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
