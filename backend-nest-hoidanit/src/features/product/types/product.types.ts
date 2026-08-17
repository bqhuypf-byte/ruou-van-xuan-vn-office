import { Category } from '../entities/category.entity';

export type CategoryTreeNode = Omit<Category, 'parent' | 'children'> & {
  children: CategoryTreeNode[];
};
