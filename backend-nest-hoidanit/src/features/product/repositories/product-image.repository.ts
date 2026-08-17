import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from '../entities/product-image.entity';

@Injectable()
export class ProductImageRepository {
  constructor(
    @InjectRepository(ProductImage)
    private readonly repository: Repository<ProductImage>,
  ) {}

  findByProductId(productId: number): Promise<ProductImage[]> {
    return this.repository.find({
      where: { productId },
      order: { sortOrder: 'ASC' },
    });
  }

  findById(id: number): Promise<ProductImage | null> {
    return this.repository.findOne({ where: { id } });
  }

  create(data: Partial<ProductImage>): ProductImage {
    return this.repository.create(data);
  }

  save(images: ProductImage[]): Promise<ProductImage[]> {
    return this.repository.save(images);
  }

  async remove(image: ProductImage): Promise<void> {
    await this.repository.remove(image);
  }
}
