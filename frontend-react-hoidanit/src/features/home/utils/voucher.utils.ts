import type { Voucher } from '../types/home.types';

export const getVoucherDiscountAmount = (voucher: Voucher, orderAmount: number): number => {
  if (!voucher.isActive || orderAmount < Number(voucher.minOrderAmount)) return 0;

  const discountValue = Number(voucher.discountValue);
  let discountAmount =
    voucher.discountType === 'percent' ? (orderAmount * discountValue) / 100 : discountValue;

  if (voucher.discountType === 'percent' && voucher.maxDiscountAmount) {
    discountAmount = Math.min(discountAmount, Number(voucher.maxDiscountAmount));
  }

  return Math.round(Math.min(discountAmount, orderAmount) * 100) / 100;
};

export const getBestEligibleVoucher = (
  vouchers: Voucher[],
  orderAmount: number,
): Voucher | null => {
  return (
    vouchers
      .map((voucher) => ({
        voucher,
        discount: getVoucherDiscountAmount(voucher, orderAmount),
      }))
      .filter(({ discount }) => discount > 0)
      .sort(
        (left, right) =>
          right.discount - left.discount ||
          left.voucher.sortOrder - right.voucher.sortOrder ||
          left.voucher.id - right.voucher.id,
      )[0]?.voucher ?? null
  );
};

export const getNextVoucher = (vouchers: Voucher[], orderAmount: number): Voucher | null => {
  return (
    vouchers
      .filter((voucher) => voucher.isActive && Number(voucher.minOrderAmount) > orderAmount)
      .sort(
        (left, right) =>
          Number(left.minOrderAmount) - Number(right.minOrderAmount) ||
          left.sortOrder - right.sortOrder ||
          left.id - right.id,
      )[0] ?? null
  );
};
