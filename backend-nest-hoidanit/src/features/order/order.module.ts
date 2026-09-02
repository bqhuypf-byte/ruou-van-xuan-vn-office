import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../cart/cart.module';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { SiteSettingsModule } from '../site-settings/site-settings.module';
import { VoucherModule } from '../voucher/voucher.module';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';
import { CheckoutService } from './services/checkout.service';
import { OrderRepository } from './repositories/order.repository';
import { OrderItemRepository } from './repositories/order-item.repository';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UserProfileModule,
    CartModule,
    SiteSettingsModule,
    VoucherModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    CheckoutService,
    OrderRepository,
    OrderItemRepository,
  ],
  exports: [OrderService],
})
export class OrderModule {}
