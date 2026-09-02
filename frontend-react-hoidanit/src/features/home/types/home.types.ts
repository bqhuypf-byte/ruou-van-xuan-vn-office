export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  badgeText: string | null;
  imageUrl: string | null;
  ctaLink: string | null;
  bgColor: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateBannerInput {
  title: string;
  subtitle?: string;
  badgeText?: string;
  imageUrl?: string;
  ctaLink?: string;
  bgColor?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateBannerInput = Partial<CreateBannerInput>;

export interface Brand {
  id: number;
  name: string;
  badgeText: string | null;
  imageUrl: string | null;
  bgColor: string | null;
  tagPillColor: string | null;
  ctaLink: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateBrandInput {
  name: string;
  badgeText?: string;
  imageUrl?: string;
  bgColor?: string;
  tagPillColor?: string;
  ctaLink?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateBrandInput = Partial<CreateBrandInput>;

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

export interface SiteSettings {
  id: number;
  siteName: string;
  logoUrl: string | null;
  browserTitle: string | null;
  faviconUrl: string | null;
  topBarMessage: string;
  deliverToText: string;
  contactPhone: string;
  whatsappNumber: string;
  contactAddresses: ContactAddress[] | null;
  facebookUrl: string | null;
  zaloUrl: string | null;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  copyrightText: string;
  footerDescription: string | null;
  dealsSectionTitle: string;
  featuredBrandsSectionTitle: string;
  topCategoriesSectionTitle: string;
  popularCategoriesTitle: string;
  popularCategoriesLinks: FooterLink[];
  customerServiceTitle: string;
  customerServiceLinks: FooterLink[];
  footerAboutTitle: string;
  footerAboutLinks: FooterLink[] | null;
  footerServicesTitle: string;
  footerServicesLinks: FooterLink[] | null;
  footerBottomLinks: FooterLink[] | null;
  trustBadges: TrustBadge[];
  paymentMethodIcons: PaymentMethodIcon[];
  codDescription: string | null;
  storePickupDescription: string | null;
  bankTransferDescription: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountHolder: string | null;
  bankBin: string | null;
  shippingFee: string;
  freeShippingThreshold: string;
  checkoutReviewNote: string | null;
  checkoutShippingNote: string | null;
  checkoutPaymentNote: string | null;
  checkoutSummaryNote: string | null;
  contactChannels: ContactChannel[];
}

export type UpdateSiteSettingsInput = Partial<
  Omit<SiteSettings, 'id' | 'shippingFee' | 'freeShippingThreshold'>
> & {
  shippingFee?: number;
  freeShippingThreshold?: number;
};

export interface Faq {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateFaqInput {
  question: string;
  answer: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateFaqInput = Partial<CreateFaqInput>;

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageInput {
  slug: string;
  title: string;
  content: string;
  isActive?: boolean;
}

export type UpdatePageInput = Partial<CreatePageInput>;

export type VoucherDiscountType = 'percent' | 'fixed';

export interface Voucher {
  id: number;
  code: string;
  title: string;
  description: string | null;
  discountType: VoucherDiscountType;
  discountValue: string;
  minOrderAmount: string;
  maxDiscountAmount: string | null;
  startDate: string | null;
  endDate: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateVoucherInput {
  code: string;
  title: string;
  description?: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateVoucherInput = Partial<CreateVoucherInput>;

export interface VoucherValidationResult {
  code: string;
  title: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  discountAmount: number;
  finalAmount: number;
}
