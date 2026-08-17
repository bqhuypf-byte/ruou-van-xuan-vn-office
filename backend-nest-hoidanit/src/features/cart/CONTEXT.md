# Feature: Cart

CRUD for `carts` and `cart_items` (per `01-share-docs/DATABASE.md`):
- `carts`: `id`, `user_id` (FK, nullable — guest cart), `session_id` (nullable), `created_at`
- `cart_items`: `id`, `cart_id` (FK), `product_variant_id` (FK), `quantity`

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/cart` | Get current cart | No* |
| POST | `/cart/items` | Add item (merges quantity if variant already in cart) | No* |
| PATCH | `/cart/items/:id` | Update item quantity | No* |
| DELETE | `/cart/items/:id` | Remove item | No* |
| DELETE | `/cart` | Clear cart items | No* |
| POST | `/cart/merge` | Merge guest cart into logged-in user's cart | Yes |

*Guest: `cartSessionId` httpOnly cookie; logged-in: JWT (optional on these routes).

## Notes

- Added `shared/guards/optional-jwt-auth.guard.ts` — first optional-auth guard in this codebase. It extends `JwtAuthGuard`'s underlying `AuthGuard('jwt')` but overrides `handleRequest` to return `null` instead of throwing when no/invalid token is present, so cart routes work for both guests and logged-in users without duplicating logic.
- `CartController.resolveIdentity()` picks `userId` from `req.user` (set by `OptionalJwtAuthGuard`) when present; otherwise reads/creates the `cartSessionId` cookie. This mirrors `AuthController`'s refresh-token cookie pattern (httpOnly, `sameSite: lax`, `secure` in production).
- `POST /cart/merge` is the only route requiring real auth (`JwtAuthGuard`) per API_SPEC.md. It reads the guest `cartSessionId` cookie (not `OptionalJwtAuthGuard`-driven, since the user is now known), merges guest cart items into the user's cart (summing quantities on `product_variant_id` collisions), deletes the guest cart, and clears the cookie.
- `product_variant_id` is a plain FK column with no TypeORM relation — the `product` feature's `ProductVariant` entity doesn't exist yet (only `categories` is built so far, see [[product feature]]). Same pattern as `Address.userId`.
- `GET /cart` / `DELETE /cart` / item update/remove never auto-create a cart row for a guest/user with no cart yet — they return an empty view (`{ id: null, items: [] }`) or 404 on missing items. Only `POST /cart/items` (and merge) create a cart on demand.
