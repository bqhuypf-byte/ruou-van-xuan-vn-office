import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';
import { HomepageSectionItem } from './homepage-section-item.entity';

export type HomepageSectionDisplayStyle = 'grid' | 'carousel';

@Entity('homepage_sections')
export class HomepageSection {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'display_style',
    default: 'grid',
  })
  displayStyle: HomepageSectionDisplayStyle;

  @Column({ type: 'int', name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => HomepageSectionItem, (item) => item.section)
  items: HomepageSectionItem[];
}
