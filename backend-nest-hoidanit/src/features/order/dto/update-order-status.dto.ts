import { IsIn } from 'class-validator';
import { ORDER_STATUSES } from '../types/order-status.type';
import type { OrderStatus } from '../types/order-status.type';

export class UpdateOrderStatusDto {
  @IsIn(ORDER_STATUSES)
  status: OrderStatus;
}
