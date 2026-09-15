import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductService } from '../features/product/services/product.service';

type SeoUpdate = {
  id: number;
  slug: string;
  description: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  imageAltText: string;
};

function parsePayload(encodedPayload: string | undefined): SeoUpdate[] {
  if (!encodedPayload) {
    throw new Error('Missing base64 SEO payload.');
  }

  const parsed: unknown = JSON.parse(
    Buffer.from(encodedPayload, 'base64').toString('utf8'),
  );
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('SEO payload must be a non-empty array.');
  }

  const requiredTextFields = [
    'slug',
    'description',
    'shortDescription',
    'seoTitle',
    'seoDescription',
    'imageAltText',
  ] as const;

  for (const [index, item] of parsed.entries()) {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid SEO item at index ${index}.`);
    }
    const candidate = item as Record<string, unknown>;
    if (!Number.isInteger(candidate.id)) {
      throw new Error(`Invalid product id at index ${index}.`);
    }
    for (const field of requiredTextFields) {
      if (typeof candidate[field] !== 'string' || !candidate[field].trim()) {
        throw new Error(`Missing ${field} for product at index ${index}.`);
      }
    }
    if (String(candidate.shortDescription).length > 500) {
      throw new Error(`shortDescription is too long for product #${candidate.id}.`);
    }
    if (String(candidate.seoTitle).length > 255) {
      throw new Error(`seoTitle is too long for product #${candidate.id}.`);
    }
    if (String(candidate.seoDescription).length > 500) {
      throw new Error(`seoDescription is too long for product #${candidate.id}.`);
    }
    if (/hộp\s*quà|set\s*quà/i.test(String(candidate.slug))) {
      throw new Error(`Gift product #${candidate.id} is outside this SEO batch.`);
    }
  }

  return parsed as SeoUpdate[];
}

async function main(): Promise<void> {
  if (process.env.PRODUCT_SEO_APPLY_CONFIRM !== 'APPLY') {
    throw new Error('Set PRODUCT_SEO_APPLY_CONFIRM=APPLY to write product SEO.');
  }

  const updates = parsePayload(process.argv[2]);
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const products = app.get(ProductService);
    for (const update of updates) {
      const current = await products.findByIdOrNull(update.id);
      if (!current) {
        throw new Error(`Product #${update.id} does not exist.`);
      }
      if (current.slug !== update.slug) {
        throw new Error(
          `Product #${update.id} slug mismatch: expected ${update.slug}, got ${current.slug}.`,
        );
      }

      await products.update(update.id, {
        description: update.description.trim(),
        shortDescription: update.shortDescription.trim(),
        seoTitle: update.seoTitle.trim(),
        seoDescription: update.seoDescription.trim(),
        imageAltText: update.imageAltText.trim(),
      });
      console.log(`Applied product SEO: #${update.id} ${update.slug}`);
    }
  } finally {
    await app.close();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
