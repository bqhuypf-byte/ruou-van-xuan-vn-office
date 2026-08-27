import { Column, Entity, PrimaryColumn } from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';

@Entity('order_items')
export class OrderItem {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({ type: 'bigint', name: 'order_id', transformer: bigintTransformer })
  orderId: number;

  @Column({
    type: 'bigint',
    name: 'product_variant_id',
    transformer: bigintTransformer,
  })
  productVariantId: number;

  @Column({ type: 'varchar', length: 255, name: 'product_name' })
  productName: string;

  @Column({ type: 'varchar', length: 50 })
  sku: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'thumbnail_url',
    nullable: true,
  })
  thumbnailUrl: string | null;
}
