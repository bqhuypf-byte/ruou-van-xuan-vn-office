# Feature: Product (Admin CRUD + Public Catalog)

Two audiences share this feature: admin CRUD for `categories`/`products`/`product_variants`/`product_images`, and the public-facing catalog (homepage + product detail) that customers browse. Consumes `01-share-docs/API_SPEC.md`'s Product Feature endpoints.

## Pages & Routes

| Route | Page | Audience | Notes |
|-------|------|----------|-------|
| `/` | `HomePage` | Public | Product grid, category filter chips, pagination |
| `/products/:slug` | `ProductViewPage` | Public | Detail + variant picker + "Add to Cart" (see [[cart feature]]) |
| `/admin/categories` | `CategoriesPage` | Admin | Flat table (indented by depth) built by flattening the backend's tree response |
| `/admin/products` | `ProductsPage` | Admin | Server-paginated list, category filter, client-side search on the loaded page |
| `/admin/products/:slug` | `ProductDetailPage` | Admin | Manage a single product's variants + images |

`:slug` (not `:id`) throughout because the backend has no `GET /products/:id` — only `GET /products/:slug` returns a product with its variants/images embedded, so navigation and refetching are slug-driven.

## Public catalog notes

- **No price on `HomePage` cards**: `GET /products` (list) returns `Product` without any price — price only exists on `ProductVariant`, and the list endpoint doesn't join variants. Showing a price per card would mean an N+1 fetch per product, so cards show name/thumbnail/category only; price appears once the user opens `ProductViewPage` (which does fetch variants via `GET /products/:slug`).
- **`ProductViewPage`/`ProductPurchasePanel` split**: variant selection, quantity, and active-image state are owned by an inner `ProductPurchasePanel` component keyed on `product.id`, not reset via a `useEffect` + `setState` in the outer page — the lint rule `react-hooks/set-state-in-effect` (React Compiler plugin) flags synchronous `setState` in effects as a cascading-render risk. Keying a child component on the data it's derived from is the idiomatic replacement for "reset local state when a prop changes."
- **`useProductCacheStore`** (`stores/productCache.store.ts`): a Zustand + `persist` store mapping `variantId → {productName, productSlug, thumbnailUrl}`, populated whenever `ProductViewPage` loads a product. This exists solely to let [[cart feature]] render product names/images/links for cart items, since `GET /cart` has no such data and there's no variant→product lookup endpoint. See cart's CONTEXT.md for the full rationale.

## Structure

- `types/`: `category.types.ts`, `product.types.ts`, `variant.types.ts`, `image.types.ts`
- `services/`: one per entity, thin axios wrappers matching `role.service.ts`'s pattern
- `hooks/`: `useCategories` (fetch + flatten + client search), `useProducts` (server pagination + client search), `useProductDetail` (slug-keyed), plus `use*Mutations` per entity
- `components/`: `CategoryTable/FormModal/DeleteModal`, `ProductTable/FormModal/DeleteModal`, `VariantTable/FormModal`, `ImageGallery`, `ImageAddModal`
- `pages/`: `CategoriesPage`, `ProductsPage`, `ProductDetailPage`

## Notable decisions

- **No variant delete UI**: the backend has no `DELETE /admin/variants/:id` endpoint (per API_SPEC.md), so `VariantTable` only offers edit, never delete.
- **Product delete = soft delete**: `DELETE /admin/products/:id` sets `is_active=false` server-side; the confirmation modal and success copy say "Ngừng Bán" (stop selling), not "Xóa" (delete), to match what actually happens.
- **Image add is one URL at a time**: the backend's `POST /admin/products/:id/images` accepts a bulk `images[]` array (see [[product feature]] backend CONTEXT.md — it's JSON, not real multipart upload, since no file-storage service exists). `ImageAddModal` wraps a single `imageUrl` in a one-item array per submission; the form/API shape supports bulk if a future UI wants it.
- **`useCategories`' `flattenCategories`**: walks the nested tree once into a flat, depth-annotated list, then resolves `parentName` via a `parentId` lookup pass — used for both the admin table and the `parentId`/`categoryId` `<select>` dropdowns (rendered with `—` indentation per depth).
- **Error handling**: unlike `RolesPage`/`UsersPage` (which inline `err: any` + optional chaining — pre-existing lint debt, not touched here), this feature's pages use the existing `shared/utils/getApiErrorMessage.ts` util to stay `no-explicit-any`-clean.
- **Price fields**: `ProductVariant.price`/`salePrice` arrive from the backend as decimal strings (TypeORM `decimal` → JSON string). `VariantFormModal` keeps them as form strings (Zod `.refine()` instead of `z.coerce.number()`, which broke `zodResolver`'s type inference with `react-hook-form`) and converts to `number` only in the submit handler.

## Tests

Hook tests for all four entities (`useCategories` incl. `flattenCategories`, `useCategoryMutations`, `useProducts`, `useProductMutations`, `useProductDetail`, `useVariantMutations`, `useImageMutations`), the two most logic-heavy form modals (`CategoryFormModal` — parent-self-exclusion; `ProductFormModal` — required category), and full page-level integration tests (`CategoriesPage`, `ProductsPage`, `ProductDetailPage`) covering create/edit/delete/error-banner flows, mirroring `roles`/`users`' existing test structure.
