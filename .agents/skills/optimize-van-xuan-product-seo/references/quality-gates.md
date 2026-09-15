# Product SEO quality gates

## Reference fidelity

- Match the sample's useful structure, information depth, brand voice, and CTA
  style.
- Do not repeat the sample's sentences, keyword string, claims, or product facts
  across other products.
- Keep one clear search intent per product and prevent two near-identical
  products from targeting indistinguishable copy without an explicit variant
  strategy.

## Required factual checks

- Product name and category agree with the actual item.
- Slug is unique, readable, stable, lowercase ASCII, and hyphen-separated.
- Short description is unique, useful on its own, and no longer than 160
  characters because the storefront truncates meta descriptions at 160.
- Long description is unique and easy to scan. Include only sections that the
  available facts can support.
- Long description satisfies the shopper's real decision questions supported by
  evidence. It is not considered complete merely because it contains an H2 and
  a bullet list; reject thin, repetitive, templated, or placeholder-like copy.
- Missing facts and editor notes stay in the internal manifest. Do not expose
  uncertainty as public copy such as "được mô tả", "thông tin hiện có", or
  "vui lòng kiểm tra" unless that instruction is genuinely useful after the
  product record itself has been completed.
- Volume, alcohol level, ingredients, origin, method, usage, storage, price,
  stock, SKU, and claims agree with source data.
- Every variant has a unique SKU and its attribute values match the product's
  declared attribute groups.
- Thumbnail/gallery images belong to the correct product, load successfully,
  and are ordered intentionally.

## Language and safety

- Write natural Vietnamese for humans first; avoid keyword stuffing and
  repeated boilerplate.
- Reject editor notes, prompt fragments, AI self-reference, placeholders, and
  phrases that talk to the site owner instead of the customer.
- Do not present alcoholic drinks as preventing, treating, or curing disease.
- Do not invent certifications, awards, legal compliance, scarcity, customer
  reviews, discounts, or delivery promises.
- Avoid encouraging excessive drinking or targeting minors. Add responsible-use
  wording when appropriate to the page context.

## Batch controls

- Detect duplicate names, slugs, short descriptions, and normalized long
  descriptions before publishing.
- Never batch-replace a field that was not in the approved preview.
- Keep a before/after manifest keyed by immutable product ID.
- Stop an individual update on missing facts; do not block safe drafts for other
  products.
- After publishing, verify both saved Admin data and the public output.
- For each included product, verify the full pack: SEO title, meta description,
  short description, long description, image alt, canonical, indexability,
  structured data, variant/offer parity, and at least one relevant crawlable
  internal link when the site taxonomy supports it.

## Reporting

Label each item `pass`, `warning`, or `blocker`. A warning is a recommendation;
a blocker indicates invalid, conflicting, unsupported, or unverified data that
could make the public page misleading.

Do not award a single SEO score. Report content, indexing, canonical/sitemap,
structured data, images/page experience, and Search Console evidence as
separate gates. Passing the local JSON audit is not proof that Google can crawl,
index, or show a rich result for the rendered page.
