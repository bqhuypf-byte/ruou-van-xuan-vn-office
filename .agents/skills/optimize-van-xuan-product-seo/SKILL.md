---
name: optimize-van-xuan-product-seo
description: Làm trọn gói SEO Google cho từng sản phẩm Rượu Vạn Xuân dựa trên sản phẩm mẫu và dữ liệu thật: nghiên cứu ý định tìm kiếm, SEO title/meta, mô tả ngắn, mô tả dài hữu ích, heading, alt ảnh, SKU/biến thể, internal link, Product/ProductGroup structured data, sitemap, preview và cập nhật qua Admin/API. Use when Codex needs to audit, rewrite, standardize, preview, or publish full product SEO and product descriptions without inventing facts or hardcoding editable content.
---

# Optimize Vạn Xuân Product SEO

Use one user-approved product as the quality and brand reference, not as text to
copy. Use Google Search Central—not the sample—as the SEO authority. Keep every
editable product value in the existing Admin/API data model.

Treat "full product SEO" as a complete per-product deliverable, never as only a
short paragraph with headings. Read [references/full-product-content.md](references/full-product-content.md)
before drafting or revising any product description.

Before working, read:

- [references/project-seo-map.md](references/project-seo-map.md) for the current
  schema, rendering behavior, and implementation limits.
- [references/quality-gates.md](references/quality-gates.md) for content and
  batch validation rules.
- [references/google-search-requirements.md](references/google-search-requirements.md)
  for mandatory Google Search checks and source links. Re-check the linked
  official documentation when the task depends on current requirements.
- [references/serp-topic-research.md](references/serp-topic-research.md) before
  using ranking pages, competitors, autocomplete-style queries, or keyword data.
- [references/reference-product-pattern.md](references/reference-product-pattern.md)
  when the reference is “Rượu Nếp Vạn Xuân 1 Lít” or the supplied screenshot.

## Workflow

1. Identify the reference product by ID, slug, URL, or exact name. If the user
   has not identified it and repository/Admin data cannot establish one, ask
   for only that missing identifier.
2. Read the current reference product, its category, variants, images, and the
   remaining target products. Preserve facts and fields the user did not ask to
   change. Treat the volume already configured in the product name, SKU, or
   variant attributes as the authoritative volume for that product. When those
   sources conflict, stop that product and request confirmation instead of
   choosing one value.
3. Extract a compact reference brief: audience, search intent, primary topic,
   voice, information order, verified differentiators, CTA style, and image
   pattern. Separate reusable structure from product-specific facts.
   Treat draft instructions, editor notes, and AI conversation fragments visible
   in the sample as defects, never as reusable product copy.
4. Audit the public page against the Google requirements: crawl/index signals,
   canonical and sitemap consistency, unique title/H1/snippet inputs,
   people-first content, crawlable images, Product/ProductGroup structured data,
   mobile/page experience, and rendered data parity.
5. Research the live Vietnamese SERP for each product family before drafting.
   Review several relevant ranking pages and query variations; extract recurring
   entities, attributes, shopper questions, terminology, content gaps, and
   intent. Prefer official Google sources for requirements. Treat search volume
   claims as unverified unless a named data source supports them. Never copy,
   lightly rewrite, or import unsupported product facts from competitor prose.
6. Draft a complete, unique SEO pack per product: search intent/topic, SEO title,
   meta description, short description, long description, heading outline,
   image alt text, internal-link suggestions, and structured-data mapping. Use
   only verified facts from product data or user-supplied sources. Do not invent
   origin, ingredients, alcohol level, volume, awards, certifications, health
   effects, shipping promises, price, or stock. Carry the authoritative volume
   consistently into the title, visible copy, image alt, SKU/variant mapping,
   canonical topic, and structured data when it helps distinguish the product.
7. Keep uncertainty out of public sales copy. Put missing facts, verification
   requests, and editor instructions in the review manifest. Never pad a public
   description with phrases such as "thông tin hiện có", "được mô tả", or
   "vui lòng kiểm tra với SKU" merely to compensate for missing data. Block the
   affected section or product until the owner supplies the fact.
8. Map drafts only to supported fields. Flag unsupported SEO needs as a separate
   code/schema proposal; do not hide them inside product copy.
9. Export the current product data to JSON when possible and run:

   `node .agents/skills/optimize-van-xuan-product-seo/scripts/audit-products.mjs <products.json> --sample <id-or-slug>`

   Pass `-` instead of a file path to read a JSON export from standard input.

10. Present a batch preview before any write. Include product identifier,
   current value, proposed value, target keyword/topic, evidence or inference,
   warnings, and fields intentionally unchanged.
11. Require explicit approval immediately before live create/update/delete,
   activation, image upload, or reorder operations. Apply the smallest partial
   updates through the signed-in Admin UI or authenticated API; never request a
   password or token in chat.
12. Re-read saved data and verify the public product URL, title, meta
    description, canonical URL, image, Vietnamese text, mobile presentation,
    and internal links. Validate eligible markup with Google's Rich Results Test
    and inspect indexing/enhancement reports in Search Console when access is
    available. Re-run the audit on the saved export.

## Output contract

Produce these artifacts in order:

1. Reference brief and factual constraints.
2. Catalog audit with blockers and unsupported SEO capabilities.
3. Per-product full SEO pack in a reviewable table or JSON manifest, including
   the complete visible description rather than a summary of it.
4. Approval checkpoint.
5. After approval, a completion report listing updated products, verified URLs,
   audit results, and anything not changed.

Never call content “chuẩn SEO 100%”, promise rich results, or guarantee ranking.
Call the outcome “aligned with current Google guidance” only after completing
the applicable checks. Report observable results, assumptions, Google policy
limitations, and remaining technical gaps.
