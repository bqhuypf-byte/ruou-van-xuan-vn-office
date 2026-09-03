import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CartService } from '../../cart/cart.service';
import { CartIdentity } from '../../cart/types/cart.types';
import { UserProfileService } from '../../user-profile/user-profile.service';
import { SiteSettingsService } from '../../site-settings/site-settings.service';
import { VoucherService } from '../../voucher/voucher.service';
import { CheckoutDto } from '../dto/checkout.dto';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userProfileService: UserProfileService,
    private readonly cartService: CartService,
    private readonly siteSettingsService: SiteSettingsService,
    private readonly voucherService: VoucherService,
  ) {}

  async execute(
    userId: number,
    dto: CheckoutDto,
  ): Promise<Order & { items: OrderItem[] }> {
    const address = await this.userProfileService.findOne(
      dto.addressId,
      userId,
    );
    const settings = await this.siteSettingsService.get();

    const itemsTotal = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const voucher = dto.voucherCode
      ? await this.voucherService.validate(dto.voucherCode, itemsTotal, userId)
      : null;
    const freeShippingThreshold = Number(settings.freeShippingThreshold);
    const isFreeShipping =
      dto.paymentMethod === 'store_pickup' ||
      itemsTotal >= freeShippingThreshold;
    const shippingFee = isFreeShipping ? 0 : Number(settings.shippingFee);
    const totalAmount = Math.max(
      0,
      itemsTotal - (voucher?.discountAmount ?? 0) + shippingFee,
    );

    const pickupStore =
      dto.paymentMethod === 'store_pickup'
        ? (settings.contactAddresses?.[dto.pickupStoreIndex ?? 0] ??
          settings.contactAddresses?.[0] ??
          null)
        : null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = queryRunner.manager.create(Order, {
        userId,
        status: 'pending',
        paymentMethod: dto.paymentMethod,
        paymentStatus: 'unpaid',
        shippingFee: shippingFee.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          addressLine: address.addressLine,
          city: address.city,
        },
        pickupStoreLabel: pickupStore?.label ?? null,
        pickupStoreAddress: pickupStore?.address ?? null,
      });
      const savedOrder = await queryRunner.manager.save(order);

      if (dto.voucherCode) {
        await this.voucherService.redeem(
          dto.voucherCode,
          userId,
          savedOrder.id,
          queryRunner.manager,
        );
      }

      const items = dto.items.map((item) =>
        queryRunner.manager.create(OrderItem, {
          orderId: savedOrder.id,
          productVariantId: item.productVariantId,
          productName: item.productName,
          sku: item.sku,
          price: item.price.toFixed(2),
          quantity: item.quantity,
          thumbnailUrl: item.thumbnailUrl ?? null,
        }),
      );
      const savedItems = await queryRunner.manager.save(items);

      await queryRunner.commitTransaction();

      const identity: CartIdentity = { userId, sessionId: null };
      await this.cartService.clearCart(identity);

      return { ...savedOrder, items: savedItems };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
