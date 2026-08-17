import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Category } from '../../features/product/entities/category.entity';
import { Product } from '../../features/product/entities/product.entity';
import { ProductVariant } from '../../features/product/entities/product-variant.entity';
import { ProductImage } from '../../features/product/entities/product-image.entity';
import { seedCategories } from './categories.seed';

const COLORS = ['Black', 'White', 'Blue', 'Red', 'Gray'];
const SIZES = ['S', 'M', 'L', 'XL'];

function slugify(text: string): string {
  return faker.helpers.slugify(text).toLowerCase();
}

export async function seedProducts(dataSource: DataSource, count = 30) {
  await seedCategories(dataSource);

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const variantRepo = dataSource.getRepository(ProductVariant);
  const imageRepo = dataSource.getRepository(ProductImage);

  const existingCount = await productRepo.count();
  if (existingCount >= count) {
    console.log('⏭ Products already seeded');
    return;
  }

  // Leaf categories only, so products don't land on top-level nodes
  const allCategories = await categoryRepo.find();
  const leaves = allCategories.filter((c) => c.parentId !== null);
  const pool = leaves.length > 0 ? leaves : allCategories;

  let variantTotal = 0;
  let imageTotal = 0;
  const remaining = count - existingCount;

  for (let i = 0; i < remaining; i++) {
    const category = faker.helpers.arrayElement(pool);
    const name = faker.commerce.productName();
    const slugBase = slugify(name);
    const slug = `${slugBase}-${faker.string.alphanumeric(4).toLowerCase()}`;

    const product = await productRepo.save(
      productRepo.create({
        categoryId: category.id,
        name,
        slug,
        description: faker.commerce.productDescription(),
        thumbnailUrl: faker.image.urlPicsumPhotos(),
        isActive: true,
      }),
    );

    const variantCount = faker.number.int({ min: 1, max: 3 });
    const variants = Array.from({ length: variantCount }, () => {
      const price = Number(faker.commerce.price({ min: 10, max: 1000 }));
      const onSale = faker.datatype.boolean();
      return variantRepo.create({
        productId: product.id,
        sku: `${slugBase}-${faker.string.alphanumeric(6).toUpperCase()}`,
        color: faker.helpers.arrayElement(COLORS),
        size: faker.helpers.arrayElement(SIZES),
        price: price.toFixed(2),
        salePrice: onSale ? (price * 0.85).toFixed(2) : null,
        stockQuantity: faker.number.int({ min: 0, max: 200 }),
      });
    });
    await variantRepo.save(variants);
    variantTotal += variants.length;

    const imageCount = faker.number.int({ min: 1, max: 3 });
    const images = Array.from({ length: imageCount }, (_, idx) =>
      imageRepo.create({
        productId: product.id,
        imageUrl: faker.image.urlPicsumPhotos(),
        sortOrder: idx,
      }),
    );
    await imageRepo.save(images);
    imageTotal += images.length;
  }

  console.log(
    `✓ Seeded ${remaining} products with ${variantTotal} variants and ${imageTotal} images`,
  );
}
