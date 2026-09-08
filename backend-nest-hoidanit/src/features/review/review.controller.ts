import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { QueryAdminReviewsDto } from './dto/query-admin-reviews.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('products/:id/reviews')
  findByProduct(@Param('id', ParseIntPipe) productId: number) {
    return this.reviewService.findByProduct(productId);
  }

  @Post('products/:id/reviews')
  create(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.create(productId, dto);
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
  @Get('admin/reviews')
  findAllAdmin(@Query() query: QueryAdminReviewsDto) {
    return this.reviewService.findAllAdmin(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/reviews/:id/status')
  moderate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ModerateReviewDto,
  ) {
    return this.reviewService.moderate(id, dto.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/reviews/:id')
  async removeAsAdmin(@Param('id', ParseIntPipe) id: number) {
    await this.reviewService.removeAsAdmin(id);
    return { success: true };
  }
}
