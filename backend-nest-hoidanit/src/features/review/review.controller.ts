import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('products/:id/reviews')
  findByProduct(@Param('id', ParseIntPipe) productId: number) {
    return this.reviewService.findByProduct(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('products/:id/reviews')
  create(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reviewService.create(productId, user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reviews/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reviewService.update(id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('reviews/:id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.reviewService.remove(id, user.id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/reviews/:id')
  async removeAsAdmin(@Param('id', ParseIntPipe) id: number) {
    await this.reviewService.removeAsAdmin(id);
    return { success: true };
  }
}
