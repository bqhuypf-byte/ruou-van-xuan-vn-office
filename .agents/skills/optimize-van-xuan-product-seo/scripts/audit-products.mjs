#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const usage = () => {
  console.error(
    'Usage: node audit-products.mjs <products.json> [--sample <id-or-slug>] [--json]',
  );
};

const args = process.argv.slice(2);
const inputPath = args.find((value) => !value.startsWith('--'));
const sampleIndex = args.indexOf('--sample');
const sampleSelector = sampleIndex >= 0 ? args[sampleIndex + 1] : null;
const jsonOutput = args.includes('--json');

if (!inputPath || (sampleIndex >= 0 && !sampleSelector)) {
  usage();
  process.exit(2);
}

const normalize = (value) =>
  String(value ?? '')
    .normalize('NFC')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('vi');

const asciiSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const localUrlPattern = /(?:https?:\/\/)?(?:localhost|127\.0\.0\.1)(?::\d+)?/i;
const issues = [];
const allSkus = new Map();
const add = (severity, product, field, message) => {
  issues.push({
    severity,
    productId: product?.id ?? null,
    product: product?.name ?? '(unknown)',
    field,
    message,
  });
};

const inputText =
  inputPath === '-'
    ? await new Promise((resolve, reject) => {
        let value = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => {
          value += chunk;
        });
        process.stdin.on('end', () => resolve(value));
        process.stdin.on('error', reject);
      })
    : await readFile(inputPath, 'utf8');
const raw = JSON.parse(inputText);
const products = Array.isArray(raw)
  ? raw
  : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.data?.items)
      ? raw.data.items
      : null;

if (!products) {
  throw new Error('Expected an array or an API envelope containing data/data.items.');
}

const duplicates = (field) => {
  const groups = new Map();
  for (const product of products) {
    const value = normalize(product[field]);
    if (!value) continue;
    groups.set(value, [...(groups.get(value) ?? []), product]);
  }
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    for (const product of group) {
      add('blocker', product, field, `Duplicate across ${group.length} products.`);
    }
  }
};

