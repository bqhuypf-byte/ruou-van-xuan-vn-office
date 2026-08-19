import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export interface FooterLink {
  label: string;
  url: string;
}

export const SITE_SETTINGS_ID = 1;

@Entity('site_settings')
export class SiteSettings {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'site_name' })
  siteName: string;

  @Column({ type: 'varchar', length: 500, name: 'logo_url', nullable: true })
  logoUrl: string | null;

  @Column({ type: 'varchar', length: 255, name: 'top_bar_message' })
  topBarMessage: string;

  @Column({ type: 'varchar', length: 100, name: 'deliver_to_text' })
  deliverToText: string;

  @Column({ type: 'varchar', length: 20, name: 'contact_phone' })
  contactPhone: string;

  @Column({ type: 'varchar', length: 20, name: 'whatsapp_number' })
  whatsappNumber: string;

  @Column({ type: 'varchar', length: 500, name: 'app_store_url', nullable: true })
  appStoreUrl: string | null;

  @Column({ type: 'varchar', length: 500, name: 'play_store_url', nullable: true })
  playStoreUrl: string | null;

  @Column({ type: 'varchar', length: 255, name: 'copyright_text' })
  copyrightText: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'popular_categories_title',
  })
  popularCategoriesTitle: string;

  @Column({ type: 'json', name: 'popular_categories_links' })
  popularCategoriesLinks: FooterLink[];

  @Column({
    type: 'varchar',
    length: 100,
    name: 'customer_service_title',
  })
  customerServiceTitle: string;

  @Column({ type: 'json', name: 'customer_service_links' })
  customerServiceLinks: FooterLink[];

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
