import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Order } from '../../features/order/entities/order.entity';
import { OrderItem } from '../../features/order/entities/order-item.entity';
import { ORDER_STATUSES } from '../../features/order/types/order-status.type';
import { PAYMENT_STATUSES } from '../../features/order/types/payment-status.type';
import { Address } from '../../features/user-profile/entities/address.entity';
import { User } from '../../features/users/entities/user.entity';
import { seedAddresses } from './addresses.seed';

const PAYMENT_METHODS = ['cod', 'bank_transfer'];

export async function seedOrders(dataSource: DataSource, userCount = 10) {
  await seedAddresses(dataSource);

  const userRepo = dataSource.getRepository(User);
  const addressRepo = dataSource.getRepository(Address);
  const orderRepo = dataSource.getRepository(Order);
  const orderItemRepo = dataSource.getRepository(OrderItem);

  const existingCount = await orderRepo.count();
  if (existingCount > 0) {
    console.log('⏭ Orders already seeded');
    return;
  }

  const users = await userRepo.find({ take: userCount });

  let orderTotal = 0;
  let itemTotal = 0;
  for (const user of users) {
    const address = await addressRepo.findOne({ where: { userId: user.id } });
    if (!address) {
      continue;
    }

    const orderCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < orderCount; i++) {
      const itemCount = faker.number.int({ min: 1, max: 3 });
      const itemDrafts = Array.from({ length: itemCount }, () => ({
        productVariantId: faker.number.int({ min: 1, max: 100 }),
        productName: faker.commerce.productName(),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        price: Number(faker.commerce.price({ min: 10, max: 500 })),
        quantity: faker.number.int({ min: 1, max: 3 }),
        thumbnailUrl: faker.image.urlPicsumPhotos(),
      }));

      const itemsTotal = itemDrafts.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const shippingFee = 30000;

      const order = await orderRepo.save(
        orderRepo.create({
          userId: user.id,
          status: faker.helpers.arrayElement(ORDER_STATUSES),
          paymentMethod: faker.helpers.arrayElement(PAYMENT_METHODS),
          paymentStatus: faker.helpers.arrayElement(PAYMENT_STATUSES),
          shippingFee: shippingFee.toFixed(2),
          totalAmount: (itemsTotal + shippingFee).toFixed(2),
          shippingAddress: {
            fullName: address.fullName,
            phone: address.phone,
            addressLine: address.addressLine,
            city: address.city,
          },
        }),
      );
      orderTotal += 1;

      const items = itemDrafts.map((item) =>
        orderItemRepo.create({
          orderId: order.id,
          productVariantId: item.productVariantId,
          productName: item.productName,
          sku: item.sku,
          price: item.price.toFixed(2),
          quantity: item.quantity,
          thumbnailUrl: item.thumbnailUrl,
        }),
      );
      await orderItemRepo.save(items);
      itemTotal += items.length;
    }
  }

  console.log(`✓ Seeded ${orderTotal} orders with ${itemTotal} items`);
}
