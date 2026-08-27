export const ORDER_STATUSES = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = ['unpaid', 'paid'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface ShippingAddressSnapshot {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productVariantId: number;
  productName: string;
  sku: string;
  price: string;
  quantity: number;
  thumbnailUrl: string | null;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  shippingFee: string;
  totalAmount: string;
  shippingAddress: ShippingAddressSnapshot;
  pickupStoreLabel: string | null;
  pickupStoreAddress: string | null;
  createdAt: string;
  items: OrderItem[];
}
