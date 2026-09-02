export type PaymentMethod = 'cod' | 'store_pickup' | 'bank_transfer';

export interface CheckoutItemInput {
  productVariantId: number;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  thumbnailUrl?: string;
}

export interface CheckoutInput {
  addressId: number;
  paymentMethod: PaymentMethod;
  pickupStoreIndex?: number;
  voucherCode?: string;
  items: CheckoutItemInput[];
}
