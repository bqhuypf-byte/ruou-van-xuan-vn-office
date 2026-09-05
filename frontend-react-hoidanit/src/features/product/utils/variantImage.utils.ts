import type { ProductDetail } from '../services/product.service';
import type { VariantAttributeGroup } from '../types/product.types';
import type { ProductVariant } from '../types/variant.types';

export const getConfiguredAttributeOptions = (
  groups: VariantAttributeGroup[],
): Record<string, string[]> =>
  Object.fromEntries(
    groups.map((group) => [
      group.name,
      [...new Set(group.values.map((value) => value.trim()).filter(Boolean))],
    ]),
  );

export const findVariantForAttributes = (
  variants: ProductVariant[],
  attributeNames: string[],
  attributeOptions: Record<string, string[]>,
  attributes: Record<string, string | null>,
): ProductVariant | undefined =>
  variants.find((variant) =>
    attributeNames.every(
      (name) =>
        (attributeOptions[name]?.length ?? 0) === 0 || variant.attributes?.[name] === attributes[name],
    ),
  );

export const getAttributeOptionImage = (
  product: ProductDetail,
  name: string,
  value: string,
): string | null => {
  const configuredImage = product.variantAttributes?.find((group) => group.name === name)?.images?.[value];
  const variantImage = product.variants.find(
    (variant) => variant.attributes?.[name] === value && variant.imageUrl,
  )?.imageUrl;
  return configuredImage ?? variantImage ?? null;
};
