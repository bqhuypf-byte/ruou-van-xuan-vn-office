import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { HomepageContentService } from './homepage-content.service';
import { UpdateHomepageContentDto } from './dto/update-homepage-content.dto';

@Controller()
export class HomepageContentController {
  constructor(private readonly homepageContentService: HomepageContentService) {}

  @Get('homepage-content')
  get() {
    return this.homepageContentService.get();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/homepage-content')
  update(@Body() dto: UpdateHomepageContentDto) {
    return this.homepageContentService.update(dto);
  }
}
