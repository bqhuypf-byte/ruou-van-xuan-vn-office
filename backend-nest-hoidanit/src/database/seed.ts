import { AppDataSource } from './data-source';
import { seedRoles } from './seeds/roles.seed';

const seeders: Record<string, (dataSource: typeof AppDataSource) => Promise<void>> = {
  roles: seedRoles,
};

async function main() {
  const entity = process.argv[2];
  const seeder = seeders[entity];

  if (!seeder) {
    console.error(`Unknown seed target "${entity}". Available: ${Object.keys(seeders).join(', ')}`);
    process.exit(1);
  }

  await AppDataSource.initialize();
  await seeder(AppDataSource);
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
