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

## 3. Category Page — `[~]`

Existing (`CategoryPage.tsx`): breadcrumb, subcategory chips, product grid, pagination — functional
but plain. Revise to match reference's two-column layout: filter sidebar on the left (see #4),
product grid + sort dropdown on the right, results count.

## 4. Filters — `[ ]`

Reusable filter panel (categories tree, price range slider, color swatches if applicable to variants,
size buttons) used two ways per the reference: persistent sidebar on desktop Category Page, slide-over
drawer on mobile ("Filters" mobile frame). Wires into existing `QueryProductDto` params
(`categoryId`, `minPrice`, `maxPrice`) — price filtering exists on the backend already but has no
UI yet.

## 5. Cart Page — `[~]`

Existing `CartPage.tsx` (cart feature) needs review against reference: line items with thumbnail/
name/variant/price/quantity stepper/remove, order summary panel (subtotal, shipping, total), promo
code input, checkout CTA, same newsletter band + footer as Homepage.

---

## Explicitly out of scope for this plan
- Desktop vs. mobile are **responsive breakpoints of the same page**, not separate builds — the
  reference's paired frames become one Tailwind-responsive component per screen.
- No new backend work is anticipated except where noted (nothing currently blocks screens 1–3;
  screen 4's price-range UI uses an existing endpoint param).
