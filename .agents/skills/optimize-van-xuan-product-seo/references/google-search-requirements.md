# Google Search requirements

Use this checklist as the SEO authority. The sample product controls brand and
presentation only. Re-open official sources for current requirements before a
production audit because Google documentation and policies can change.

## 1. Discovery, crawl, and indexing

- Confirm the public product URL returns a successful response, is accessible to
  Googlebot, is not blocked by `robots.txt`, and has no unintended `noindex`.
- Ensure navigation/internal links use crawlable `<a href>` links.
- Use one stable canonical product URL. Keep `rel="canonical"`, internal links,
  redirects, and XML sitemap consistent; remember canonical is a signal, not a
  guarantee of Google's selection.
- Include only preferred, indexable canonical product URLs in the XML sitemap.
- Check the rendered page, not only React source or API data.

Official sources:

- [Crawling and indexing overview](https://developers.google.com/search/docs/crawling-indexing)
- [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Specify canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

## 2. Title, headings, and snippets

- Give every product a descriptive, concise, unique `<title>` with concise brand
  attribution. Avoid keyword repetition and boilerplate that overwhelms the
  product-specific text.
- Keep the visible primary heading distinct and consistent with the product
  identity. Google may use the title element, main visible title, headings, and
  other signals to generate a title link.
- Write a unique, accurate meta description useful to a shopper. Google may
  generate another snippet depending on the query.
- Do not claim a Google-defined character limit for titles or descriptions. The
  storefront currently truncates its meta-description input at 160 characters;
  that is a project behavior, not a Google ranking rule.

Official sources:

- [Influence title links](https://developers.google.com/search/docs/appearance/title-link)
- [Supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags)

## 3. People-first product content

- Make each description genuinely useful to the site's audience and specific to
  the real product. Add original first-party knowledge only when supported by
  product records or the owner.
- Answer the purchase questions the available evidence supports: identity,
  composition, method, sensory profile, variant differences, serving/storage,
  and responsible use.
- Do not mass-produce near-identical pages, synonym-spin the sample, copy other
  sites, stuff keywords, or generate pages primarily to manipulate rankings.
- Remove prompts, editor notes, placeholders, and AI self-reference from public
  content. Human-review every batch before publication.

Official sources:

- [Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google web spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

## 4. Product and variant structured data

- For a purchasable detail page, evaluate `Product` merchant-listing markup.
  Ensure all marked-up values are visible/current and match price, sale price,
  currency, availability, URL, image, ratings, and reviews on the page.
- For several variants on one canonical page, evaluate `ProductGroup` plus
  nested `Product` variants, `variesBy`, `hasVariant`, and a stable
  `productGroupID`. Give each variant a unique identifier such as SKU.
- Prefer markup in initial HTML where feasible; if JavaScript generates it,
  verify the rendered HTML and keep rapidly changing offer data reliable.
- Validate with Rich Results Test and monitor Product snippets/Merchant listings
  reports in Search Console. Valid markup makes a page eligible; it does not
  guarantee a rich result.

Official sources:

- [Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Merchant listing structured data](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)
- [Product variant structured data](https://developers.google.com/search/docs/appearance/structured-data/product-variants)
- [Share product data with Google](https://developers.google.com/search/docs/specialty/ecommerce/share-your-product-data-with-google)

## 5. Product images

- Use crawlable HTML image elements with a real `src` fallback, relevant nearby
  text, descriptive filenames, and useful contextual alt text. Do not stuff alt
  text with keywords.
- Use sharp, representative images while controlling page weight and supplying
  responsive variants. Avoid a generic logo or text-heavy image as the preferred
  product preview when a clean product image exists.
- Verify the primary image in visible HTML, social metadata, and structured data
  identifies the same selected product/variant. Consider an image sitemap when
  discovery otherwise remains incomplete.

Official source: [Google Images SEO best practices](https://developers.google.com/search/docs/appearance/google-images)

## 6. Alcohol policy boundary for Vietnam

Organic Google Search SEO and Merchant Center eligibility are not the same.
Google's current Merchant Center policy lists Vietnam among countries where
alcoholic beverage free listings are not allowed, and its Shopping ads policy
also disallows promotion of alcoholic beverages there. Do not promise Shopping
ads, the Shopping tab, or Merchant Center free-listing eligibility for these
products in Vietnam. Re-check policy before every Merchant Center task.

Regardless of surface, do not target minors, claim health/therapeutic benefits,
associate alcohol with improved status or performance, glorify excessive
drinking, or depict consumption with driving/machinery.

Official sources:

- [Alcoholic beverages—free listings](https://support.google.com/merchants/answer/12077694?hl=vi)
- [Alcoholic beverages—Shopping ads](https://support.google.com/merchants/answer/6150139?hl=en)

## Completion levels

Report results separately; never collapse them into one vague “SEO score”:

1. Content/on-page checks.
2. Crawl/index/canonical/sitemap checks.
3. Structured-data and rendered-data checks.
4. Image and page-experience checks.
5. Search Console/indexing evidence when access exists.
6. Merchant Center policy eligibility, which is currently negative for alcohol
   targeted to Vietnam and does not prevent ordinary organic web search.
