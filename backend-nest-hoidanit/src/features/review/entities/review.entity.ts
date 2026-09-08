import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';
import { Product } from '../../product/entities/product.entity';

export const REVIEW_STATUSES = ['pending', 'approved', 'hidden'] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

@Entity('reviews')
export class Review {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'user_id',
    nullable: true,
    transformer: bigintTransformer,
  })
  userId: number | null;

  @Column({
    type: 'bigint',
    name: 'product_id',
    transformer: bigintTransformer,
  })
  productId: number;

  @Column({
    type: 'bigint',
    name: 'order_id',
    nullable: true,
    transformer: bigintTransformer,
  })
  orderId: number | null;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'reviewer_name',
    nullable: true,
  })
  reviewerName: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    name: 'reviewer_email',
    nullable: true,
  })
  reviewerEmail: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'reviewer_phone',
    nullable: true,
  })
  reviewerPhone: string | null;

  @Column({ type: 'tinyint' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ type: 'json', name: 'image_urls', nullable: true })
  imageUrls: string[] | null;

  @Column({ type: 'varchar', length: 20, default: 'approved' })
  status: ReviewStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
