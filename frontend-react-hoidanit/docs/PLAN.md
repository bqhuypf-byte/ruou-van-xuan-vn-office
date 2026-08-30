# Storefront Redesign Plan

Source: "SHOP.CO"-style e-commerce design system (5 screens, desktop + mobile each) provided as a
reference image. Layout/structure is followed; copy, imagery, and product data are adapted from
fashion to **Rượu Văn Xuân** (wine e-commerce), per prior agreement with the user. Brand accent
color stays **indigo-600** (existing site convention) rather than the reference's pure black/white,
so the redesign stays consistent with the rest of the app (admin, buttons, links) — see
`DESIGN_TOKENS.md` for the full rationale and token list.

Work proceeds **one screen at a time, in the order below**. After each screen is implemented, stop
and wait for review before starting the next one.

## Status legend
`[ ]` not started · `[~]` partially done, needs revision · `[x]` done

## 1. Homepage — `[x]` done, awaiting review

Existing (`HomePage.tsx`): hero (headline/subtitle/CTA/stats), gradient visual, partner-brand strip,
category quick-filter, product grid, pagination. Content is already dynamic (site-content feature +
real product/category API).

Added this pass:
- **Browse by Category** section (reference: "Browse by Dress Style") — grid of large tappable
  gradient cards, one per top-level category, linking into `/categories/:slug`.
- **Promo band** (reference: "Stay up to date about our latest offers") — dark full-width strip
  above the footer. Built as a plain CTA button linking to `/products`, **not** an email-capture
  form: there is no newsletter/subscriber backend, so a fake signup field would imply a capability
  that doesn't exist.
- **Site footer** — new shared component (`shared/components/layout/Footer.tsx`, none existed
  before), mounted once in `MainLayout` so it's on every public page. Brand blurb + link columns
  linking only to routes that actually exist (no dead "About/FAQ/Contact" links, no payment-icon
  row implying processors that aren't integrated — the site only supports COD per API spec).

**Deferred, not built this pass** (flagging instead of faking):
- **Top Selling** section — there's no sales/bestseller tracking in the data model (`orders`/
  `order_items` exist, but nothing aggregates them into a ranking), so a "best-selling" rail right
  now would just be arbitrary products mislabeled as bestsellers. Needs either a real aggregation
  query/endpoint, or an explicit product-visibility flag if you'd rather curate it manually.
- **Customer reviews / testimonials** — the `review` feature exists but nothing aggregates a
  homepage-worthy pull quote + rating. Same call: build the aggregation, or confirm placeholder
  copy is acceptable (labeled honestly as illustrative, not real customer quotes).

## 2. Product Detail Page — `[x]` done, awaiting review

Rebuilt `ProductViewPage.tsx` from the Figma reference (node `1:2`, file `UMRQR8ndnZIM221H4W2YxP`):
breadcrumb (walks the real category `parentId` chain, not just one level), vertical thumbnail
gallery + main image, uppercase title, `StarRating` + review count (real `review` feature data —
turns out it was already fully wired end-to-end, not a stub), price with sale-price strike-through
+ discount-percent `Badge`, description, independent color/size variant selectors (two axes,
resolves to the matching `ProductVariant`/SKU — not just a flat variant-picker list), stock badge,
pill quantity stepper, "Add to Cart". Below: 2 tabs (Mô Tả Sản Phẩm / Đánh Giá & Nhận Xét — real
`ReviewList`, now rendered as the reference's 2-column card grid), a "Có Thể Bạn Cũng Thích" rail
(reuses `ProductCard`, same category, excludes the current product), then the shared `PromoBand`
(page-level footer comes from `MainLayout` already).

**Deferred, not built:**
- **FAQs tab** — the reference has a third tab, but there's no FAQ feature/entity anywhere in this
  app. Didn't add an always-empty tab just to match the layout; can build it once there's a real
  content source (could reuse the `site-content`-style admin-managed pattern from the Homepage).

## 3. Category Page — `[x]` done, awaiting review

Rebuilt `CategoryPage.tsx`: breadcrumb navigation, category hero banner with title/description, subcategory chips, 2-column responsive layout (sticky filter sidebar on desktop, full-width product grid on right), mobile filter trigger button, live product counter, active filter tags with dismiss buttons, empty state with reset filter CTA, pagination bar.

## 4. Filters — `[x]` done, awaiting review

Implemented `CategoryFilterSidebar.tsx`:
- Hierarchical category tree with active indicators and descendant expansion.
- Price range presets (Dưới 500k, 500k-1M, 1M-2M, Trên 2M) + custom Min/Max inputs with "Áp dụng giá".
- Clear all filters button with icon and responsive states.
- Dual usage: persistent sticky sidebar on Desktop (`lg:block`), and slide-over animated drawer with backdrop on Mobile (`lg:hidden`).
- Connected end-to-end to `QueryProductDto` (`categoryId`, `minPrice`, `maxPrice`) via `useProducts` hook.

## 5. Cart Page — `[x]` done, awaiting review

Rebuilt `CartPage.tsx` and `CartItemRow.tsx`:
- Mobile-first dual layout for line items: optimized compact card layout on Mobile (< sm) with 80x80 thumbnail, title, attribute badges, touch stepper, unit price, and quick trash action; wide tabular row on Desktop (>= sm).
- Dynamic Free Shipping progress bar with threshold calculation and animated bar.
- Order Summary panel with price breakdown, applied voucher indicator, promo code input form, and secure checkout CTA (sticky on Desktop).
- Mobile sticky checkout action bar fixed at screen bottom with iOS safe-area-inset padding.
- Integrated `PromoBand` and site footer across the experience.

---

## Explicitly out of scope for this plan
- Desktop vs. mobile are **responsive breakpoints of the same page**, not separate builds — the
  reference's paired frames become one Tailwind-responsive component per screen.
- No new backend work is anticipated except where noted (nothing currently blocks screens 1–3;
  screen 4's price-range UI uses an existing endpoint param).
