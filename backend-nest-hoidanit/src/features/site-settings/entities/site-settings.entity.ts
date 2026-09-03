import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export interface FooterLink {
  label: string;
  url: string;
}

export interface ContactAddress {
  label: string;
  address: string;
}

export interface TrustBadge {
  icon: string;
  title: string;
  description: string;
}

export interface PaymentMethodIcon {
  name: string;
  iconUrl: string;
}

export interface ContactChannelLocation {
  label: string;
  link: string;
}

export interface ContactChannel {
  icon: string;
  label: string;
  hours: string;
  link: string;
  bgColor: string;
  isActive: boolean;
  locations?: ContactChannelLocation[];
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

  @Column({
    type: 'varchar',
    length: 255,
    name: 'browser_title',
    nullable: true,
  })
  browserTitle: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'favicon_url',
    nullable: true,
  })
  faviconUrl: string | null;

  @Column({ type: 'varchar', length: 255, name: 'top_bar_message' })
  topBarMessage: string;

  @Column({ type: 'varchar', length: 100, name: 'deliver_to_text' })
  deliverToText: string;

  @Column({ type: 'varchar', length: 20, name: 'contact_phone' })
  contactPhone: string;

  @Column({ type: 'varchar', length: 20, name: 'whatsapp_number' })
  whatsappNumber: string;

  @Column({ type: 'json', name: 'contact_addresses', nullable: true })
  contactAddresses: ContactAddress[] | null;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'facebook_url',
    nullable: true,
  })
  facebookUrl: string | null;

  @Column({ type: 'varchar', length: 500, name: 'zalo_url', nullable: true })
  zaloUrl: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'app_store_url',
    nullable: true,
  })
  appStoreUrl: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'play_store_url',
    nullable: true,
  })
  playStoreUrl: string | null;

  @Column({ type: 'varchar', length: 255, name: 'copyright_text' })
  copyrightText: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'footer_description',
    nullable: true,
  })
  footerDescription: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'deals_section_title',
    default: 'Featured Deals',
  })
  dealsSectionTitle: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'featured_brands_section_title',
    default: 'Featured Brands',
  })
  featuredBrandsSectionTitle: string;

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

  @Column({
    type: 'varchar',
    length: 100,
    name: 'footer_about_title',
    default: 'Về Chúng Tôi',
  })
  footerAboutTitle: string;

  @Column({ type: 'json', name: 'footer_about_links', nullable: true })
  footerAboutLinks: FooterLink[] | null;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'footer_services_title',
    default: 'Dịch Vụ',
  })
  footerServicesTitle: string;

  @Column({ type: 'json', name: 'footer_services_links', nullable: true })
  footerServicesLinks: FooterLink[] | null;

  @Column({ type: 'json', name: 'footer_bottom_links', nullable: true })
  footerBottomLinks: FooterLink[] | null;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'top_categories_section_title',
    default: 'Shop Top Categories',
  })
  topCategoriesSectionTitle: string;

  @Column({ type: 'json', name: 'trust_badges', nullable: true })
  trustBadges: TrustBadge[] | null;

  @Column({
    type: 'json',
    name: 'payment_method_icons',
    nullable: true,
  })
  paymentMethodIcons: PaymentMethodIcon[] | null;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'cod_description',
    nullable: true,
  })
  codDescription: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'store_pickup_description',
    nullable: true,
  })
  storePickupDescription: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'bank_transfer_description',
    nullable: true,
  })
  bankTransferDescription: string | null;

  @Column({ type: 'varchar', length: 100, name: 'bank_name', nullable: true })
  bankName: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'bank_account_number',
    nullable: true,
  })
  bankAccountNumber: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'bank_account_holder',
    nullable: true,
  })
  bankAccountHolder: string | null;

  @Column({ type: 'varchar', length: 20, name: 'bank_bin', nullable: true })
  bankBin: string | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'shipping_fee',
    default: 0,
  })
  shippingFee: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'free_shipping_threshold',
    default: 500000,
  })
  freeShippingThreshold: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'checkout_review_note',
    nullable: true,
  })
  checkoutReviewNote: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'checkout_shipping_note',
    nullable: true,
  })
  checkoutShippingNote: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'checkout_payment_note',
    nullable: true,
  })
  checkoutPaymentNote: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'checkout_summary_note',
    nullable: true,
  })
  checkoutSummaryNote: string | null;

  @Column({ type: 'json', name: 'contact_channels', nullable: true })
  contactChannels: ContactChannel[] | null;

  @Column({ type: 'boolean', name: 'age_gate_enabled', default: true })
  ageGateEnabled: boolean;

  @Column({
    type: 'varchar',
    length: 150,
    name: 'age_gate_title',
    default: 'Chào Mừng Bạn Đến Với Rượu Vạn Xuân',
  })
  ageGateTitle: string;

  @Column({ type: 'text', name: 'age_gate_description', nullable: true })
  ageGateDescription: string | null;

  @Column({
    type: 'varchar',
    length: 80,
    name: 'age_gate_confirm_label',
    default: 'Tôi Trên 18 Tuổi',
  })
  ageGateConfirmLabel: string;

  @Column({
    type: 'varchar',
    length: 80,
    name: 'age_gate_reject_label',
    default: 'Chưa Đủ 18 Tuổi',
  })
  ageGateRejectLabel: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
