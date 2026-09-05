import { stripHtml } from '@/shared/utils/stripHtml';
import type { Product } from '../types/product.types';

const META_DESCRIPTION_MAX_LENGTH = 160;

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim();

const truncateMetaDescription = (value: string) => {
  if (value.length <= META_DESCRIPTION_MAX_LENGTH) return value;

  const truncated = value.slice(0, META_DESCRIPTION_MAX_LENGTH - 1);
  const lastSpace = truncated.lastIndexOf(' ');
  const cleanEnding = lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated;
  return `${cleanEnding.trimEnd()}…`;
};

export const buildProductMetaDescription = (product: Product) => {
  const description =
    normalizeText(product.shortDescription ?? '') ||
    normalizeText(product.description ? stripHtml(product.description) : '') ||
    normalizeText(product.name);

  return truncateMetaDescription(description);
};
