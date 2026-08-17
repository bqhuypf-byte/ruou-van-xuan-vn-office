import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Address } from '../../features/user-profile/entities/address.entity';
import { User } from '../../features/users/entities/user.entity';
import { fakePhone } from './fake-phone.util';
import { seedUsers } from './users.seed';

export async function seedAddresses(dataSource: DataSource) {
  await seedUsers(dataSource);

  const userRepo = dataSource.getRepository(User);
  const addressRepo = dataSource.getRepository(Address);

  const existingCount = await addressRepo.count();
  if (existingCount > 0) {
    console.log('⏭ Addresses already seeded');
    return;
  }

  const users = await userRepo.find();
  const addresses: Address[] = [];

  for (const user of users) {
    const addressCount = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < addressCount; i++) {
      addresses.push(
        addressRepo.create({
          userId: user.id,
          fullName: user.fullName,
          phone: fakePhone(),
          addressLine: faker.location.streetAddress(),
          city: faker.location.city(),
          isDefault: i === 0,
        }),
      );
    }
  }

  await addressRepo.save(addresses);
  console.log(`✓ Seeded ${addresses.length} addresses`);
}
