import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ): Promise<PaginatedProducts> {
    const qb = this.repository
      .createQueryBuilder('product')
      .leftJoin('product.variants', 'variant');

    if (query.categoryId !== undefined) {
      qb.andWhere('product.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
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

    qb.distinct(true)
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
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

  create(data: Partial<Product>): Product {
    return this.repository.create(data);
  }

  save(product: Product): Promise<Product> {
    return this.repository.save(product);
  }
}
