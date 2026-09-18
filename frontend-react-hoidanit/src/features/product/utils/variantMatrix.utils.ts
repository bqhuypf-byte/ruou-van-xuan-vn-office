import { generateVariantSku } from '@/shared/utils/generateSku';
import type { VariantAttributeGroup } from '../types/product.types';
import type { ProductVariant } from '../types/variant.types';

export interface MatrixRow {
  key: string;
  attributes: Record<string, string>;
  groupValue: string;
  variantId: number | null;
  sku: string;
  price: string;
  salePrice: string;
  stockQuantity: string;
}

export const cartesian = (groups: VariantAttributeGroup[]): Record<string, string>[] => {
  if (groups.length === 0) return [];
  return groups.reduce<Record<string, string>[]>(
    (rows, group) =>
      rows.flatMap((row) => group.values.map((value) => ({ ...row, [group.name]: value }))),
    [{}],
  );
};

const stableSuffix = (input: string): string => {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(36).slice(0, 4).toUpperCase().padStart(4, '0');
};

const attributeValueSignature = (attributes: Record<string, string>): string =>
  JSON.stringify(
    Object.values(attributes)
      .map((value) => value.trim().toLocaleLowerCase('vi-VN'))
      .sort(),
  );

const isAttributeSubset = (
  subset: Record<string, string>,
  attributes: Record<string, string>,
): boolean => {
  const remainingValues = Object.values(attributes).map((value) =>
    value.trim().toLocaleLowerCase('vi-VN'),
  );

  return Object.values(subset).every((value) => {
    const normalizedValue = value.trim().toLocaleLowerCase('vi-VN');
    const index = remainingValues.indexOf(normalizedValue);
    if (index < 0) return false;
    remainingValues.splice(index, 1);
    return true;
  });
};

export const buildRows = (
  groups: VariantAttributeGroup[],
  variants: ProductVariant[],
  productSlug: string,
): MatrixRow[] => {
  const combinations = cartesian(groups);
  const usedVariantIds = new Set<number>();

  return combinations.map((attributes) => {
    const exactVariant = variants.find(
      (candidate) =>
        !usedVariantIds.has(candidate.id) &&
        groups.every((group) => candidate.attributes?.[group.name] === attributes[group.name]),
    );
    const valuesSignature = attributeValueSignature(attributes);
    const sameValuesVariant = variants.find(
      (candidate) =>
        !usedVariantIds.has(candidate.id) &&
        Object.keys(candidate.attributes ?? {}).length === groups.length &&
        attributeValueSignature(candidate.attributes ?? {}) === valuesSignature,
    );
    const matchedVariant = exactVariant ?? sameValuesVariant;
    if (matchedVariant) usedVariantIds.add(matchedVariant.id);
    const key = JSON.stringify(groups.map((group) => attributes[group.name]));

    return {
      key,
      attributes,
      groupValue: groups[0] ? attributes[groups[0].name] : key,
      variantId: matchedVariant?.id ?? null,
      sku:
        matchedVariant?.sku ??
        generateVariantSku(
          productSlug,
          groups.map((group) => attributes[group.name]),
          stableSuffix(`${productSlug}__${key}`),
        ),
      price: matchedVariant?.price ?? '',
      salePrice: matchedVariant?.salePrice ?? '',
      stockQuantity: matchedVariant ? String(matchedVariant.stockQuantity) : '0',
    };
  });
};

export const reconcileRows = (
  currentRows: MatrixRow[],
  groups: VariantAttributeGroup[],
  variants: ProductVariant[],
  productSlug: string,
): MatrixRow[] => {
  const nextRows = buildRows(groups, variants, productSlug);
  const currentByKey = new Map(currentRows.map((row) => [row.key, row]));

  return nextRows.map((nextRow) => {
    const currentRow = currentByKey.get(nextRow.key);
    if (currentRow) {
      return {
        ...nextRow,
        sku: currentRow.sku,
        price: currentRow.price,
        salePrice: currentRow.salePrice,
        stockQuantity: currentRow.stockQuantity,
      };
    }

    const parentRow = currentRows.find((candidate) =>
      isAttributeSubset(candidate.attributes, nextRow.attributes),
    );
    if (!parentRow) return nextRow;

    return {
      ...nextRow,
      price: parentRow.price,
      salePrice: parentRow.salePrice,
      stockQuantity: parentRow.stockQuantity,
    };
  });
};
