export type CategoryHomeDisplayStyle = 'grid' | 'carousel';

export interface Category {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  homeSortOrder: number;
  showInProductSections: boolean;
  homeSectionTitle: string | null;
  homeDisplayStyle: CategoryHomeDisplayStyle;
  children: Category[];
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  parentId?: number;
  description?: string;
  thumbnailUrl?: string;
  homeSortOrder?: number;
  showInProductSections?: boolean;
  homeSectionTitle?: string;
  homeDisplayStyle?: CategoryHomeDisplayStyle;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  parentId?: number;
  description?: string;
  thumbnailUrl?: string;
  homeSortOrder?: number;
  showInProductSections?: boolean;
  homeSectionTitle?: string;
  homeDisplayStyle?: CategoryHomeDisplayStyle;
}

export interface CategoryFilterParams {
  search?: string;
}
