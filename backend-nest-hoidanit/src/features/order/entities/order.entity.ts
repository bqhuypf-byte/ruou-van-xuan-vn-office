import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';
import type { OrderStatus } from '../types/order-status.type';
import type { PaymentStatus } from '../types/payment-status.type';
import type { ShippingAddressSnapshot } from '../types/shipping-address.type';

@Entity('orders')
export class Order {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({ type: 'bigint', name: 'user_id', transformer: bigintTransformer })
  userId: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: OrderStatus;

  @Column({ type: 'varchar', length: 50, name: 'payment_method' })
  paymentMethod: string;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'payment_status',
    default: 'unpaid',
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'shipping_fee',
    default: 0,
  })
  shippingFee: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount' })
  totalAmount: string;

  @Column({ type: 'json', name: 'shipping_address' })
  shippingAddress: ShippingAddressSnapshot;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'pickup_store_label',
    nullable: true,
  })
  pickupStoreLabel: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'pickup_store_address',
    nullable: true,
  })
  pickupStoreAddress: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
