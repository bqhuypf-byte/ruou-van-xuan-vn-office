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
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Controller()
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get('pages/:slug')
  findActiveBySlug(@Param('slug') slug: string) {
    return this.pageService.findActiveBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/pages')
  findAll() {
    return this.pageService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/pages/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pageService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/pages')
  create(@Body() dto: CreatePageDto) {
    return this.pageService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/pages/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePageDto) {
    return this.pageService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/pages/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pageService.remove(id);
  }
}
