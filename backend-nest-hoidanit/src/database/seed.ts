import { AppDataSource } from './data-source';
import { seedRoles } from './seeds/roles.seed';
import { seedUsers } from './seeds/users.seed';
import { seedAddresses } from './seeds/addresses.seed';
import { seedCategories } from './seeds/categories.seed';
import { seedProducts } from './seeds/products.seed';
import { seedVanXuanProducts } from './seeds/van-xuan-products.seed';
import { seedVanXuanProductImages } from './seeds/van-xuan-product-images.seed';
import { seedCarts } from './seeds/carts.seed';
import { seedOrders } from './seeds/orders.seed';
import { seedReviews } from './seeds/reviews.seed';
import { seedBanners } from './seeds/banners.seed';
import { seedBrands } from './seeds/brands.seed';
import { seedSiteSettings } from './seeds/site-settings.seed';
import { seedFaqs } from './seeds/faqs.seed';
import { seedPages } from './seeds/pages.seed';
import { seedVouchers } from './seeds/vouchers.seed';
import { seedHomepageSections } from './seeds/homepage-sections.seed';

const seeders: Record<
  string,
  (dataSource: typeof AppDataSource, count?: number) => Promise<void>
> = {
  roles: seedRoles,
  users: seedUsers,
  addresses: seedAddresses,
  categories: seedCategories,
  products: seedProducts,
  'van-xuan-products': seedVanXuanProducts,
  'van-xuan-product-images': seedVanXuanProductImages,
  carts: seedCarts,
  orders: seedOrders,
  reviews: seedReviews,
  banners: seedBanners,
  brands: seedBrands,
  'site-settings': seedSiteSettings,
  faqs: seedFaqs,
  pages: seedPages,
  vouchers: seedVouchers,
  'homepage-sections': seedHomepageSections,
};

async function seedAll(count?: number) {
  await seedRoles(AppDataSource);
  await seedUsers(AppDataSource, count);
  await seedAddresses(AppDataSource);
  await seedCategories(AppDataSource);
  await seedProducts(AppDataSource);
  await seedVanXuanProducts(AppDataSource);
  await seedVanXuanProductImages(AppDataSource);
  await seedCarts(AppDataSource);
  await seedOrders(AppDataSource);
  await seedReviews(AppDataSource);
  await seedBanners(AppDataSource);
  await seedBrands(AppDataSource);
  await seedSiteSettings(AppDataSource);
  await seedFaqs(AppDataSource);
  await seedPages(AppDataSource);
  await seedVouchers(AppDataSource);
  await seedHomepageSections(AppDataSource);
}

async function main() {
  const entity = process.argv[2] ?? 'all';
  const count = process.argv[3] ? parseInt(process.argv[3], 10) : undefined;

  await AppDataSource.initialize();

  if (entity === 'all') {
    await seedAll(count);
  } else {
    const seeder = seeders[entity];
    if (!seeder) {
      console.error(
        `Unknown seed target "${entity}". Available: all, ${Object.keys(seeders).join(', ')}`,
      );
      process.exit(1);
    }
    await seeder(AppDataSource, count);
  }

  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
