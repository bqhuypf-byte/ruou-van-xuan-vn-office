export interface Category {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  showInTopCategories: boolean;
  showInDailyEssentials: boolean;
  homeSortOrder: number;
  children: Category[];
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  parentId?: number;
  description?: string;
  thumbnailUrl?: string;
  showInTopCategories?: boolean;
  showInDailyEssentials?: boolean;
  homeSortOrder?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  parentId?: number;
  description?: string;
  thumbnailUrl?: string;
  showInTopCategories?: boolean;
  showInDailyEssentials?: boolean;
  homeSortOrder?: number;
}

export interface CategoryFilterParams {
  search?: string;
}
