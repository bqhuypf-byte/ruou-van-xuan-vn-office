# Design Tokens — Storefront Redesign

Extracted from the reference "SHOP.CO"-style design system image, then reconciled against tokens
already established in this codebase (`HomePage.tsx`, `Button.tsx`, `Badge.tsx`, `AdminLayout.tsx`).
Where the two conflict, **the existing project convention wins** — the goal is a redesign that looks
like the reference, not a competing design system living next to the current one.

## Color

| Token | Value | Reference used it for | This project uses it for |
|---|---|---|---|
| `brand` (primary accent) | `indigo-600` `#4F46E5` | Black (`#000000`) CTAs, active states | Kept as-is — already the site's brand color everywhere (buttons, links, admin sidebar active state, header logo tile). **Not** switched to black. |
| `ink` (headings/body text) | `slate-900` `#0F172A` (dark: `white`) | Near-black `#000000` | Matches existing usage (`text-slate-900 dark:text-white`) |
| `muted` (secondary text) | `slate-500` `#64748B` | Gray `#00000099` | Matches existing usage |
| `surface` | `white` (dark: `slate-950`/`slate-900`) | White | Matches existing usage |
| `surface-alt` (section bg) | `slate-50` `#F8FAFC` (dark: `slate-900`) | Light gray `#F2F0F1` | Used for hero section already |
| `surface-inverse` (dark strips: brand bar, newsletter band, footer) | `slate-900` `#0F172A` | Black `#000000` | New — introduced for partner-brand strip; reuse for newsletter band & footer |
| `border` | `slate-200` `#E2E8F0` (dark: `slate-800`) | Light gray hairline | Matches existing usage |
| `danger` (discount badge, remove actions) | `rose-600` `#E11D48` | Red `#FF3333` | Matches existing `Badge` `danger` variant — reuse, don't invent a new red |
| `rating` (star icons) | `amber-400` `#FBBF24` | Gold/yellow | New — not used yet; needed for Product Detail & reviews |

## Typography

- **Font family**: none loaded yet — Tailwind's default `font-sans` (system UI stack). The
  reference's display face ("Integral CF"-style bold geometric sans) is **not** being added as a
  webfont for this pass, to avoid new font-loading weight/FOUC concerns; bold system-sans + uppercase
  + tight tracking gets visually close enough (already applied on Homepage's `h1`/`h2`). Revisit only
  if the user explicitly asks for pixel-accurate type.
- **Display / section headings**: `font-extrabold uppercase tracking-tight`, `text-2xl` → `text-5xl`
  depending on level (hero `h1` largest, section `h2` mid).
- **Body**: `font-normal`, `text-sm`, `text-slate-500`.
- **Price**: `font-bold`, current price in `text-ink`, struck-through original price in `text-muted
  line-through` when on sale.

## Spacing & Layout

- **Page container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (already the sitewide convention —
  reused for every new section, not redefined).
- **Section vertical rhythm**: `py-14` to `py-16` between major homepage sections.
- **Card radius**: `rounded-2xl` (matches existing `ProductCard`, admin stat cards).
- **Pill radius** (primary CTA buttons, filter chips): `rounded-full`.
- **Grid gaps**: `gap-5` for product grids (existing), `gap-4` for filter/stat card rows.

## Components implied by the reference (net-new)

| Component | Notes |
|---|---|
| `Footer` | Not built yet anywhere in the app. Dark (`surface-inverse`), link columns, mounted once in `MainLayout`. |
| `NewsletterBand` | Full-width dark strip, email input + submit button. Reused on Homepage and Cart. |
| `RatingStars` | Small `amber-400` star row + numeric score; needed on Product Detail and testimonials. |
| `FilterPanel` | Category tree + price range + (variant-dependent) color/size — shared between Category page sidebar (desktop) and a slide-over drawer (mobile). |
| `QuantityStepper` | `-` / count / `+` control; needed on Product Detail and Cart line items. |

## Explicit non-goals

- Not switching the brand accent to black/white monochrome — would conflict with every existing
  screen (admin, auth, header) and isn't worth a full re-theme for this request.
- Not adding a webfont this pass (see Typography above).
