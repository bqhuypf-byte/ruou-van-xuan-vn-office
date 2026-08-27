import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Review } from '../../features/review/entities/review.entity';
import { Order } from '../../features/order/entities/order.entity';
import { Product } from '../../features/product/entities/product.entity';
import { seedOrders } from './orders.seed';
import { seedProducts } from './products.seed';
import { seedVanXuanProducts } from './van-xuan-products.seed';

const FIVE_STAR_COMMENTS = [
  'Rượu rất thơm, uống êm, đúng chuẩn truyền thống!',
  'Đóng gói cẩn thận, giao hàng nhanh, chất lượng tuyệt vời.',
  'Mua tặng bố rất ưng, vị rượu đậm đà, không gắt.',
  'Chất lượng vượt mong đợi, chắc chắn sẽ ủng hộ tiếp shop.',
  'Rượu ngon, giá hợp lý, đúng như mô tả.',
  'Hương vị rất đặc trưng, uống một lần là nhớ mãi.',
  'Rượu chuẩn vị quê, uống là ghiền, 5 sao không có gì bàn cãi.',
  'Shop tư vấn nhiệt tình, rượu ngon, sẽ ủng hộ dài dài.',
];

/**
 * Seeds a handful of 5-star reviews for every product so storefront cards
 * (rating stars + review count) look populated, matching the target design.
 */
export async function seedReviews(
  dataSource: DataSource,
  maxReviewsPerProduct = 6,
) {
  await seedProducts(dataSource);
  await seedVanXuanProducts(dataSource);
  await seedOrders(dataSource);

  const orderRepo = dataSource.getRepository(Order);
  const productRepo = dataSource.getRepository(Product);
  const reviewRepo = dataSource.getRepository(Review);

  const existingCount = await reviewRepo.count();
  if (existingCount > 0) {
    console.log('⏭ Reviews already seeded');
    return;
  }

  const products = await productRepo.find();
  const orders = await orderRepo.find();
  if (products.length === 0 || orders.length === 0) {
    console.log(
      '⏭ Skipping reviews: no products or orders to attach reviews to',
    );
    return;
  }

  // One order per unique user, so a user never reviews the same product twice.
  const orderByUser = new Map<number, Order>();
  for (const order of orders) {
    if (!orderByUser.has(order.userId)) orderByUser.set(order.userId, order);
  }
  const reviewerOrders = [...orderByUser.values()];

  const reviews: Review[] = [];
  for (const product of products) {
    const reviewerCount = Math.min(
      faker.number.int({ min: 3, max: maxReviewsPerProduct }),
      reviewerOrders.length,
    );
    const reviewers = faker.helpers.arrayElements(
      reviewerOrders,
      reviewerCount,
    );

    for (const order of reviewers) {
      reviews.push(
        reviewRepo.create({
          userId: order.userId,
          productId: product.id,
          orderId: order.id,
          rating: 5,
          comment: faker.helpers.arrayElement(FIVE_STAR_COMMENTS),
        }),
      );
    }
  }

  await reviewRepo.save(reviews);
  console.log(
    `✓ Seeded ${reviews.length} reviews across ${products.length} products`,
  );
}
