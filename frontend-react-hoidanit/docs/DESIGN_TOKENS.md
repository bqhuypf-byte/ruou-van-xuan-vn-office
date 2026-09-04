# Design Tokens — Storefront Redesign

## 2026-08 pass — museshopcart.webflow.io reference (current)

Reference: https://museshopcart.webflow.io/. User explicitly asked to rebrand the primary accent
to this reference's deep forest green (confirmed via clarifying question — this **supersedes** the
"keep indigo-600" decision from the SHOP.CO pass below) and to finally wire up the Sora/Inter font
stack that was documented as convention but never actually implemented.

- **Brand color**: `brand-600` = `#003D29` (matches the reference's primary button/heading color
  exactly, sampled via computed styles against the live site). Registered as a full `brand-50`…
  `brand-950` scale in `src/index.css`'s `@theme` block (Tailwind v4 CSS-first — no
  `tailwind.config.*` exists in this project). Replaces `indigo-*` everywhere, storefront **and**
  admin, via a literal `indigo-` → `brand-` class-name swap across all 53 files that referenced it
  (same shade/opacity suffixes on both sides, so no visual regression from the rename itself).
- **Accent pastels** (`accent-beige #F2E4D9`, `accent-pink #F9DCDC`, `accent-mint #D2F7EC`,
  `accent-peach #FFE6CC`): sampled from the reference's promo/discount tiles, registered as tokens
  for future use — not yet consumed by a component.
- **Fonts**: Sora (headings) + Inter (body) — the project's own documented convention (`CLAUDE.md`),
  not the reference's paid `Eina02` display face (not reusable — no Google Fonts equivalent).
  Loaded via a Google Fonts `<link>` in `index.html`, registered as `--font-heading`/`--font-sans`
  in the same `@theme` block, applied globally to `h1`/`h2`/`h3` (heading) and `body` (sans).
  Previously **no font infrastructure existed at all** despite being documented — this pass is
  where it actually landed.
- **Radius**: hero banner and large feature tiles (homepage brand cards) bumped to `rounded-3xl`
  for the reference's softer, more pronounced rounding. Regular cards (`ProductCard`, `DealCard`,
  category thumbnails) keep `rounded-2xl` — that's still the established card convention, not
  replaced sitewide.
- **Effects**: reference uses simple `0.2s` color/shadow transitions, no scroll-animation library.
  Matched by extending the existing `ProductCard` hover pattern (`hover:shadow-lg
  hover:-translate-y-0.5 transition-all`) to `DealCard` and the homepage brand tiles, which
  previously had no hover treatment.
- **Pill CTAs / filter chips**: category filter buttons on Product List / Category pages now use
  `rounded-full` (previously `rounded-lg` default), matching `CategoryPillNav`'s already-pill shape
  and the reference's consistently pill-shaped buttons/tabs.

## SHOP.CO pass (superseded — kept for history)

Extracted from the reference "SHOP.CO"-style design system image, then reconciled against tokens
already established in this codebase (`HomePage.tsx`, `Button.tsx`, `Badge.tsx`, `AdminLayout.tsx`).
Where the two conflict, **the existing project convention wins** — the goal is a redesign that looks
like the reference, not a competing design system living next to the current one.

### Color

| Token | Value | Reference used it for | This project uses it for |
|---|---|---|---|
| `brand` (primary accent) | ~~`indigo-600` `#4F46E5`~~ → now `brand-600` `#003D29` (see pass above) | Black (`#000000`) CTAs, active states | Was kept as-is at the time; superseded by the museshopcart pass above. |
| `ink` (headings/body text) | `slate-900` `#0F172A` (dark: `white`) | Near-black `#000000` | Matches existing usage (`text-slate-900 dark:text-white`) |
| `muted` (secondary text) | `slate-500` `#64748B` | Gray `#00000099` | Matches existing usage |
| `surface` | `white` (dark: `slate-950`/`slate-900`) | White | Matches existing usage |
| `surface-alt` (section bg) | `slate-50` `#F8FAFC` (dark: `slate-900`) | Light gray `#F2F0F1` | Used for hero section already |
| `surface-inverse` (dark strips: brand bar, newsletter band, footer) | `slate-900` `#0F172A` | Black `#000000` | New — introduced for partner-brand strip; reuse for newsletter band & footer |
| `border` | `slate-200` `#E2E8F0` (dark: `slate-800`) | Light gray hairline | Matches existing usage |
| `danger` (discount badge, remove actions) | `rose-600` `#E11D48` | Red `#FF3333` | Matches existing `Badge` `danger` variant — reuse, don't invent a new red |
| `rating` (star icons) | `amber-400` `#FBBF24` | Gold/yellow | New — not used yet; needed for Product Detail & reviews |

### Typography

- **Font family**: ~~none loaded yet~~ — see the museshopcart pass above; Sora/Inter are now
  actually wired up. (Historical note: at the time of this pass, the reference's display face
  ("Integral CF"-style bold geometric sans) was deliberately not added as a webfont.)
- **Display / section headings**: `font-extrabold uppercase tracking-tight`, `text-2xl` → `text-5xl`
  depending on level (hero `h1` largest, section `h2` mid).
- **Body**: `font-normal`, `text-sm`, `text-slate-500`.
- **Price**: `font-bold`, current price in `text-ink`, struck-through original price in `text-muted
  line-through` when on sale.

### Spacing & Layout

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

### Explicit non-goals (at the time of this pass — some later reversed, see museshopcart pass above)

- Not switching the brand accent to black/white monochrome — would conflict with every existing
  screen (admin, auth, header) and isn't worth a full re-theme for this request.
- Not adding a webfont this pass (see Typography above) — **later added** in the museshopcart pass.
