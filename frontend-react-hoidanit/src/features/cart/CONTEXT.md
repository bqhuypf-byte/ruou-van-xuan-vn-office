# Feature: Cart (Client)

Cart state is server-backed (per `01-share-docs/API_SPEC.md`'s Cart Feature), not a Zustand store — the backend already handles both guest (httpOnly `cartSessionId` cookie, set automatically since `axiosInstance` has `withCredentials: true`) and logged-in identity transparently. No cart-identity plumbing is needed on the frontend at all.

## Pages & Components

- `CartPage` (`/cart`, public — works for guests): view/update quantity/remove/clear cart items, validate and apply vouchers, order summary.
- `CartBadge`: header cart icon + item-count badge, used in `MainLayout`.
- `CartItemRow`: one line item — thumbnail, name/SKU, color/size badges, quantity stepper (capped at `stockQuantity`), line total, remove.

## The product-name gap

`GET /cart` only returns `{ id, cartId, productVariantId, quantity }` — no product name, image, or even price (the backend's `CartItem` entity has no relation to `product_variants`, by design, per the backend's own CONTEXT.md). To render a usable cart:

1. **Price/SKU/stock**: `useCart` fetches each item's variant live via `GET /variants/:id` (`variantService.getVariantById`, public, already exists for the admin product feature) — this is the source of truth and always current.
2. **Product name/thumbnail/slug**: there is no endpoint that maps a `productVariantId` back to its product. Instead, `features/product/stores/productCache.store.ts` (Zustand + `persist` to `localStorage`) caches `variantId → {productName, productSlug, thumbnailUrl}` whenever the user views a product detail page (`ProductViewPage` calls `cacheProductDetail(product)` on load) or the admin manages one. `useCart` looks up this cache per item; if a variant was never viewed in this browser (e.g. added to cart from a different session, or seeded data), the row falls back to showing just the SKU with no image/name/link — a known, documented degradation, not a bug.

## Architecture-diagram exception

FE-ARCHITECTURE.md's Cross-Feature Communication diagram only draws `cart → product` and `cart → auth`. Two intentional exceptions here, both narrow (a hook import, not deep internals):
- `features/product/pages/ProductViewPage.tsx` imports `useAddCartItem` from `@/features/cart` (product → cart) — the product detail page is where "Add to Cart" naturally lives.
- `features/auth/pages/LoginPage.tsx` imports `useMergeCart` from `@/features/cart` (auth → cart) — merging the guest cart into the user's cart is a natural post-login side effect (best-effort: failure doesn't block login/navigation, since a guest cart may simply not exist).

## Checkout

The cart validates a voucher with `POST /vouchers/validate` against the live item subtotal. A valid fixed or percentage discount updates the displayed total immediately, then the code is passed to `/checkout?voucher=...`. Checkout validates it again before order submission, and the backend performs the final authoritative validation when creating the order.
