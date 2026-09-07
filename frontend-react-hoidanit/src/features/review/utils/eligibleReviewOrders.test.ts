import { describe, expect, it } from 'vitest';
import type { Order } from '@/features/order';
import { getEligibleReviewOrders } from './eligibleReviewOrders';

const order = (id: number, productVariantId: number, status: Order['status']): Order => ({
  id,
  userId: 1,
  status,
  paymentMethod: 'cod',
  paymentStatus: 'paid',
  shippingFee: '0',
  totalAmount: '100000',
  shippingAddress: {
    fullName: 'Nguyễn Văn A',
    phone: '0901234567',
    addressLine: 'Hà Nội',
    city: 'Hà Nội',
  },
  pickupStoreLabel: null,
  pickupStoreAddress: null,
  createdAt: '2026-09-07T00:00:00.000Z',
  items: [
    {
      id,
      orderId: id,
      productVariantId,
      productName: 'Rượu Nếp',
      sku: 'RVX-1',
      price: '100000',
      quantity: 1,
      thumbnailUrl: null,
    },
  ],
});

describe('getEligibleReviewOrders', () => {
  it('keeps matching purchases and excludes cancelled orders', () => {
    expect(
      getEligibleReviewOrders(
        [order(1, 10, 'delivered'), order(2, 11, 'cancelled'), order(3, 99, 'delivered')],
        [10, 11],
      ).map(({ id }) => id),
    ).toEqual([1]);
  });
});
