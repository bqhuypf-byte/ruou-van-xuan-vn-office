import { normalizePublicMediaUrl } from '@/shared/utils/publicMediaUrl';
import type { ProductDetail } from '../services/product.service';
import { buildProductMetaDescription } from '../utils/productSeo.utils';

const absoluteUrl = (value: string) =>
  new URL(normalizePublicMediaUrl(value), window.location.origin).toString();

const uniqueImages = (product: ProductDetail) =>
  [
    ...new Set(
      [
        product.thumbnailUrl,
        ...product.images.map((image) => image.imageUrl),
        ...product.variants.map((variant) => variant.imageUrl),
      ].filter((value): value is string => Boolean(value)),
    ),
  ].map(absoluteUrl);

const aggregateRating = (product: ProductDetail) =>
  product.rating && product.reviewCount
    ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      }
    : undefined;

const propertyValues = (attributes: Record<string, string> | null) =>
  Object.entries(attributes ?? {}).map(([name, value]) => ({
    '@type': 'PropertyValue',
    name,
    value,
  }));

export const buildProductStructuredData = (
  product: ProductDetail,
  siteName?: string | null,
) => {
  const canonicalUrl = new URL(`/products/${product.slug}`, window.location.origin).toString();
  const images = uniqueImages(product);
  const brand = siteName?.trim()
    ? { '@type': 'Brand', name: siteName.trim() }
    : undefined;
  const rating = aggregateRating(product);
  const variants = product.variants.filter((variant) => variant.isActive !== false);
  const configuredGroups = product.variantAttributes ?? [];
  const canGroupVariants =
    configuredGroups.length > 0 &&
    variants.every((variant) =>
      configuredGroups.every(
        (group) =>
          variant.attributes &&
          group.values.includes(variant.attributes[group.name]),
      ),
    );
  const variantNodes = variants.map((variant) => {
    const attributeLabel = Object.values(variant.attributes ?? {}).join(' ');
    return {
      '@type': 'Product',
      '@id': `${canonicalUrl}#${encodeURIComponent(variant.sku)}`,
      name: attributeLabel ? `${product.name} - ${attributeLabel}` : product.name,
      sku: variant.sku,
      description: buildProductMetaDescription(product),
      image: images,
      brand,
      additionalProperty: propertyValues(variant.attributes),
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'VND',
        price: Number(variant.salePrice ?? variant.price),
        availability:
          variant.stockQuantity > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
    };
  });

  if (variantNodes.length <= 1) {
    return {
      '@context': 'https://schema.org',
      ...(variantNodes[0] ?? {
        '@type': 'Product',
        name: product.name,
        description: buildProductMetaDescription(product),
        image: images,
        brand,
      }),
      '@id': `${canonicalUrl}#product`,
      url: canonicalUrl,
      aggregateRating: rating,
    };
  }

  if (!canGroupVariants) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${canonicalUrl}#product`,
      name: product.name,
      description: buildProductMetaDescription(product),
      url: canonicalUrl,
      image: images,
      brand,
      aggregateRating: rating,
      offers: variantNodes.map((variant) => variant.offers),
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    '@id': `${canonicalUrl}#product-group`,
    productGroupID: `product-${product.id}`,
    name: product.name,
    description: buildProductMetaDescription(product),
    url: canonicalUrl,
    image: images,
    brand,
    aggregateRating: rating,
    variesBy: configuredGroups.map(() => 'https://schema.org/additionalProperty'),
    hasVariant: variantNodes,
  };
};

export const ProductStructuredData = ({
  product,
  siteName,
}: {
  product: ProductDetail;
  siteName?: string | null;
}) => {
  const json = JSON.stringify(buildProductStructuredData(product, siteName)).replace(
    /</g,
    '\\u003c',
  );
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
};
