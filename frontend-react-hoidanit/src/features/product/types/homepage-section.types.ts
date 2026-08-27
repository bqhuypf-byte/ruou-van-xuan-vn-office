export type HomepageSectionDisplayStyle = 'grid' | 'carousel';

export interface HomepageSectionItemProduct {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  price: number | null;
  salePrice: number | null;
  rating: number | null;
  reviewCount: number;
}

export interface HomepageSectionItem {
  id: number;
  productId: number;
  sortOrder: number;
  badgeText: string | null;
  overridePrice: number | null;
  overrideOriginalPrice: number | null;
  product: HomepageSectionItemProduct | null;
}

export interface HomepageSection {
  id: number;
  title: string;
  displayStyle: HomepageSectionDisplayStyle;
  sortOrder: number;
  isActive: boolean;
  items: HomepageSectionItem[];
}

export interface CreateHomepageSectionInput {
  title: string;
  displayStyle?: HomepageSectionDisplayStyle;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateHomepageSectionInput = Partial<CreateHomepageSectionInput>;

export interface AddSectionItemInput {
  productId: number;
  sortOrder?: number;
  overridePrice?: number;
  overrideOriginalPrice?: number;
  badgeText?: string;
}

export interface UpdateSectionItemInput {
  sortOrder?: number;
  overridePrice?: number | null;
  overrideOriginalPrice?: number | null;
  badgeText?: string | null;
}
