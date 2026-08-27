const toAsciiUpper = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();

export const generateVariantSku = (
  productSlug: string,
  attributeValues: (string | undefined)[],
  suffix?: string,
): string => {
  const productCode =
    productSlug
      .split('-')
      .filter(Boolean)
      .map((word) => toAsciiUpper(word)[0])
      .join('') || 'SKU';

  const attributeCodes = attributeValues
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => toAsciiUpper(value).slice(0, 6));

  const randomSuffix =
    suffix ?? Math.random().toString(36).slice(2, 6).toUpperCase();

  return [productCode, ...attributeCodes, randomSuffix].filter(Boolean).join('-');
};
