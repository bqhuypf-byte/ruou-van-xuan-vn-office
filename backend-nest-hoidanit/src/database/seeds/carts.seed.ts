import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Cart } from '../../features/cart/entities/cart.entity';
import { CartItem } from '../../features/cart/entities/cart-item.entity';
import { User } from '../../features/users/entities/user.entity';
import { seedUsers } from './users.seed';

export async function seedCarts(dataSource: DataSource, userCount = 5) {
  await seedUsers(dataSource);

  const userRepo = dataSource.getRepository(User);
  const cartRepo = dataSource.getRepository(Cart);
  const cartItemRepo = dataSource.getRepository(CartItem);

  const existingCount = await cartRepo.count();
  if (existingCount > 0) {
    console.log('⏭ Carts already seeded');
    return;
  }

  const users = await userRepo.find({ take: userCount });

  let cartTotal = 0;
  let itemTotal = 0;
  for (const user of users) {
    const cart = await cartRepo.save(
      cartRepo.create({ userId: user.id, sessionId: null }),
    );
    cartTotal += 1;

    const itemCount = faker.number.int({ min: 1, max: 3 });
    const items = Array.from({ length: itemCount }, () =>
      cartItemRepo.create({
        cartId: cart.id,
        productVariantId: faker.number.int({ min: 1, max: 100 }),
        quantity: faker.number.int({ min: 1, max: 5 }),
      }),
    );
    await cartItemRepo.save(items);
    itemTotal += items.length;
  }

  console.log(`✓ Seeded ${cartTotal} carts with ${itemTotal} items`);
}
