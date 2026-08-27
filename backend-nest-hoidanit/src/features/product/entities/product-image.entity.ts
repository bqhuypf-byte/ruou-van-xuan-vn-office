import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';

@Entity('product_images')
export class ProductImage {
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

  @Column({ type: 'varchar', length: 500, name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'int', name: 'sort_order', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
