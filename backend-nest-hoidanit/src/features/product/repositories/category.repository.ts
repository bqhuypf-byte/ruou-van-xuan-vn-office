import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.repository.find();
  }

  findById(id: number): Promise<Category | null> {
    return this.repository.findOne({ where: { id } });
  }

  findBySlug(slug: string): Promise<Category | null> {
    return this.repository.findOne({ where: { slug } });
  }

  findChildren(parentId: number): Promise<Category[]> {
    return this.repository.find({ where: { parentId } });
  }

  async findDescendantIds(categoryId: number): Promise<number[]> {
    const all = await this.repository.find();
    const ids = [categoryId];
    let frontier = [categoryId];
    while (frontier.length > 0) {
      const children = all.filter(
        (category) =>
          category.parentId !== null && frontier.includes(category.parentId),
      );
      const childIds = children.map((category) => category.id);
      ids.push(...childIds);
      frontier = childIds;
    }
    return ids;
  }

  create(data: Partial<Category>): Category {
    return this.repository.create(data);
  }

  save(category: Category): Promise<Category> {
    return this.repository.save(category);
  }

  async remove(category: Category): Promise<void> {
    await this.repository.remove(category);
  }
}
