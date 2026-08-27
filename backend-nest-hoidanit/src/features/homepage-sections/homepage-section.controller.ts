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
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { HomepageSectionService } from './homepage-section.service';
import { CreateHomepageSectionDto } from './dto/create-homepage-section.dto';
import { UpdateHomepageSectionDto } from './dto/update-homepage-section.dto';
import { AddSectionItemDto } from './dto/add-section-item.dto';
import { UpdateSectionItemDto } from './dto/update-section-item.dto';
import { ReorderIdsDto } from './dto/reorder-ids.dto';

@Controller()
export class HomepageSectionController {
  constructor(
    private readonly homepageSectionService: HomepageSectionService,
  ) {}

  @Get('homepage-sections')
  findPublicSections() {
    return this.homepageSectionService.findPublicSections();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/homepage-sections')
  findAllForAdmin() {
    return this.homepageSectionService.findAllForAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/homepage-sections')
  createSection(@Body() dto: CreateHomepageSectionDto) {
    return this.homepageSectionService.createSection(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/homepage-sections/reorder')
  reorderSections(@Body() dto: ReorderIdsDto) {
    return this.homepageSectionService.reorderSections(dto.ids);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/homepage-sections/:id')
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHomepageSectionDto,
  ) {
    return this.homepageSectionService.updateSection(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/homepage-sections/:id')
  @HttpCode(HttpStatus.OK)
  async removeSection(@Param('id', ParseIntPipe) id: number) {
    await this.homepageSectionService.removeSection(id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/homepage-sections/:id/items')
  addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddSectionItemDto,
  ) {
    return this.homepageSectionService.addItem(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/homepage-sections/:id/items/reorder')
  reorderItems(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReorderIdsDto,
  ) {
    return this.homepageSectionService.reorderItems(id, dto.ids);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/homepage-sections/:id/items/:itemId')
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateSectionItemDto,
  ) {
    return this.homepageSectionService.updateItem(id, itemId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/homepage-sections/:id/items/:itemId')
  @HttpCode(HttpStatus.OK)
  async removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    await this.homepageSectionService.removeItem(id, itemId);
    return { success: true };
  }
}
