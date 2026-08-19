# Feature: Review (Read-only display)

Displays product reviews (`GET /products/:id/reviews`, public, per `01-share-docs/API_SPEC.md`). **Deliberately read-only** — no "write a review" UI. Creating a review requires `orderId` + purchase verification (backend's `REV_002`), and picking which of the user's orders/products is eligible to review is real UX scope beyond what was asked ("show reviews for products"); write support is a natural next step but out of scope here.

## Structure

- `types/review.types.ts`, `services/review.service.ts` — thin, single-endpoint
- `hooks/useProductReviews.ts` — fetches + computes `averageRating`/`reviewCount` client-side (no separate summary endpoint)
- `components/StarRating.tsx`, `ReviewList.tsx`

## Integration

`features/product/pages/ProductViewPage.tsx` renders `StarRating` (next to the product title) and `ReviewList` (full section below the purchase panel), importing from `@/features/review`. This is a `product → review` dependency not drawn in FE-ARCHITECTURE.md's diagram — same class of pragmatic exception as `product → cart` (see [[cart feature]]'s CONTEXT.md), a single hook/component import via the public barrel, not internals.

## Backend bug found and fixed while building this

While testing review creation end-to-end, found and fixed two bugs in `backend-nest-hoidanit/src/features/review/review.service.ts`'s `assertPurchased`:
1. A stale/non-existent `productVariantId` in an order item (common with this project's seed data, which uses random fake variant IDs) crashed with an uncaught 404 instead of correctly falling through to "not purchased" — fixed by catching the lookup failure and treating it as non-matching.
2. `variant.productId` (a bigint, serialized as a string by TypeORM/mysql2) was compared with `===` against the numeric `productId` route param — always false. Fixed with `Number(variant.productId) === productId`. Verified against a real checkout → review flow (not just the buggy fake-data path) to confirm the fix, not just the crash going away.
