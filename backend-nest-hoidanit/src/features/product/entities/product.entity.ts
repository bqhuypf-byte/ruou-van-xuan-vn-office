import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';
import { VariantAttributeGroup } from '../types/variant-attribute-group.type';

@Entity('products')
export class Product {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'category_id',
    transformer: bigintTransformer,
  })
  categoryId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'thumbnail_url',
    nullable: true,
  })
  thumbnailUrl: string | null;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', name: 'is_featured_deal', default: false })
  isFeaturedDeal: boolean;

  @Column({ type: 'int', name: 'deal_sort_order', default: 0 })
  dealSortOrder: number;

  /** Up to 2 classification groups (Shopee-style "Phân loại"), each with an ordered list of value options used to auto-generate the variant combination matrix. */
  @Column({ type: 'json', name: 'variant_attributes', nullable: true })
  variantAttributes: VariantAttributeGroup[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];
}
