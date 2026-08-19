import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { CategoryTreeNode } from '../types/product.types';
import { CategoryHasProductsException } from '../exceptions/category-has-products.exception';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  private buildTree(
    categories: Category[],
    parentId: number | null = null,
  ): CategoryTreeNode[] {
    return categories
      .filter((category) => category.parentId === parentId)
      .map((category) => ({
        ...category,
        children: this.buildTree(categories, category.id),
      }));
  }

  async findTree(): Promise<CategoryTreeNode[]> {
    const categories = await this.categoryRepository.findAll();
    return this.buildTree(categories);
  }

  async findBySlug(
    slug: string,
  ): Promise<Category & { children: Category[]; products: Product[] }> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundException(`Category "${slug}" not found`);
    }
    const [children, descendantIds] = await Promise.all([
      this.categoryRepository.findChildren(category.id),
      this.categoryRepository.findDescendantIds(category.id),
    ]);
    const products =
      await this.productRepository.findActiveByCategoryIds(descendantIds);
    return { ...category, children, products };
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException(`Slug "${dto.slug}" already exists`);
    }

    if (dto.parentId !== undefined) {
      const parent = await this.categoryRepository.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundException(`Category #${dto.parentId} not found`);
      }
    }

    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoryRepository.findBySlug(dto.slug);
      if (existing) {
        throw new ConflictException(`Slug "${dto.slug}" already exists`);
      }
    }

    if (dto.parentId !== undefined) {
      if (dto.parentId === id) {
        throw new BadRequestException('A category cannot be its own parent');
      }
      const parent = await this.categoryRepository.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundException(`Category #${dto.parentId} not found`);
      }
      await this.assertNoCycle(id, dto.parentId);
    }

    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  private async assertNoCycle(
    categoryId: number,
    newParentId: number,
  ): Promise<void> {
    let current: Category | null =
      await this.categoryRepository.findById(newParentId);
    while (current?.parentId != null) {
      if (current.parentId === categoryId) {
        throw new BadRequestException(
          'Cannot set a descendant category as parent',
        );
      }
      current = await this.categoryRepository.findById(current.parentId);
    }
  }

  async remove(id: number, targetCategoryId?: number): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    const children = await this.categoryRepository.findChildren(id);
    if (children.length > 0) {
      throw new BadRequestException(
        'Cannot delete a category that has child categories',
      );
    }

    const productCount = await this.productRepository.countByCategoryId(id);
    if (productCount > 0) {
      if (targetCategoryId === undefined) {
        throw new CategoryHasProductsException(
          `Category still has ${productCount} product(s) assigned to it`,
        );
      }
      if (targetCategoryId === id) {
        throw new BadRequestException(
          'Target category must be different from the category being deleted',
        );
      }
      const target = await this.categoryRepository.findById(targetCategoryId);
      if (!target) {
        throw new NotFoundException(`Category #${targetCategoryId} not found`);
      }
      await this.productRepository.reassignCategory(id, targetCategoryId);
    }

    await this.categoryRepository.remove(category);
  }
}
