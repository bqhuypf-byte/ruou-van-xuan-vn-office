import { DataSource } from 'typeorm';
import { Product } from '../../features/product/entities/product.entity';
import { Category } from '../../features/product/entities/category.entity';
import { HomepageSection } from '../../features/homepage-sections/entities/homepage-section.entity';
import { HomepageSectionItem } from '../../features/homepage-sections/entities/homepage-section-item.entity';

const CATEGORY_SECTION_PRODUCT_LIMIT = 8;

export async function seedHomepageSections(dataSource: DataSource) {
  const sectionRepo = dataSource.getRepository(HomepageSection);
  const itemRepo = dataSource.getRepository(HomepageSectionItem);
  const productRepo = dataSource.getRepository(Product);
  const categoryRepo = dataSource.getRepository(Category);

  const existingCount = await sectionRepo.count();
  if (existingCount > 0) {
    console.log('⏭ Homepage sections already seeded');
    return;
  }

  let sortOrder = 0;

  const featuredDealProducts = await productRepo.find({
    where: { isFeaturedDeal: true, isActive: true },
    order: { dealSortOrder: 'ASC', createdAt: 'DESC' },
    take: 10,
  });

  if (featuredDealProducts.length > 0) {
    const featuredSection = await sectionRepo.save(
      sectionRepo.create({
        title: 'Sản Phẩm Nổi Bật',
        displayStyle: 'carousel',
        sortOrder: sortOrder++,
        isActive: true,
      }),
    );
    await itemRepo.save(
      featuredDealProducts.map((product, index) =>
        itemRepo.create({
          sectionId: featuredSection.id,
          productId: product.id,
          sortOrder: index,
        }),
      ),
    );

    const dealsSection = await sectionRepo.save(
      sectionRepo.create({
        title: 'Ưu Đãi Nổi Bật',
        displayStyle: 'grid',
        sortOrder: sortOrder++,
        isActive: true,
      }),
    );
    await itemRepo.save(
      featuredDealProducts.map((product, index) =>
        itemRepo.create({
          sectionId: dealsSection.id,
          productId: product.id,
          sortOrder: index,
        }),
      ),
    );
  }

  const homeCategories = await categoryRepo.find({
    where: { showInProductSections: true },
    order: { homeSortOrder: 'ASC' },
  });

  for (const category of homeCategories) {
    const products = await productRepo.find({
      where: { categoryId: category.id, isActive: true },
      order: { createdAt: 'DESC' },
      take: CATEGORY_SECTION_PRODUCT_LIMIT,
    });
    if (products.length === 0) continue;

    const section = await sectionRepo.save(
      sectionRepo.create({
        title: category.homeSectionTitle || category.name,
        displayStyle: category.homeDisplayStyle,
        sortOrder: sortOrder++,
        isActive: true,
      }),
    );
    await itemRepo.save(
      products.map((product, index) =>
        itemRepo.create({
          sectionId: section.id,
          productId: product.id,
          sortOrder: index,
        }),
      ),
    );
  }

  console.log(
    '✓ Seeded homepage sections from existing featured/deal/category data',
  );
}
