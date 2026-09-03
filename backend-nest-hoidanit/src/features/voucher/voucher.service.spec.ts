import { BadRequestException } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import type { VoucherRepository } from './repositories/voucher.repository';
import type { Voucher } from './entities/voucher.entity';
import type { Repository } from 'typeorm';
import type { UserVoucher } from './entities/user-voucher.entity';

const makeVoucher = (overrides: Partial<Voucher> = {}): Voucher =>
  ({
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
    newMemberOnly: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Voucher;

describe('VoucherService', () => {
  const repository = {
    findByCode: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  } as unknown as jest.Mocked<VoucherRepository>;
  const userVoucherRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn((value) => value),
    save: jest.fn(),
  } as unknown as jest.Mocked<Repository<UserVoucher>>;
  const service = new VoucherService(repository, userVoucherRepository);

  beforeEach(() => jest.clearAllMocks());

  it('calculates a percentage discount and respects the maximum amount', async () => {
    repository.findByCode.mockResolvedValue(
      makeVoucher({ discountValue: '20.00', maxDiscountAmount: '30000.00' }),
    );

    const result = await service.validate('SALE10', 200000);

    expect(result.discountAmount).toBe(30000);
    expect(result.finalAmount).toBe(170000);
  });

  it('calculates a fixed discount and never reduces the total below zero', async () => {
    repository.findByCode.mockResolvedValue(
      makeVoucher({ discountType: 'fixed', discountValue: '50000.00' }),
    );

    const result = await service.validate('SALE10', 30000);

    expect(result.discountAmount).toBe(30000);
    expect(result.finalAmount).toBe(0);
  });

  it('rejects an order below the configured minimum amount', async () => {
    repository.findByCode.mockResolvedValue(
      makeVoucher({ minOrderAmount: '100000.00' }),
    );

    await expect(service.validate('SALE10', 90000)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects an inactive voucher', async () => {
    repository.findByCode.mockResolvedValue(makeVoucher({ isActive: false }));

    await expect(service.validate('SALE10', 200000)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a member-only voucher when it was not granted to the account', async () => {
    repository.findByCode.mockResolvedValue(makeVoucher({ newMemberOnly: true }));
    userVoucherRepository.findOne.mockResolvedValue(null);

    await expect(service.validate('SALE10', 200000, 7)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('clears optional voucher fields when Admin removes their values', async () => {
    const voucher = makeVoucher({
      description: 'Điều kiện cũ',
      maxDiscountAmount: '100000.00',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    });
    repository.findById.mockResolvedValue(voucher);
    repository.save.mockResolvedValue(voucher);

    const result = await service.update(1, {
      description: null,
      maxDiscountAmount: null,
      startDate: null,
      endDate: null,
    });

    expect(result.description).toBeNull();
    expect(result.maxDiscountAmount).toBeNull();
    expect(result.startDate).toBeNull();
    expect(result.endDate).toBeNull();
  });
});
