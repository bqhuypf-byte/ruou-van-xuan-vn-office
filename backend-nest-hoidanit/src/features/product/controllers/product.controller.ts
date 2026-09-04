import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { QueryProductDto } from '../dto/query-product.dto';
import { AddImagesDto } from '../dto/add-images.dto';
import { ReorderImagesDto } from '../dto/reorder-images.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  async findAll(@Query() query: QueryProductDto) {
    const { items, meta } = await this.productService.findAll(query);
    return { data: items, meta };
  }

  @Get('products/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Get('products/:id/variants')
  findVariants(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findVariants(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/products')
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/products/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/products/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productService.softDelete(id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/products/:id/permanent')
  @HttpCode(HttpStatus.OK)
  async removePermanently(@Param('id', ParseIntPipe) id: number) {
    await this.productService.hardDelete(id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/products/:id/images')
  addImages(@Param('id', ParseIntPipe) id: number, @Body() dto: AddImagesDto) {
    return this.productService.addImages(id, dto.images);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/products/:id/images/order')
  reorderImages(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReorderImagesDto,
  ) {
    return this.productService.reorderImages(id, dto.imageIds);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/images/:id')
  @HttpCode(HttpStatus.OK)
  async removeImage(@Param('id', ParseIntPipe) id: number) {
    await this.productService.removeImage(id);
    return { success: true };
  }
}
