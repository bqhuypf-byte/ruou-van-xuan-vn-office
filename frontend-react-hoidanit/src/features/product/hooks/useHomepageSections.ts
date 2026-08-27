import { useQuery } from '@tanstack/react-query';
import { homepageSectionService } from '../services/homepage-section.service';
import type { FeaturedDeal } from './useFeaturedDeals';
import type { HomepageSectionItem } from '../types/homepage-section.types';

export const HOMEPAGE_SECTIONS_QUERY_KEY = ['homepage-sections'] as const;

export const useHomepageSections = () => {
  const query = useQuery({
    queryKey: HOMEPAGE_SECTIONS_QUERY_KEY,
    queryFn: homepageSectionService.getPublicSections,
  });

  return { ...query, sections: query.data ?? [] };
};

export const toSectionDeal = (item: HomepageSectionItem): FeaturedDeal | null => {
  const { product } = item;
  if (!product) return null;

  const basePrice = item.overridePrice ?? product.salePrice ?? product.price;
  if (basePrice === null) return null;

  const originalPrice =
    item.overrideOriginalPrice ??
    (item.overridePrice === null && product.salePrice !== null ? product.price : null);
  const savings = originalPrice !== null ? originalPrice - basePrice : null;
  const discountPercent =
    originalPrice !== null && originalPrice > 0
      ? Math.round(((originalPrice - basePrice) / originalPrice) * 100)
      : null;

  return {
    product,
    price: basePrice,
    originalPrice,
    discountPercent,
    savings,
    badgeText: item.badgeText,
  };
};
