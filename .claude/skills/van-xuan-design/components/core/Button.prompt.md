Primary button control for CTAs, form submits, and toolbar actions — 5 visual variants and 3 sizes.

```jsx
<Button variant="primary" size="md" onClick={handleAdd}>Thêm Vào Giỏ Hàng</Button>
```

Variants: `primary` (indigo-600, main CTA), `secondary` (slate-100 fill), `danger` (rose-600, destructive), `outline` (bordered, secondary actions in toolbars), `ghost` (text-only, table row actions).
Sizes: `sm` (filter chips, table actions), `md` (default), `lg` (hero CTAs, pill checkout buttons — pair with `style={{borderRadius:'var(--radius-full)'}}` for the pill CTA look used on banners/promo bands).
Props: `isLoading` swaps content for a spinner and disables the button; `leftIcon`/`rightIcon` accept any ReactNode (wire real icons from Lucide via CDN — see ICONOGRAPHY in the root readme).
