import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './controllers/category.controller';
import { ProductController } from './controllers/product.controller';
import { ProductVariantController } from './controllers/product-variant.controller';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { ProductVariantService } from './services/product-variant.service';
import { CategoryRepository } from './repositories/category.repository';
import { ProductRepository } from './repositories/product.repository';
import { ProductVariantRepository } from './repositories/product-variant.repository';
import { ProductImageRepository } from './repositories/product-image.repository';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product, ProductVariant, ProductImage]),
  ],
  controllers: [
    CategoryController,
    ProductController,
    ProductVariantController,
  ],
  providers: [
    CategoryService,
    ProductService,
    ProductVariantService,
    CategoryRepository,
    ProductRepository,
    ProductVariantRepository,
    ProductImageRepository,
  ],
  exports: [CategoryService, ProductService, ProductVariantService],
})
export class ProductModule {}
