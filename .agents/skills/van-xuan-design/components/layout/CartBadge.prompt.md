Cart icon in the header with a small indigo count badge, hidden when the cart is empty.

```jsx
<CartBadge itemCount={3} href="/cart" />
```

`icon` defaults to an emoji glyph — swap in a real Lucide `ShoppingCart` icon (via CDN, see root readme ICONOGRAPHY) when wiring into a real header.
