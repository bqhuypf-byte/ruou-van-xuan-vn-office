import { useSiteSettings } from '@/features/home';
import { SeoMeta } from '@/shared/components/SeoMeta';
import { ROUTES } from '@/routes/routes';
import { normalizePublicMediaUrl } from '@/shared/utils/publicMediaUrl';
import type { ProductDetail } from '../services/product.service';
import { buildProductMetaDescription, buildProductSeoTitle } from '../utils/productSeo.utils';
import { ProductStructuredData } from './ProductStructuredData';

export const ProductSeo = ({ product }: { product: ProductDetail }) => {
  const { data: settings } = useSiteSettings();
  const siteName = settings?.siteName?.trim();
  const title = buildProductSeoTitle(product, siteName);
  const productPath = ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug);
  const canonicalUrl = new URL(productPath, window.location.origin).toString();
  const imageUrl = product.thumbnailUrl
    ? new URL(normalizePublicMediaUrl(product.thumbnailUrl), window.location.origin).toString()
    : null;

  return (
    <>
      <SeoMeta
        title={title}
        description={buildProductMetaDescription(product)}
        canonicalUrl={canonicalUrl}
        imageUrl={imageUrl}
        fallbackTitle={settings?.browserTitle || siteName}
        type="product"
      />
      <ProductStructuredData product={product} siteName={siteName} />
    </>
  );
};
