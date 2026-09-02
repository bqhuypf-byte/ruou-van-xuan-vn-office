---
name: responsive-van-xuan
description: Make the Rượu Vạn Xuân React storefront and admin responsive for mobile and tablet while preserving the existing design system and configurable content.
---

# Responsive Rượu Vạn Xuân

Use this skill when implementing, reviewing, or fixing responsive behavior in `frontend-react-hoidanit`. Apply it to a targeted screen, feature, or the site only to the scope requested.

## Project constraints

- Keep **Be Vietnam Pro** and the existing `brand-*` tokens. `brand-600` (`#003D29`) remains the primary interactive color; reserve `rose-600` for discounts and warnings.
- Use Tailwind mobile-first classes. Base styles serve mobile; use `sm:` (640px), `md:` (768px), and `lg:` (1024px) only when the layout needs to change.
- Content that an administrator may change must remain sourced from the existing settings/content APIs. Do not introduce hard-coded marketing, footer, navigation, or banner copy merely to fit a breakpoint.
- Preserve existing desktop behavior unless the requested responsive change requires a deliberate desktop adjustment.

## Implementation approach

1. Inspect the affected route and its reusable components before changing classes. Check `MainLayout` for fixed chrome, and `AdminLayout` for admin screens.
2. Start with 375px mobile, then check 768px tablet and 1024px desktop. Use 320px only to catch overflow in dense controls.
3. Prefer reflow over horizontal clipping:
   - Product grids: two columns on mobile unless a component is intentionally a scrollable carousel.
   - Sidebars/filter panels: a drawer or collapsible section below `lg`; retain the desktop sidebar at `lg` and wider.
   - Forms: one column by default; add columns from `sm` upward when fields remain readable.
   - Data tables: preserve table semantics and add a deliberate horizontal scroll wrapper; convert to cards only when the page already has a suitable mobile card design.
4. Fixed mobile action bars must not overlap the global bottom navigation. On routes with a purchase/checkout action bar, hide or offset the global navigation and reserve sufficient bottom padding for the active fixed element plus `env(safe-area-inset-bottom)`.
5. Keep interactive controls touch-friendly (normally at least 44px on mobile). Ensure icon-only controls retain accessible labels.
6. Use `min-w-0`, `truncate`, `line-clamp-*`, responsive gaps, and `aspect-*` deliberately to avoid long Vietnamese product names, prices, or images causing overflow.

## Required checks

For the changed flow, verify:

- No unintended horizontal page scrolling at 320px, 375px, 768px, and 1024px.
- Header, search, drawers, modal overlays, bottom navigation, contact widget, and voucher widget do not cover one another.
- Product selection, add-to-cart, cart quantity changes, and checkout calls to action remain visible and tappable.
- Images preserve their intended aspect ratio and do not obscure readable hero/banner copy.
- Keyboard focus, drawer closing, and `aria-label` behavior still work for interactive controls.

Run `npm.cmd run build` in `frontend-react-hoidanit` after the responsive edits. When an interactive browser session is available, also inspect the affected routes at the target viewport sizes before declaring the task complete.
