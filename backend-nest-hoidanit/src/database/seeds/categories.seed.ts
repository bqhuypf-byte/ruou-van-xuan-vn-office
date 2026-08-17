import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Category } from '../../features/product/entities/category.entity';

const TREE: Record<string, string[]> = {
  Electronics: ['Phones', 'Laptops', 'Accessories'],
  Fashion: ["Men's Clothing", "Women's Clothing", 'Shoes'],
  'Home & Living': ['Furniture', 'Kitchenware'],
  'Sports & Outdoors': ['Fitness Equipment', 'Camping Gear'],
};

function slugify(name: string): string {
  return faker.helpers.slugify(name).toLowerCase();
}

export async function seedCategories(dataSource: DataSource) {
  const repo = dataSource.getRepository(Category);

  const existingCount = await repo.count();
  if (existingCount > 0) {
    console.log('⏭ Categories already seeded');
    return;
  }

  let total = 0;
  for (const [parentName, childNames] of Object.entries(TREE)) {
    const parent = await repo.save(
      repo.create({
        name: parentName,
        slug: slugify(parentName),
        parentId: null,
      }),
    );
    total += 1;

    const children = childNames.map((childName) =>
      repo.create({
        name: childName,
        slug: slugify(childName),
        parentId: parent.id,
      }),
    );
    await repo.save(children);
    total += children.length;
  }

  console.log(`✓ Seeded ${total} categories`);
}
