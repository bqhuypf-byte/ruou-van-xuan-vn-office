import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';

@Entity('user_vouchers')
@Index(['userId', 'voucherId'], { unique: true })
export class UserVoucher {
  @PrimaryColumn({ type: 'bigint', generated: 'increment', transformer: bigintTransformer })
  id: number;

  @Column({ type: 'bigint', name: 'user_id', transformer: bigintTransformer })
  userId: number;

  @Column({ type: 'bigint', name: 'voucher_id', transformer: bigintTransformer })
  voucherId: number;

  @Column({ type: 'bigint', name: 'redeemed_order_id', nullable: true, transformer: bigintTransformer })
  redeemedOrderId: number | null;

  @Column({ type: 'datetime', name: 'redeemed_at', nullable: true })
  redeemedAt: Date | null;

  @CreateDateColumn({ name: 'granted_at' })
  grantedAt: Date;
}
