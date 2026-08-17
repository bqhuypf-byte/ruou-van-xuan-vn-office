# Feature: Order

CRUD + checkout for `orders` and `order_items` (per `01-share-docs/DATABASE.md`):
- `orders`: `id`, `user_id` (FK), `status` (enum, string), `payment_method`, `payment_status` (enum, string), `shipping_fee`, `total_amount`, `shipping_address` (JSON snapshot, not FK), `created_at`
- `order_items`: `id`, `order_id` (FK), `product_variant_id` (FK), `product_name`/`sku`/`price`/`thumbnail_url` (snapshots), `quantity`

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/orders` | List current user's orders | Yes |
| GET | `/orders/:id` | Order detail | Yes |
| POST | `/orders/checkout` | Create order | Yes |
| PATCH | `/orders/:id/cancel` | Cancel order | Yes |
| GET | `/admin/orders` | List all orders (optional `?status=a,b`) | Admin |
| PATCH | `/admin/orders/:id/status` | Update status | Admin |
| PATCH | `/admin/orders/:id/payment` | Update payment status | Admin |

## Important deviation from API_SPEC.md — checkout request shape

`POST /orders/checkout` in API_SPEC.md takes only `{ addressId, paymentMethod, note }` and implies the server derives line items (with stock validation and price snapshot) from the user's cart + `product_variants`. **`ProductVariant` doesn't exist yet** (only `categories` is built in the `product` feature — see [[product feature]]), so there is nothing to look up stock/price/name from.

Decision (confirmed with the project owner): `CheckoutDto` instead requires the client to pass a full `items: CheckoutItemDto[]` array — `productVariantId`, `productName`, `sku`, `price`, `quantity`, `thumbnailUrl?` — supplied directly by the client. This lets checkout work standalone today. **Swap this for a real `product_variants` lookup (with stock validation + `NOT` trusting client-supplied price) once that entity exists** — accepting price from the client is not safe for a real checkout flow.

Consequences of this gap:
- **No stock validation or deduction** happens (`PROD_003` from API_SPEC.md's error table is not raised anywhere in this feature).
- `note` from the API_SPEC.md request example is not accepted/stored — `orders` has no `note` column in DATABASE.md.
- The cart is still cleared after a successful checkout (`CartService.clearCart`, via `CartModule` import) as a courtesy, even though checkout doesn't read line items from the cart. This happens **after** the DB transaction commits, so it is not atomic with order creation — a crash between commit and cart-clear leaves stale cart items, acceptable for now since re-adding is harmless.

## Notes

- `CheckoutService.execute` uses a `DataSource` `QueryRunner` transaction (per `BE-PROJECT-RULES.md`'s example) to insert the `Order` row and all `OrderItem` rows atomically.
- `shippingAddress` is snapshotted from [[user-profile feature]]'s `Address` (validated via `UserProfileService.findOne(addressId, userId)`, so a non-owned address 404s) at checkout time — never a live FK, per DATABASE.md.
- `product_variant_id` on `OrderItem` is a plain FK column with no relation, same pattern as `CartItem.productVariantId`.
- `cancel()` rejects with `BadRequestException` (API_SPEC.md's `ORD_002`) when status is `shipping`, `delivered`, or already `cancelled`.
- Admin endpoints are the second feature (after `product`'s categories) to use `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('admin')`.
