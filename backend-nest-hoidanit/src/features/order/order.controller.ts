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
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { OrderService } from './services/order.service';
import { CheckoutService } from './services/checkout.service';
import { CheckoutDto } from './dto/checkout.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderPaymentDto } from './dto/update-order-payment.dto';
import { BulkDeleteOrdersDto } from './dto/bulk-delete-orders.dto';

@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly checkoutService: CheckoutService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.orderService.findAllForUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.orderService.findOneForUser(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders/checkout')
  checkout(@Body() dto: CheckoutDto, @CurrentUser() user: AuthenticatedUser) {
    return this.checkoutService.execute(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('orders/:id/cancel')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.orderService.cancel(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/orders')
  findAllAdmin(@Query() query: QueryOrderDto) {
    return this.orderService.findAllAdmin(query.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/orders/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/orders/:id/payment')
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderPaymentDto,
  ) {
    return this.orderService.updatePayment(id, dto.paymentStatus);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/orders/bulk-delete')
  bulkDelete(@Body() dto: BulkDeleteOrdersDto) {
    return this.orderService.removeManyAdmin(dto.ids);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/orders/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.removeManyAdmin([id]);
  }
}
