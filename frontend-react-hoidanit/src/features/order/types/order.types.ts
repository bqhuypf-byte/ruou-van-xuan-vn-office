export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid';

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
  createdAt: string;
  items: OrderItem[];
}
