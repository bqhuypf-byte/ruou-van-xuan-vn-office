import type { ElementType } from 'react';

export interface PromoBandProps {
  title?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  ButtonComponent?: ElementType;
}

export function PromoBand(props: PromoBandProps): JSX.Element;
