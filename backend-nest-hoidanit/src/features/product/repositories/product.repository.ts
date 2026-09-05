import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { QueryProductDto } from '../dto/query-product.dto';

export interface PaginatedProducts {
  items: Product[];
  total: number;
}

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findAll(
    query: QueryProductDto,
    page: number,
    limit: number,
    categoryIds?: number[],
  ): Promise<PaginatedProducts> {
    const qb = this.repository
      .createQueryBuilder('product')
      .leftJoin(
        'product.variants',
        'variant',
        'variant.isActive = :variantIsActive',
        {
          variantIsActive: true,
        },
      );

    if (query.search) {
      qb.andWhere('(product.name LIKE :search OR product.slug LIKE :search)', {
        search: `%${query.search}%`,
      });
    }
    if (categoryIds !== undefined) {
      qb.andWhere('product.categoryId IN (:...categoryIds)', { categoryIds });
    }
    if (query.isActive !== undefined) {
      qb.andWhere('product.isActive = :isActive', { isActive: query.isActive });
    }
    if (query.minPrice !== undefined) {
      qb.andWhere('variant.price >= :minPrice', { minPrice: query.minPrice });
    }
    if (query.maxPrice !== undefined) {
      qb.andWhere('variant.price <= :maxPrice', { maxPrice: query.maxPrice });
    }
    if (query.isFeaturedDeal !== undefined) {
      qb.andWhere('product.isFeaturedDeal = :isFeaturedDeal', {
        isFeaturedDeal: query.isFeaturedDeal,
      });
    }

    qb.distinct(true);

    if (query.isFeaturedDeal) {
      qb.orderBy('product.dealSortOrder', 'ASC');
    }
    qb.addOrderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  countByCategoryId(categoryId: number): Promise<number> {
    return this.repository.count({ where: { categoryId } });
  }

  async reassignCategory(
    fromCategoryId: number,
    toCategoryId: number,
  ): Promise<void> {
    await this.repository.update(
      { categoryId: fromCategoryId },
      { categoryId: toCategoryId },
    );
  }

  findActiveByCategoryIds(categoryIds: number[]): Promise<Product[]> {
    return this.repository.find({
      where: { categoryId: In(categoryIds), isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  findBySlug(slug: string): Promise<Product | null> {
    return this.repository.findOne({
      where: { slug },
      relations: { variants: true, images: true },
    });
  }

  findById(id: number): Promise<Product | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByIds(ids: number[]): Promise<Product[]> {
    if (ids.length === 0) return Promise.resolve([]);
    return this.repository.find({ where: { id: In(ids) } });
  }

  create(data: Partial<Product>): Product {
    return this.repository.create(data);
  }

  save(product: Product): Promise<Product> {
    return this.repository.save(product);
  }
}
