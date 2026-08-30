import type { ReactNode, ElementType } from 'react';

export interface NavCategory { id: number | string; name: string; href?: string; children?: NavCategory[]; }

export interface CategoryNavMenuProps {
  tree: NavCategory[];
  icon?: ReactNode;
  linkComponent?: ElementType;
}

export function CategoryNavMenu(props: CategoryNavMenuProps): JSX.Element | null;
