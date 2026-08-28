import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { assignDefined } from '../../../shared/utils/assign-defined.util';
import { CategoryRepository } from '../repositories/category.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ProductVariantRepository } from '../repositories/product-variant.repository';
import { ProductImageRepository } from '../repositories/product-image.repository';
import { ProductRatingRepository } from '../repositories/product-rating.repository';
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

export interface ProductListItem extends Product {
  priceFrom: number | null;
  defaultVariantId: number | null;
  rating: number | null;
  reviewCount: number;
}

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly variantRepository: ProductVariantRepository,
    private readonly imageRepository: ProductImageRepository,
    private readonly ratingRepository: ProductRatingRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    query: QueryProductDto,
  ): Promise<{ items: ProductListItem[]; meta: PaginationMeta }> {
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

    const productIds = items.map((item) => item.id);
    const [variants, ratings] = await Promise.all([
      this.variantRepository.findByProductIds(productIds),
      this.ratingRepository.findByProductIds(productIds),
    ]);

    const cheapestVariantByProduct = new Map<
      number,
      (typeof variants)[number]
    >();
    for (const variant of variants) {
      if (!cheapestVariantByProduct.has(variant.productId)) {
        cheapestVariantByProduct.set(variant.productId, variant);
      }
    }
    const ratingByProduct = new Map(
      ratings.map((rating) => [rating.productId, rating]),
    );

    const enrichedItems: ProductListItem[] = items.map((item) => {
      const cheapestVariant = cheapestVariantByProduct.get(item.id);
      const rating = ratingByProduct.get(item.id);
      return {
        ...item,
        priceFrom: cheapestVariant ? Number(cheapestVariant.price) : null,
        defaultVariantId: cheapestVariant?.id ?? null,
        rating: rating ? rating.avgRating : null,
        reviewCount: rating?.reviewCount ?? 0,
      };
    });

    return {
      items: enrichedItems,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(
    slug: string,
  ): Promise<Product & { rating: number | null; reviewCount: number }> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product || !product.isActive) {
      throw new NotFoundException(`Product "${slug}" not found`);
    }

    const [rating] = await this.ratingRepository.findByProductIds([
      product.id,
    ]);
    return {
      ...product,
      rating: rating ? rating.avgRating : null,
      reviewCount: rating?.reviewCount ?? 0,
    };
  }

  findByIdOrNull(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async findManyWithPricing(ids: number[]): Promise<
    Array<
      Product & {
        price: number | null;
        salePrice: number | null;
        rating: number | null;
        reviewCount: number;
      }
    >
  > {
    const [products, variants, ratings] = await Promise.all([
      this.productRepository.findByIds(ids),
      this.variantRepository.findByProductIds(ids),
      this.ratingRepository.findByProductIds(ids),
    ]);

    const cheapestVariantByProduct = new Map<
      number,
      (typeof variants)[number]
    >();
    for (const variant of variants) {
      if (!cheapestVariantByProduct.has(variant.productId)) {
        cheapestVariantByProduct.set(variant.productId, variant);
      }
    }
    const ratingByProduct = new Map(
      ratings.map((rating) => [rating.productId, rating]),
    );

    return products.map((product) => {
      const variant = cheapestVariantByProduct.get(product.id);
      const rating = ratingByProduct.get(product.id);
      return {
        ...product,
        price: variant ? Number(variant.price) : null,
        salePrice: variant?.salePrice ? Number(variant.salePrice) : null,
        rating: rating ? rating.avgRating : null,
        reviewCount: rating?.reviewCount ?? 0,
      };
    });
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

    assignDefined(product, dto);
    return this.productRepository.save(product);
  }

  async softDelete(id: number): Promise<void> {
    const product = await this.getById(id);
    product.isActive = false;
    await this.productRepository.save(product);
  }

  async hardDelete(id: number): Promise<void> {
    const product = await this.getById(id);
    if (product.isActive) {
      throw new ConflictException(
        'Chỉ có thể xóa vĩnh viễn sản phẩm đang ở trạng thái Ngừng Bán',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(ProductVariant, { productId: id });
      await queryRunner.manager.delete(ProductImage, { productId: id });
      await queryRunner.manager.delete(Product, { id });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
