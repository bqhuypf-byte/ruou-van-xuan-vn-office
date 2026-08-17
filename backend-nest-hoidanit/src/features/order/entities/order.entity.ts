import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { OrderStatus } from '../types/order-status.type';
import type { PaymentStatus } from '../types/payment-status.type';
import type { ShippingAddressSnapshot } from '../types/shipping-address.type';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'user_id' })
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
