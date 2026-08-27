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
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Controller()
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get('vouchers')
  findActive() {
    return this.voucherService.findActive();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/vouchers')
  findAll() {
    return this.voucherService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/vouchers')
  create(@Body() dto: CreateVoucherDto) {
    return this.voucherService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/vouchers/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVoucherDto) {
    return this.voucherService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/vouchers/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.voucherService.remove(id);
  }
}
