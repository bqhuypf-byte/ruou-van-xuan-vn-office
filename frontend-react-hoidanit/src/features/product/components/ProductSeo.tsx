import { useSiteSettings } from '@/features/home';
import { SeoMeta } from '@/shared/components/SeoMeta';
import { ROUTES } from '@/routes/routes';
import type { Product } from '../types/product.types';
import { buildProductMetaDescription } from '../utils/productSeo.utils';

export const ProductSeo = ({ product }: { product: Product }) => {
  const { data: settings } = useSiteSettings();
  const siteName = settings?.siteName?.trim();
  const title = siteName ? `${product.name} | ${siteName}` : product.name;
  const productPath = ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug);
  const canonicalUrl = new URL(productPath, window.location.origin).toString();
  const imageUrl = product.thumbnailUrl
    ? new URL(product.thumbnailUrl, window.location.origin).toString()
    : null;

  return (
    <SeoMeta
      title={title}
      description={buildProductMetaDescription(product)}
      canonicalUrl={canonicalUrl}
      imageUrl={imageUrl}
      fallbackTitle={settings?.browserTitle || siteName}
      type="product"
    />
  );
};
