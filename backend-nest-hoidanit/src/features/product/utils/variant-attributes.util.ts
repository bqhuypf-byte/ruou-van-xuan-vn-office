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
