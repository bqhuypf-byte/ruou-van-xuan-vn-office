import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';

@Entity('categories')
export class Category {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'parent_id',
    nullable: true,
    transformer: bigintTransformer,
  })
  parentId: number | null;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
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

  @Column({ type: 'int', name: 'home_sort_order', default: 0 })
  homeSortOrder: number;

  @Column({
    type: 'boolean',
    name: 'show_in_product_sections',
    default: true,
  })
  showInProductSections: boolean;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'home_section_title',
    nullable: true,
  })
  homeSectionTitle: string | null;

  @Column({
    type: 'enum',
    enum: ['grid', 'carousel'],
    name: 'home_display_style',
    default: 'grid',
  })
  homeDisplayStyle: 'grid' | 'carousel';

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];
}
