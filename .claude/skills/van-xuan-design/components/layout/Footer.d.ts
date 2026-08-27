import type { ReactNode, ElementType } from 'react';

export interface FooterLink { label: string; url: string; }

export interface FooterProps {
  siteName?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  popularTitle?: string;
  popularLinks?: FooterLink[];
  serviceTitle?: string;
  serviceLinks?: FooterLink[];
  copyrightText?: string;
  linkComponent?: ElementType;
}

export function Footer(props: FooterProps): JSX.Element;
