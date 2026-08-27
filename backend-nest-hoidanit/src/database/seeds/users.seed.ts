import { DataSource } from 'typeorm';
import { fakerVI as faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Role } from '../../features/roles/entities/role.entity';
import { User } from '../../features/users/entities/user.entity';
import { fakePhone } from './fake-phone.util';
import { seedRoles } from './roles.seed';

const SALT_ROUNDS = 10;
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

export async function seedUsers(dataSource: DataSource, count = 20) {
  await seedRoles(dataSource);

  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);

  const adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
  const customerRole = await roleRepo.findOne({ where: { name: 'customer' } });
  if (!adminRole || !customerRole) {
    throw new Error('Roles must be seeded before users');
  }

  const existingCount = await userRepo.count();
  if (existingCount >= count) {
    console.log('⏭ Users already seeded');
    return;
  }

  const existingAdmin = await userRepo.findOne({
    where: { email: ADMIN_EMAIL },
  });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    await userRepo.save(
      userRepo.create({
        roleId: adminRole.id,
        email: ADMIN_EMAIL,
        passwordHash,
        fullName: 'Admin User',
        phone: fakePhone(),
        isActive: true,
      }),
    );
    console.log(
      `✓ Seeded fixed admin account (${ADMIN_EMAIL} / ${ADMIN_PASSWORD})`,
    );
  }

  const remaining = count - (await userRepo.count());
  const passwordHash = await bcrypt.hash('password123', SALT_ROUNDS);

  const users: User[] = [];
  for (let i = 0; i < remaining; i++) {
    users.push(
      userRepo.create({
        roleId: customerRole.id,
        email: faker.internet.email().toLowerCase(),
        passwordHash,
        fullName: `${faker.person.lastName()} ${faker.person.firstName()}`,
        phone: fakePhone(),
        isActive: true,
      }),
    );
  }
  await userRepo.save(users);
  console.log(
    `✓ Seeded ${users.length} customer users (password: "password123")`,
  );
}
