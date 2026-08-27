import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';

export type VoucherDiscountType = 'percent' | 'fixed';

@Entity('vouchers')
export class Voucher {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 10, name: 'discount_type' })
  discountType: VoucherDiscountType;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'discount_value' })
  discountValue: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'min_order_amount',
    default: 0,
  })
  minOrderAmount: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'max_discount_amount',
    nullable: true,
  })
  maxDiscountAmount: string | null;

  @Column({ type: 'date', name: 'start_date', nullable: true })
  startDate: string | null;

  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate: string | null;

  @Column({ type: 'int', name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
