import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ProductVariantRepository } from '../repositories/product-variant.repository';
import { ProductImageRepository } from '../repositories/product-image.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { QueryProductDto } from '../dto/query-product.dto';
import { CreateImageDto } from '../dto/create-image.dto';
import { Product } from '../entities/product.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { ProductImage } from '../entities/product-image.entity';
import { PaginationMeta } from '../../../shared/types/pagination.type';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly variantRepository: ProductVariantRepository,
    private readonly imageRepository: ProductImageRepository,
  ) {}

  async findAll(
    query: QueryProductDto,
  ): Promise<{ items: Product[]; meta: PaginationMeta }> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, MAX_LIMIT);

    const categoryIds =
      query.categoryId !== undefined
        ? await this.categoryRepository.findDescendantIds(query.categoryId)
        : undefined;

    const { items, total } = await this.productRepository.findAll(
      query,
      page,
      limit,
      categoryIds,
    );

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product || !product.isActive) {
      throw new NotFoundException(`Product "${slug}" not found`);
    }
    return product;
  }

  private async getById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async findVariants(productId: number): Promise<ProductVariant[]> {
    await this.getById(productId);
    return this.variantRepository.findByProductId(productId);
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new NotFoundException(`Category #${dto.categoryId} not found`);
    }

    const existing = await this.productRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException(`Slug "${dto.slug}" already exists`);
    }

    const product = this.productRepository.create(dto);
    return this.productRepository.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.getById(id);

    if (dto.categoryId !== undefined) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category) {
        throw new NotFoundException(`Category #${dto.categoryId} not found`);
      }
    }

    if (dto.slug && dto.slug !== product.slug) {
      const existing = await this.productRepository.findBySlug(dto.slug);
      if (existing) {
        throw new ConflictException(`Slug "${dto.slug}" already exists`);
      }
    }

    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async softDelete(id: number): Promise<void> {
    const product = await this.getById(id);
    product.isActive = false;
    await this.productRepository.save(product);
  }

  async addImages(
    productId: number,
    imageDtos: CreateImageDto[],
  ): Promise<ProductImage[]> {
    await this.getById(productId);

    const images = imageDtos.map((dto) =>
      this.imageRepository.create({
        productId,
        imageUrl: dto.imageUrl,
        sortOrder: dto.sortOrder ?? 0,
      }),
    );
    return this.imageRepository.save(images);
  }

  async removeImage(id: number): Promise<void> {
    const image = await this.imageRepository.findById(id);
    if (!image) {
      throw new NotFoundException(`Image #${id} not found`);
    }
    await this.imageRepository.remove(image);
  }
}
