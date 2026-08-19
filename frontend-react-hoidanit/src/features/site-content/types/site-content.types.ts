export interface HomepageStat {
  value: string;
  label: string;
}

export interface HomepageContent {
  id: number;
  headline: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  stats: HomepageStat[];
  partnerBrands: string[];
  updatedAt?: string;
}

export interface UpdateHomepageContentInput {
  headline?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  stats?: HomepageStat[];
  partnerBrands?: string[];
}
