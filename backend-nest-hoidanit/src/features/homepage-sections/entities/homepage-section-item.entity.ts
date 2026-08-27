import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';
import { Product } from '../../product/entities/product.entity';
import { HomepageSection } from './homepage-section.entity';

@Entity('homepage_section_items')
@Index(['sectionId', 'productId'], { unique: true })
export class HomepageSectionItem {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'section_id',
    transformer: bigintTransformer,
  })
  sectionId: number;

  @Column({
    type: 'bigint',
    name: 'product_id',
    transformer: bigintTransformer,
  })
  productId: number;

  @Column({ type: 'int', name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'override_price',
    nullable: true,
  })
  overridePrice: string | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'override_original_price',
    nullable: true,
  })
  overrideOriginalPrice: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'badge_text',
    nullable: true,
  })
  badgeText: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => HomepageSection, (section) => section.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'section_id' })
  section: HomepageSection;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
