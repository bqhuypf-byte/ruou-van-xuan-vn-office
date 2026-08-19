# Feature: Review

CRUD for the `reviews` table (per `01-share-docs/DATABASE.md`): `id`, `user_id` (FK), `product_id` (FK), `order_id` (FK), `rating` (1-5), `comment` (nullable), `created_at`. No relation decorators to `User`/`Product`/`Order` — plain FK columns, same pattern as every other cross-feature reference in this codebase.

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/products/:id/reviews` | List reviews for a product (with reviewer name) | No |
| POST | `/products/:id/reviews` | Create a review | Yes |
| PATCH | `/reviews/:id` | Update own review | Yes |
| DELETE | `/reviews/:id` | Delete own review | Yes |
| DELETE | `/admin/reviews/:id` | Admin delete any review | Admin |

Note: `/products/:id/reviews` uses the numeric product **id**, unlike the rest of the `product` feature's public routes which are slug-keyed — this matches API_SPEC.md exactly.

## Purchase verification (`REV_002`)

`ReviewService.assertPurchased` enforces "must purchase this product before reviewing it": it loads the caller's order via `OrderService.findOneForUser(orderId, userId)` (which itself 404s on a missing/not-owned order — API_SPEC.md's `ORD_001`), then for each `order_item` resolves its variant via `ProductVariantService.findById(item.productVariantId)` and checks `Number(variant.productId) === productId`. `order_items` only snapshots `productVariantId`/`productName`/`sku` (no `productId`), so this per-item variant lookup is the only way to confirm the order actually contained the product being reviewed. No match → `ForbiddenException` (`REV_002`).

Two bugs found and fixed while verifying this end-to-end against a real checkout → review flow (not just against seed data, which has fake/non-existent variant IDs on order items):
1. A variant lookup that 404s (stale/non-existent `productVariantId`) must be caught and treated as "doesn't match," not allowed to bubble up as an uncaught 404 for the whole request.
2. `variant.productId` is a bigint, serialized as a **string** by TypeORM/mysql2 — comparing it with `===` against the numeric `productId` route param was always `false`. Needs `Number(variant.productId) === productId`. Worth checking for this same bigint-string vs. number footgun anywhere else in the codebase that compares an FK column value against a `ParseIntPipe`'d route param.

`REV_001` ("already reviewed") is a straightforward one-row lookup (`ReviewRepository.findByUserAndProduct`) — one review per user per product, enforced in the service rather than a DB unique constraint (DATABASE.md doesn't declare one).

## Cross-module dependencies

`ReviewModule` imports `OrderModule`, `ProductModule`, and `UsersModule` — the heaviest cross-feature dependency footprint in this codebase, but each import is used through its module's public `exports` only (`OrderService`, `ProductVariantService`, `UsersService`), never internals. `UsersService.findOne` is used to attach `{ id, fullName }` to each review response per API_SPEC.md's response shape — done per-review (no batch/join), acceptable at this dataset's expected scale.
