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

export interface SiteSettings {
  id: number;
  siteName: string;
  logoUrl: string | null;
  topBarMessage: string;
  deliverToText: string;
  contactPhone: string;
  whatsappNumber: string;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  copyrightText: string;
  popularCategoriesTitle: string;
  popularCategoriesLinks: FooterLink[];
  customerServiceTitle: string;
  customerServiceLinks: FooterLink[];
}

export type UpdateSiteSettingsInput = Partial<Omit<SiteSettings, 'id'>>;
