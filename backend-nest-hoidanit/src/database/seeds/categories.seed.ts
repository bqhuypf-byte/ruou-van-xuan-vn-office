import { DataSource } from 'typeorm';
import { Category } from '../../features/product/entities/category.entity';
import { slugifyVi } from './slugify-vi.util';

const TREE: Record<string, string[]> = {
  'Rượu Vang': ['Vang Đỏ', 'Vang Trắng'],
  'Rượu Ngâm': ['Rượu Trái Cây', 'Rượu Thuốc'],
  'Rượu Đế': ['Rượu Nếp'],
  'Rượu Nhập Khẩu': ['Whisky', 'Vang Nhập Khẩu'],
  'Quà Tặng': ['Set Quà Tặng', 'Hộp Quà Cao Cấp'],
};

export async function seedCategories(dataSource: DataSource) {
  const repo = dataSource.getRepository(Category);

  const existingCount = await repo.count();
  if (existingCount > 0) {
    console.log('⏭ Categories already seeded');
    return;
  }

  const CAROUSEL_PARENTS = new Set(['Rượu Nhập Khẩu', 'Quà Tặng']);

  let total = 0;
  let sortOrder = 0;
  for (const [parentName, childNames] of Object.entries(TREE)) {
    const parent = await repo.save(
      repo.create({
        name: parentName,
        slug: slugifyVi(parentName),
        parentId: null,
        thumbnailUrl: null,
        homeSortOrder: sortOrder++,
        homeDisplayStyle: CAROUSEL_PARENTS.has(parentName)
          ? 'carousel'
          : 'grid',
      }),
    );
    total += 1;

    const children = childNames.map((childName, idx) =>
      repo.create({
        name: childName,
        slug: slugifyVi(childName),
        parentId: parent.id,
        thumbnailUrl: null,
        homeSortOrder: idx,
      }),
    );
    await repo.save(children);
    total += children.length;
  }

  console.log(`✓ Seeded ${total} categories`);
}
