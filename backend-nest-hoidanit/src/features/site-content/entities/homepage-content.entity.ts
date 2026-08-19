import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export interface HomepageStat {
  value: string;
  label: string;
}

export const HOMEPAGE_CONTENT_ID = 1;

@Entity('homepage_content')
export class HomepageContent {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  headline: string;

  @Column({ type: 'text' })
  subtitle: string;

  @Column({ type: 'varchar', length: 100, name: 'cta_text' })
  ctaText: string;

  @Column({ type: 'varchar', length: 255, name: 'cta_link' })
  ctaLink: string;

  @Column({ type: 'json' })
  stats: HomepageStat[];

  @Column({ type: 'json', name: 'partner_brands' })
  partnerBrands: string[];

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
