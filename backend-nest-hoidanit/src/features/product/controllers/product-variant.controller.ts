import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { ProductVariantService } from '../services/product-variant.service';
import { CreateVariantDto } from '../dto/create-variant.dto';
import { UpdateVariantDto } from '../dto/update-variant.dto';

@Controller()
export class ProductVariantController {
  constructor(private readonly variantService: ProductVariantService) {}

  @Get('variants/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variantService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/products/:id/variants')
  create(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: CreateVariantDto,
  ) {
    return this.variantService.create(productId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/variants/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVariantDto) {
    return this.variantService.update(id, dto);
  }
}
