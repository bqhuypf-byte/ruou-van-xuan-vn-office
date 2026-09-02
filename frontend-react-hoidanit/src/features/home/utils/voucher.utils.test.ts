import { describe, expect, it } from 'vitest';
import type { Voucher } from '../types/home.types';
import { getBestEligibleVoucher, getNextVoucher, getVoucherDiscountAmount } from './voucher.utils';

const createVoucher = (overrides: Partial<Voucher>): Voucher => ({
  id: 1,
  code: 'SALE10',
  title: 'Giảm 10%',
  description: null,
  discountType: 'percent',
  discountValue: '10.00',
  minOrderAmount: '0.00',
  maxDiscountAmount: null,
  startDate: null,
  endDate: null,
  sortOrder: 0,
  isActive: true,
  ...overrides,
});

describe('voucher utils', () => {
  it('calculates percentage discounts with a maximum cap', () => {
    const voucher = createVoucher({ maxDiscountAmount: '50000.00' });

    expect(getVoucherDiscountAmount(voucher, 800000)).toBe(50000);
  });

  it('selects the eligible voucher that saves the most', () => {
    const percent = createVoucher({ id: 1, code: 'SALE10' });
    const fixed = createVoucher({
      id: 2,
      code: 'SAVE70K',
      discountType: 'fixed',
      discountValue: '70000.00',
    });

    expect(getBestEligibleVoucher([percent, fixed], 500000)?.code).toBe('SAVE70K');
  });

  it('finds the nearest upcoming voucher threshold', () => {
    const near = createVoucher({
      id: 2,
      code: 'NEAR',
      minOrderAmount: '600000.00',
    });
    const far = createVoucher({
      id: 3,
      code: 'FAR',
      minOrderAmount: '1000000.00',
    });

    expect(getNextVoucher([far, near], 450000)?.code).toBe('NEAR');
  });
});
