import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';

@Entity('reviews')
export class Review {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({ type: 'bigint', name: 'user_id', transformer: bigintTransformer })
  userId: number;

  @Column({
    type: 'bigint',
    name: 'product_id',
    transformer: bigintTransformer,
  })
  productId: number;

  @Column({ type: 'bigint', name: 'order_id', transformer: bigintTransformer })
  orderId: number;

  @Column({ type: 'tinyint' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
