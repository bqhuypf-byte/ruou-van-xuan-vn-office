# Project SEO map

## Current product fields

| Concern | Existing source | Current behavior |
|---|---|---|
| Product title | `products.name` | `<title>` is `product.name | siteName` when site name exists. |
| URL/canonical | `products.slug` | Product route and canonical URL use the slug. Slug is unique, max 255. |
| Meta description | `products.short_description` | Normalized and truncated to 160 characters; falls back to stripped `description`, then name. |
| Visible long copy | `products.description` | Nullable HTML/text product description. |
| Social/share image | `products.thumbnail_url` | Used by the shared SEO component when present. |
| Gallery | `product_images` | Ordered by `sort_order`; URLs are stored in Admin-managed data. |
| Classification | `products.variant_attributes` | Up to two attribute groups used to generate variant combinations. |
| Commercial facts | `product_variants` | SKU, attributes, price, sale price, and stock belong to each variant. SKU is unique and max 50. |

Read the current implementation before relying on this map:

- `frontend-react-hoidanit/src/features/product/components/ProductSeo.tsx`
- `frontend-react-hoidanit/src/features/product/utils/productSeo.utils.ts`
- `backend-nest-hoidanit/src/features/product/entities/product.entity.ts`
- `backend-nest-hoidanit/src/features/product/entities/product-variant.entity.ts`

## Known limits

The current product schema has no dedicated fields for SEO title, SEO
description, image alt text, primary keyword, redirects, or per-product social
metadata. `ProductSeo` does not itself prove that Product JSON-LD, breadcrumbs,
or merchant-listing structured data are emitted elsewhere.

Because the supplied reference uses multiple alcohol-level SKUs on one product
page, inspect whether the rendered page emits Google `ProductGroup`/variant
markup and whether each visible offer maps to a unique SKU. The content audit
script cannot verify rendered HTML, indexability, Core Web Vitals, sitemap,
Search Console, or Rich Results eligibility; perform those as technical checks.

Before claiming these capabilities exist, inspect the current code and rendered
page. If absent, propose them as a separate implementation with Admin-managed
fields where editors need control. Do not overload unrelated fields merely to
make an audit pass.

## Update boundary

Content operations should use existing Admin/API data. A database migration,
React change, backend DTO change, redirect system, or structured-data feature is
a code change and requires the user to approve that expanded scope.
