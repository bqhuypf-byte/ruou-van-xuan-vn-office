import { HomepageSectionDisplayStyle } from '../entities/homepage-section.entity';

export interface HomepageSectionItemProductView {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  price: number | null;
  salePrice: number | null;
  rating: number | null;
  reviewCount: number;
}

export interface HomepageSectionItemView {
  id: number;
  productId: number;
  sortOrder: number;
  badgeText: string | null;
  overridePrice: number | null;
  overrideOriginalPrice: number | null;
  product: HomepageSectionItemProductView | null;
}

export interface HomepageSectionView {
  id: number;
  title: string;
  displayStyle: HomepageSectionDisplayStyle;
  sortOrder: number;
  isActive: boolean;
  items: HomepageSectionItemView[];
}
