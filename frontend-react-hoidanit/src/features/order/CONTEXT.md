# Feature: Order (Client)

Client-facing order history/detail/cancel only — no admin UI here (that would live in a separate admin order feature if built later, mirroring `product`'s admin/public split).

## Pages

- `OrdersPage` (`/orders`, protected): list of the current user's orders (`GET /orders`, which already returns each order with its `items` embedded — no separate fetch needed for the list).
- `OrderDetailPage` (`/orders/:id`, protected): full order — shipping address snapshot, line items, totals, and a "Hủy Đơn Hàng" button shown only when `status` is `pending` or `confirmed` (mirrors the backend's `NON_CANCELLABLE_STATUSES` check in `OrderService.cancel`, so the button doesn't appear only to fail).

## Notes

- `Order.items[].productName/sku/price/thumbnailUrl` are backend-side **snapshots** taken at checkout time (per DATABASE.md's `order_items` table) — unlike cart items, these never need frontend-side enrichment; the data is already complete and historically accurate even if the product/variant is later changed or deleted.
- No checkout/order-creation UI in this feature — see [[cart feature]]'s CONTEXT.md for why (`POST /orders/checkout` needs an address, and address management isn't built yet). Orders currently viewable here come from the seed data (`npm run seed -- orders` on the backend).
