import type { ElementType } from 'react';

export interface UserMenuUser { fullName: string; email: string; }

export interface UserMenuProps {
  user: UserMenuUser | null;
  onLogout?: () => void;
  isAdmin?: boolean;
  linkComponent?: ElementType;
  routes?: { profile?: string; orders?: string; admin?: string };
}

export function UserMenu(props: UserMenuProps): JSX.Element | null;
