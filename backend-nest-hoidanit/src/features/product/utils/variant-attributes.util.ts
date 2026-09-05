import type { VariantAttributeGroup } from '../types/variant-attribute-group.type';

export const matchesVariantAttributes = (
  attributes: Record<string, string> | null,
  groups: VariantAttributeGroup[],
): boolean => {
  if (!attributes) return false;

  const attributeNames = Object.keys(attributes);
  return (
    attributeNames.length === groups.length &&
    groups.every(
      (group) =>
        attributeNames.includes(group.name) &&
        group.values.includes(attributes[group.name]),
    )
  );
};

interface PricedVariant {
  attributes: Record<string, string> | null;
  price: string;
  salePrice: string | null;
}

export const getDisplayedVariantPrice = (variant: PricedVariant): number => {
  const price = Number(variant.price);
  const salePrice =
    variant.salePrice === null ? null : Number(variant.salePrice);
  return salePrice !== null && salePrice > 0 && salePrice < price
    ? salePrice
    : price;
};

export const findLowestPricedVariant = <T extends PricedVariant>(
  variants: T[],
  groups: VariantAttributeGroup[],
): T | undefined =>
  variants
    .filter(
      (variant) =>
        groups.length === 0 ||
        matchesVariantAttributes(variant.attributes, groups),
    )
    .reduce<T | undefined>((lowest, variant) => {
      if (!lowest) return variant;
      const variantPrice = getDisplayedVariantPrice(variant);
      const lowestPrice = getDisplayedVariantPrice(lowest);
      return variantPrice < lowestPrice ? variant : lowest;
    }, undefined);
