# Feature: Product (Categories, Products, Variants, Images)

Full "Complex Feature" layout per BE-ARCHITECTURE.md — one `product.module.ts`, one controller/service/repository per entity:
- `categories`: `id`, `parent_id` (self-ref, nullable), `name`, `slug` (unique)
- `products`: `id`, `category_id` (FK), `name`, `slug` (unique), `description` (nullable), `thumbnail_url` (nullable), `is_active`, `created_at`, `updated_at`
- `product_variants`: `id`, `product_id` (FK), `sku` (unique), `color`/`size` (nullable), `price`, `sale_price` (nullable), `stock_quantity`
- `product_images`: `id`, `product_id` (FK), `image_url`, `sort_order`

All per `01-share-docs/DATABASE.md`.

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/categories` | List categories as a nested tree | No |
| GET | `/categories/:slug` | Category by slug + its direct children | No |
| GET | `/products` | List products, paginated + filterable | No |
| GET | `/products/:slug` | Product + variants + images | No |
| GET | `/products/:id/variants` | List a product's variants | No |
| GET | `/variants/:id` | Variant detail | No |
| POST/PATCH/DELETE | `/admin/categories(/:id)` | Category CRUD | Admin |
| POST/PATCH/DELETE | `/admin/products(/:id)` | Product CRUD (`DELETE` = soft delete, sets `is_active=false`) | Admin |
| POST | `/admin/products/:id/variants` | Create variant | Admin |
| PATCH | `/admin/variants/:id` | Update variant | Admin |
| POST | `/admin/products/:id/images` | Add images | Admin |
| DELETE | `/admin/images/:id` | Delete image | Admin |

## Important deviations from API_SPEC.md

- **`POST /admin/products/:id/images`**: API_SPEC.md documents this as `multipart/form-data` file upload (field `files`). There's no file-storage service (S3/local disk) wired into this codebase, so — consistent with the checkout-item decision in [[order feature]] — this instead accepts a JSON body `{ images: [{ imageUrl, sortOrder? }] }`, mirroring how `thumbnailUrl` is already a plain client-supplied string elsewhere in this feature. Swap for real multipart handling (`FilesInterceptor` + a storage adapter) once one exists.
- `GET /products` filtering: `categoryId`, `isActive` (defaults to `true` when the caller doesn't pass it — hides soft-deleted products from the public catalog by default), `minPrice`/`maxPrice` (joins `product_variants`, so a product matches if *any* variant falls in range), `page`/`limit` (default 10, capped at 100).

## Infra change: paginated responses

`GET /products` is the first paginated list endpoint in this codebase. `shared/types/pagination.type.ts` (`PaginationMeta`/`PaginationQuery`) already existed but was unused. Wired it up:
- `ApiSuccessResponse<T>` (`shared/types/response.type.ts`) gained an optional `meta?: PaginationMeta`.
- `TransformInterceptor` now detects a handler return shaped `{ data, meta }` and flattens it to the API_SPEC.md list shape `{ success, data, meta }`, instead of double-nesting `data` inside `data`. Any future paginated endpoint should return `{ data: items, meta }` from its controller method to get this for free.

## Notes

- `Product`/`ProductVariant`/`ProductImage` use real TypeORM relations to each other and to `Category` — all in the same `product` feature, so no cross-feature-import rule violation.
- `ProductService.findBySlug` and the default `GET /products` listing both hide inactive (soft-deleted) products (404 / filtered out) unless the caller explicitly passes `isActive=false`— there's no separate admin listing endpoint in API_SPEC.md, so the same public routes serve both, gated only by the `isActive` query default.
- `ProductVariantService`/`ProductService` both depend on `ProductRepository` (product existence checks) — no circular dependency since neither service depends on the other, only on shared repositories.
- Price/salePrice are stored as `decimal` (TypeORM maps to `string`); DTOs accept `number` and the services convert via `.toFixed(2)`, same pattern as [[cart feature]] and [[order feature]].
- `CategoryController` notes (guard split, tree building, cycle checks) unchanged from before — see prior notes in git history if needed.
