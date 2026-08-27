# Văn Xuân Design System

Design system for **Rượu Vạn Xuân** (Van Xuan Wine) — a Vietnamese e-commerce brand selling traditional spirits, imported wine, and infused liquors, with online ordering and an admin CMS for products/orders/site content.

Built from the real product codebase: **[bqhuypf-byte/ruou-van-xuan-vn-office](https://github.com/bqhuypf-byte/ruou-van-xuan-vn-office)** (React 19 + Vite storefront/admin, NestJS backend, shared API/DB docs). Explore that repo further — `frontend-react-hoidanit/docs/DESIGN_TOKENS.md`, `src/shared/components/ui/`, `src/features/*` — to go deeper than what's captured here.

## What this codebase actually is

A generic "MegaMart" e-commerce scaffold (React + NestJS, feature-based architecture, TanStack Query, Zustand, Tailwind) that is mid-way through being re-skinned into the Rượu Vạn Xuân wine brand. Two audiences share the frontend: a **public storefront** (home, product catalog, product detail, cart, checkout-pending) and an **admin CMS** (`/admin/*`) for managing categories, products/variants/images, banners, brands, and site settings — text/links/logo are admin-editable, not hardcoded, so a site can be "handed off" without code changes.

Payment is **COD only** (no processor integration) and there is no newsletter/subscriber backend — the source code explicitly avoids implying either capability. Two features are documented as deliberately deferred: a "best-selling products" rail (no sales-aggregation query yet) and homepage testimonials (no aggregation of the `review` feature yet).

## Sources

- Storefront + admin frontend: `frontend-react-hoidanit/` (React 19, Vite, TypeScript, Tailwind CSS, TanStack Query, Zustand, React Router v7, lucide-react icons)
- Backend: `backend-nest-hoidanit/` (NestJS v11, MySQL)
- Shared docs: `01-share-docs/API_SPEC.md`, `01-share-docs/DATABASE.md`
- Design rationale: `frontend-react-hoidanit/docs/DESIGN_TOKENS.md`, `docs/PLAN.md` (documents a "SHOP.CO"-style redesign pass, reconciled against the site's existing indigo-brand convention)
- No Figma file was attached to this design system.

## Caveats / inconsistencies found in source

- **No logo file exists anywhere in the repo.** `src/assets/` only has unused Vite template leftovers (`hero.png`, `react.svg`, `vite.svg`) and an unused `favicon.svg`/`icons.svg`. Per design-system policy, **no logo was invented** — a plain "VX" monogram + wordmark stands in wherever a mark would go. Flag: please provide a real logo file if one exists.
- **No custom webfont.** `DESIGN_TOKENS.md` explicitly documents this as intentional ("Tailwind's default `font-sans` (system UI stack)... to avoid new font-loading weight/FOUC concerns"), not a missing asset — so no Google Font substitution was made.
- **Two brand colors coexist in the code.** Most of the app (Button, Badge, AdminLayout, ProductViewPage, CartBadge, PromoBand) uses **indigo-600** as the brand color — this is documented in `DESIGN_TOKENS.md` as the deliberate, reconciled choice. But `MainLayout.tsx` and `Footer.tsx` (the header chrome and footer) still hardcode a leftover blue (`#008ECC`) and the string "MegaMart" as fallback defaults from the original generic template — these look like un-migrated defaults, not intended brand color. **This design system uses indigo-600 as the single brand color throughout**, per the documented reconciliation; the stray blue was treated as source debt, not a second brand color.

## Structure

- `styles.css` — root stylesheet, imports everything below
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `shadows.css`
- `base.css` — minimal global reset
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/core/` — **Button, Badge, Input, Modal, Spinner** (from `shared/components/ui/`)
- `components/layout/` — **Footer, PromoBand, UserMenu, CartBadge, CategoryNavMenu** (from `shared/components/layout/` + `features/*` header/nav pieces)
- `ui_kits/storefront/` — click-through Homepage → Product Detail → Cart
- `ui_kits/admin/` — click-through admin CMS: Products CRUD, Categories, Site Settings
- `SKILL.md` — portable skill file (Claude Code compatible)

## Content fundamentals

- **Language**: all UI copy is Vietnamese (labels, buttons, error/success toasts, empty states). Product/category names may mix Vietnamese and loanwords (e.g. "Chivas Regal 12").
- **Address**: impersonal — no "bạn"/"you" pushiness in labels; copy is short, functional, imperative on buttons ("Thêm Vào Giỏ Hàng", "Xem Ưu Đãi", "Thử Lại"), declarative on state ("Giỏ hàng của bạn đang trống").
- **Casing**: buttons and headings are Title Case in Vietnamese ("Quản Lý Sản Phẩm", "Đơn Hàng Của Tôi"); section eyebrow/labels are sometimes Sentence case. Homepage H1s are `uppercase` with `tracking-tight`.
- **Tone**: plain and operational, not salesy — e.g. discount/promo copy is minimal ("Đừng bỏ lỡ các ưu đãi rượu vang mới nhất") rather than exclamation-heavy marketing language.
- **Honesty over decoration**: the source code repeatedly chooses to omit a feature rather than fake it — no fake "bestseller" labels without real ranking data, no newsletter form without a subscriber backend, no payment-icon row implying unsupported processors. Carry this principle into any extension of the system.
- **No emoji** anywhere in the UI.

## Visual foundations

- **Color**: one brand color — indigo-600 (`#4F46E5`), hover indigo-700, active indigo-800. Neutrals are the Tailwind slate scale (ink = slate-900, muted text = slate-500, borders = slate-200, card surface = white, alt section surface = slate-50, dark/inverse surfaces — footer, promo band, admin sidebar — = slate-900). Semantic: danger = rose-600, success = emerald-600, warning = amber, info = sky, star ratings = amber-400. No gradients as a brand device — the only "gradient-like" surfaces are solid-color hero/brand banner blocks with a flat dark tone (`#212844`-style), not linear gradients.
- **Type**: **Inter** (Google Fonts) is the whole-site typeface, chosen by the user for this design system — swap-out from the source's system-ui default is deliberate here, not a substitution flag; admin can switch it (or revert to system font / a Playfair-Display+Inter pairing) via Site Settings → Kiểu Chữ without touching code. Display/section headings are `font-extrabold`, `uppercase`, tight tracking, sized `text-2xl`→`text-5xl`. Body copy is `font-normal`/`text-sm`/slate-500. Price is `font-bold` with the original price struck through in muted gray when discounted. SKUs use `font-mono`.
- **Spacing**: page container `max-w-7xl` with responsive `px-4/6/8`; section rhythm `py-14`–`py-16`; card padding `p-5`/`p-6`; grid gaps mostly `gap-5`.
- **Corner radius**: buttons/inputs `rounded-lg` (10px); thumbnails/nav items `rounded-xl` (12px); cards, modals, dropdowns `rounded-2xl` (16px); pills (CTA buttons, filter chips, quantity steppers, category tags) `rounded-full`.
- **Cards**: white surface, 1px slate-200 border, `shadow-sm` resting → `shadow-lg` + a small `-translate-y-0.5` lift on hover (product cards specifically). No colored left-border accent cards anywhere in source — avoid that pattern.
- **Shadows**: soft and neutral-tinted (never colored), `shadow-xs`/`shadow-sm` for resting UI, `shadow-md`/`shadow-lg` on hover/emphasis, `shadow-xl`/`shadow-2xl` reserved for dropdowns and modals.
- **Backgrounds**: no photography, no illustration, no repeating pattern/texture. Hero/banner sections are solid flat-color blocks (admin-configurable `bgColor`) with an optional right-aligned cutout product image — never full-bleed photographic backgrounds.
- **Animation**: minimal — `transition-all`/`transition-colors` at ~150ms, no bounce/spring easing, no page-transition choreography. Loading = spin (`animate-spin` on a ring icon), skeletons = `animate-pulse` gray blocks. Modal open uses a short fade+zoom-in (~200ms).
- **Hover / press states**: hover = one shade darker background (buttons) or a subtle lift+shadow (cards) or underline (text links) — never a lightening/lightening-tint hover. No distinct "press" (`:active`) treatment beyond the browser default; no scale-down click feedback.
- **Borders**: 1px slate-200 hairlines throughout (cards, table rows, section dividers); on dark surfaces, `rgba(255,255,255,.1–.15)` hairlines.
- **Transparency / blur**: used narrowly — modal backdrop (`bg-slate-900/60` + `backdrop-blur-sm`), mobile admin sidebar overlay. Not used decoratively elsewhere.
- **Imagery vibe**: none shipped (no real product photography in the repo) — the UI kits use flat color-block placeholders. When real photography is added, keep it warm/product-lit given the wine/spirits category — no strong stylistic direction is established in source to override that default.

## Iconography

The entire codebase uses **[lucide-react](https://lucide.dev)** exclusively — no icon font, no PNG icon sprites, no emoji-as-icon. Stroke-based, ~1.5–2px stroke weight, typically 14–20px inline / 24px standalone. This design system's primitives (`Button`, `Modal`, etc.) are kept **icon-dependency-free** — they expose `leftIcon`/`rightIcon`/icon-slot props so a consumer wires in real Lucide icons — and the two chrome-level defaults that need *some* glyph (Modal's close button, UserMenu's chevron) fall back to a plain unicode glyph (`✕`, `▾`) rather than pulling in a dependency at the primitive level. UI kits load Lucide from CDN (`unpkg.com/lucide`) and use `<i data-lucide="...">` + `lucide.createIcons()`, matching the real app's icon usage 1:1. `Spinner` renders as a CSS border-ring rather than Lucide's `Loader2`, so the primitive has zero external dependencies.

## Components

- **Core** (`components/core/`): `Button`, `Badge`, `Input`, `Modal`, `Spinner`
- **Layout** (`components/layout/`): `Footer`, `PromoBand`, `UserMenu`, `CartBadge`, `CategoryNavMenu`

### Intentional additions
None of the above were invented — every component mirrors a real file in `shared/components/ui/` or `shared/components/layout/` (plus `CartBadge`/`CategoryNavMenu`, lifted from `features/cart` and `features/product` since they're reusable header chrome, not screen-specific).

## Admin-editable content
Per the user's request, the Admin CMS demo now covers font selection (Site Settings → Kiểu Chữ) and homepage copy editing (new "Nội Dung Trang Chủ" screen: hero title/subtitle/CTA, promo band text) — both wired as plain form fields, no code changes implied.

## UI Kits

- `ui_kits/storefront/index.html` — Homepage (hero, deals, categories, product grid), Product Detail (gallery, variant picker, reviews tabs, related products), Cart (line items, order summary, disabled checkout — matches the real "Sắp Ra Mắt" state)
- `ui_kits/admin/index.html` — Admin sidebar shell (matches real `AdminLayout`), Products CRUD (stat cards + table + create/edit modal + soft-delete confirmation), Categories (indented tree table), Site Settings (brand/contact/footer-links form)

## Index

- `styles.css`, `base.css`, `tokens/*.css` — foundation
- `guidelines/*.html` — specimen cards (Colors, Type, Spacing, Brand/Iconography)
- `components/core/*`, `components/layout/*` — component source + docs + demo cards
- `ui_kits/storefront/*`, `ui_kits/admin/*` — full click-through recreations
- `github.md` — source repo sync record
- `SKILL.md` — portable Claude Code skill
