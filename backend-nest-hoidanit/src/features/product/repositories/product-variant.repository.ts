import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from '../entities/product-variant.entity';

@Injectable()
export class ProductVariantRepository {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly repository: Repository<ProductVariant>,
  ) {}

  findByProductId(productId: number): Promise<ProductVariant[]> {
    return this.repository.find({ where: { productId } });
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
}
