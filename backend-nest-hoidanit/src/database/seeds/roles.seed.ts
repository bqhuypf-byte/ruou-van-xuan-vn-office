import { DataSource } from 'typeorm';
import { Role } from '../../features/roles/entities/role.entity';

const ROLE_NAMES = ['admin', 'customer'];

export async function seedRoles(dataSource: DataSource) {
  const repo = dataSource.getRepository(Role);

  for (const name of ROLE_NAMES) {
    const exists = await repo.findOne({ where: { name } });
    if (exists) {
      console.log(`⏭ Role "${name}" already seeded`);
      continue;
    }
    await repo.save(repo.create({ name }));
    console.log(`✓ Seeded role "${name}"`);
  }
}
