import type { ReactNode, ElementType } from 'react';

export interface CartBadgeProps {
  itemCount?: number;
  icon?: ReactNode;
  linkComponent?: ElementType;
  href?: string;
}

export function CartBadge(props: CartBadgeProps): JSX.Element;
