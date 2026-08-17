export interface Category {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  children: Category[];
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  parentId?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  parentId?: number;
}

export interface CategoryFilterParams {
  search?: string;
}
