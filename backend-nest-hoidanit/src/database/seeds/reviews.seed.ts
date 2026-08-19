import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Review } from '../../features/review/entities/review.entity';
import { Order } from '../../features/order/entities/order.entity';
import { Product } from '../../features/product/entities/product.entity';
import { User } from '../../features/users/entities/user.entity';
import { seedOrders } from './orders.seed';
import { seedProducts } from './products.seed';

export async function seedReviews(dataSource: DataSource, count = 40) {
  await seedProducts(dataSource);
  await seedOrders(dataSource);

  const userRepo = dataSource.getRepository(User);
  const orderRepo = dataSource.getRepository(Order);
  const productRepo = dataSource.getRepository(Product);
  const reviewRepo = dataSource.getRepository(Review);

  const existingCount = await reviewRepo.count();
  if (existingCount >= count) {
    console.log('⏭ Reviews already seeded');
    return;
  }

  const users = await userRepo.find();
  const products = await productRepo.find();
  if (users.length === 0 || products.length === 0) {
    console.log('⏭ Skipping reviews: no users or products to review');
    return;
  }

  const remaining = count - existingCount;
  const usedPairs = new Set<string>();
  const reviews: Review[] = [];

  let attempts = 0;
  while (reviews.length < remaining && attempts < remaining * 5) {
    attempts += 1;
    const user = faker.helpers.arrayElement(users);
    const product = faker.helpers.arrayElement(products);
    const pairKey = `${user.id}-${product.id}`;
    if (usedPairs.has(pairKey)) continue;

    const order = await orderRepo.findOne({ where: { userId: user.id } });
    if (!order) continue;

    usedPairs.add(pairKey);
    reviews.push(
      reviewRepo.create({
        userId: user.id,
        productId: product.id,
        orderId: order.id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence({ min: 6, max: 20 }),
      }),
    );
  }

  await reviewRepo.save(reviews);
  console.log(`✓ Seeded ${reviews.length} reviews`);
}