for (const product of products) {
  if (!normalize(product.name)) add('blocker', product, 'name', 'Missing product name.');
  if (!normalize(product.slug)) {
    add('blocker', product, 'slug', 'Missing slug.');
  } else if (!asciiSlugPattern.test(product.slug)) {
    add('warning', product, 'slug', 'Slug should be lowercase ASCII and hyphen-separated.');
  }

  const shortDescription = String(product.shortDescription ?? product.short_description ?? '').trim();
  if (!shortDescription) {
    add('warning', product, 'shortDescription', 'Missing; meta description will use a fallback.');
  } else if (shortDescription.length > 160) {
    add('warning', product, 'shortDescription', `Length is ${shortDescription.length}; storefront truncates after 160 characters.`);
  }

  if (!normalize(product.description)) {
    add('warning', product, 'description', 'Missing long description.');
  } else if (/chào bạn|dựa trên những thông tin|hãy điều chỉnh|thay đổi thành phần|ai (?:đã|sẽ)|chatgpt/i.test(normalize(product.description))) {
    add('blocker', product, 'description', 'Possible editor note, prompt fragment, or AI meta-commentary in public copy.');
  }
  if (/an toàn cho sức khỏe|chữa bệnh|điều trị|tốt cho sức khỏe/i.test(normalize(product.description))) {
    add('blocker', product, 'description', 'Alcohol copy contains a health or therapeutic claim.');
  }
  if (/dQw4w9WgXcQ/i.test(String(product.description ?? ''))) {
    add('blocker', product, 'description', 'Known placeholder/non-product YouTube video detected.');
  }
  if (localUrlPattern.test(String(product.description ?? ''))) {
    add('blocker', product, 'description', 'Embedded media contains a localhost URL.');
  }
  if (!product.thumbnailUrl && !product.thumbnail_url) {
    add('warning', product, 'thumbnailUrl', 'Missing thumbnail/social image.');
  } else if (localUrlPattern.test(String(product.thumbnailUrl ?? product.thumbnail_url))) {
    add('blocker', product, 'thumbnailUrl', 'Thumbnail contains a localhost URL.');
  }

  const images = Array.isArray(product.images) ? product.images : [];
  if (!images.length) add('warning', product, 'images', 'No gallery images included in this export.');
  for (const image of images) {
    if (localUrlPattern.test(String(image.imageUrl ?? image.image_url ?? ''))) {
      add('blocker', product, 'images.imageUrl', 'Gallery image contains a localhost URL.');
    }
  }

  const variants = Array.isArray(product.variants) ? product.variants : [];
  if (!variants.length) add('warning', product, 'variants', 'No variants included in this export.');
  const configuredGroups = Array.isArray(product.variantAttributes ?? product.variant_attributes)
    ? product.variantAttributes ?? product.variant_attributes
    : [];
  if (variants.length > 1 && configuredGroups.length === 0) {
    add('blocker', product, 'variantAttributes', 'Multiple variants have no configured attributes to distinguish them.');
  }
  for (const group of configuredGroups) {
    if (/đôhj|đọ/i.test(`${group?.name ?? ''} ${(group?.values ?? []).join(' ')}`)) {
      add('blocker', product, 'variantAttributes', 'Likely misspelled alcohol-level attribute detected.');
    }
    for (const url of Object.values(group?.images ?? {})) {
      if (localUrlPattern.test(String(url))) {
        add('blocker', product, 'variantAttributes.images', 'Variant image contains a localhost URL.');
      }
    }
  }
  const localSkus = new Set();
  for (const variant of variants) {
    const sku = String(variant.sku ?? '').trim();
    if (!sku) add('blocker', product, 'variants.sku', 'Variant is missing SKU.');
    if (sku.length > 50) add('blocker', product, 'variants.sku', `SKU ${sku} exceeds 50 characters.`);
    if (sku && localSkus.has(sku)) add('blocker', product, 'variants.sku', `Duplicate SKU ${sku} within product.`);
    localSkus.add(sku);
    if (sku) allSkus.set(sku, [...(allSkus.get(sku) ?? []), product]);
    if (Number(variant.price) > 0 && Number(variant.price) < 10000) {
      add('warning', product, 'variants.price', `SKU ${sku} has an unusually low VND price (${variant.price}).`);
    }
    if (Number(variant.stockQuantity ?? variant.stock_quantity) > 100000) {
      add('warning', product, 'variants.stockQuantity', `SKU ${sku} has unusually high stock.`);
    }
    if (localUrlPattern.test(String(variant.imageUrl ?? variant.image_url ?? ''))) {
      add('blocker', product, 'variants.imageUrl', `SKU ${sku} contains a localhost image URL.`);
    }
    const attributes = variant.attributes ?? {};
    for (const group of configuredGroups) {
      if (!Object.prototype.hasOwnProperty.call(attributes, group.name)) {
        add('blocker', product, 'variants.attributes', `SKU ${sku} does not match configured group "${group.name}".`);
      } else if (!(group.values ?? []).includes(attributes[group.name])) {
        add('blocker', product, 'variants.attributes', `SKU ${sku} uses an undeclared value for "${group.name}".`);
      }
    }
  }
}

for (const [sku, owners] of allSkus) {
  if (owners.length < 2) continue;
  for (const product of owners) {
    add('blocker', product, 'variants.sku', `SKU ${sku} is duplicated across products.`);
  }
}

duplicates('name');
duplicates('slug');
duplicates('shortDescription');
duplicates('short_description');
duplicates('description');

const sample = sampleSelector
  ? products.find(
      (product) =>
        String(product.id) === sampleSelector ||
        product.slug === sampleSelector ||
        product.name === sampleSelector,
    )
  : null;

if (sampleSelector && !sample) {
  issues.unshift({
    severity: 'blocker',
    productId: null,
    product: '(catalog)',
    field: 'sample',
    message: `Reference product not found: ${sampleSelector}`,
  });
}

const counts = { blocker: 0, warning: 0 };
for (const issue of issues) counts[issue.severity] += 1;
const report = {
  products: products.length,
  sample: sample ? { id: sample.id, slug: sample.slug, name: sample.name } : null,
  counts,
  issues,
};

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Products: ${report.products}`);
  console.log(`Sample: ${sample ? `${sample.name} (${sample.slug})` : 'not selected'}`);
  console.log(`Blockers: ${counts.blocker}; warnings: ${counts.warning}`);
  for (const issue of issues) {
    console.log(`[${issue.severity.toUpperCase()}] ${issue.product} :: ${issue.field} — ${issue.message}`);
  }
}

process.exitCode = counts.blocker > 0 ? 1 : 0;
