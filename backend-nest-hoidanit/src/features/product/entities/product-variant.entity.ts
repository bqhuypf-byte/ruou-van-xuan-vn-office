import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'product_id',
    transformer: bigintTransformer,
  })
  productId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string;

  @Column({ type: 'json', nullable: true })
  attributes: Record<string, string> | null;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'sale_price',
    nullable: true,
  })
  salePrice: string | null;

  @Column({ type: 'int', name: 'stock_quantity', default: 0 })
  stockQuantity: number;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'image_url',
    nullable: true,
  })
  imageUrl: string | null;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
