import { IsIn } from 'class-validator';
import { PAYMENT_STATUSES } from '../types/payment-status.type';
import type { PaymentStatus } from '../types/payment-status.type';

export class UpdateOrderPaymentDto {
  @IsIn(PAYMENT_STATUSES)
  paymentStatus: PaymentStatus;
}
