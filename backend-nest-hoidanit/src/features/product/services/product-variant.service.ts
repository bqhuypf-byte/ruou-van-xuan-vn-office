import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { assignDefined } from '../../../shared/utils/assign-defined.util';
import { ProductRepository } from '../repositories/product.repository';
import { ProductVariantRepository } from '../repositories/product-variant.repository';
import { CreateVariantDto } from '../dto/create-variant.dto';
import { UpdateVariantDto } from '../dto/update-variant.dto';
import { ProductVariant } from '../entities/product-variant.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    private readonly variantRepository: ProductVariantRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async findById(id: number): Promise<ProductVariant> {
    const variant = await this.variantRepository.findById(id);
    if (!variant) {
      throw new NotFoundException(`Variant #${id} not found`);
    }
    return variant;
  }

  async create(
    productId: number,
    dto: CreateVariantDto,
  ): Promise<ProductVariant> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }

    const existing = await this.variantRepository.findBySku(dto.sku);
    if (existing) {
      throw new ConflictException(`SKU "${dto.sku}" already exists`);
    }

    const variant = this.variantRepository.create({
      ...dto,
      productId,
      price: dto.price.toFixed(2),
      salePrice: dto.salePrice?.toFixed(2) ?? null,
    });
    return this.variantRepository.save(variant);
  }

  async update(id: number, dto: UpdateVariantDto): Promise<ProductVariant> {
    const variant = await this.findById(id);

    if (dto.sku && dto.sku !== variant.sku) {
      const existing = await this.variantRepository.findBySku(dto.sku);
      if (existing) {
        throw new ConflictException(`SKU "${dto.sku}" already exists`);
      }
    }

    const { price, salePrice, ...rest } = dto;
    assignDefined(variant, rest);
    if (price !== undefined) {
      variant.price = price.toFixed(2);
    }
    if (salePrice !== undefined) {
      variant.salePrice = salePrice.toFixed(2);
    }

    return this.variantRepository.save(variant);
  }
}
