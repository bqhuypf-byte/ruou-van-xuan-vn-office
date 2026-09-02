import { Order } from '../entities/order.entity';
import { CheckoutService } from './checkout.service';

describe('CheckoutService', () => {
  it('revalidates the voucher and subtracts its discount from the saved order total', async () => {
    const manager = {
      create: jest.fn(
        (_entity: unknown, data: Record<string, unknown>) => data,
      ),
      save: jest.fn(
        (data: Record<string, unknown> | Record<string, unknown>[]) =>
          Promise.resolve(
            Array.isArray(data)
              ? data.map((item, index) => ({ ...item, id: index + 1 }))
              : { ...data, id: 100 },
          ),
      ),
    };
    const queryRunner = {
      manager,
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    };
    const dataSource = { createQueryRunner: jest.fn(() => queryRunner) };
    const userProfileService = {
      findOne: jest.fn().mockResolvedValue({
        fullName: 'Nguyen Van A',
        phone: '0901234567',
        addressLine: '123 ABC',
        city: 'HCM',
      }),
    };
    const cartService = { clearCart: jest.fn() };
    const siteSettingsService = {
      get: jest.fn().mockResolvedValue({
        freeShippingThreshold: '500000.00',
        shippingFee: '20000.00',
        contactAddresses: [],
      }),
    };
    const voucherService = {
      validate: jest
        .fn()
        .mockResolvedValue({ discountAmount: 50000, code: 'GIAM50K' }),
    };
    const service = new CheckoutService(
      dataSource as never,
      userProfileService as never,
      cartService as never,
      siteSettingsService as never,
      voucherService as never,
    );

    await service.execute(7, {
      addressId: 1,
      paymentMethod: 'cod',
      voucherCode: 'GIAM50K',
      items: [
        {
          productVariantId: 10,
          productName: 'Rượu Nếp',
          sku: 'RN-01',
          price: 100000,
          quantity: 2,
        },
      ],
    });

    expect(voucherService.validate).toHaveBeenCalledWith('GIAM50K', 200000);
    expect(manager.create).toHaveBeenCalledWith(
      Order,
      expect.objectContaining({
        shippingFee: '20000.00',
        totalAmount: '170000.00',
      }),
    );
    expect(queryRunner.commitTransaction).toHaveBeenCalled();
    expect(cartService.clearCart).toHaveBeenCalledWith({
      userId: 7,
      sessionId: null,
    });
  });
});
