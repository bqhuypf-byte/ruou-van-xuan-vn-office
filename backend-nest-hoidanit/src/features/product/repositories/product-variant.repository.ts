import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductVariant } from '../entities/product-variant.entity';

@Injectable()
export class ProductVariantRepository {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly repository: Repository<ProductVariant>,
  ) {}

  findByProductId(productId: number): Promise<ProductVariant[]> {
    return this.repository.find({ where: { productId, isActive: true } });
  }

  findByProductIds(productIds: number[]): Promise<ProductVariant[]> {
    if (productIds.length === 0) return Promise.resolve([]);
    return this.repository
      .createQueryBuilder('variant')
      .where('variant.productId IN (:...productIds)', { productIds })
      .andWhere('variant.isActive = :isActive', { isActive: true })
      .orderBy('variant.price', 'ASC')
      .getMany();
  }

  findById(id: number): Promise<ProductVariant | null> {
    return this.repository.findOne({ where: { id } });
  }

  findBySku(sku: string): Promise<ProductVariant | null> {
    return this.repository.findOne({ where: { sku } });
  }

  create(data: Partial<ProductVariant>): ProductVariant {
    return this.repository.create(data);
  }

  save(variant: ProductVariant): Promise<ProductVariant> {
    return this.repository.save(variant);
  }

  async deactivateByIds(productId: number, ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    await this.repository.update(
      { productId, id: In(ids) },
      { isActive: false },
    );
  }
}
