import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { VoucherRepository } from './repositories/voucher.repository';
import { Voucher } from './entities/voucher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher])],
  controllers: [VoucherController],
  providers: [VoucherService, VoucherRepository],
  exports: [VoucherService],
})
export class VoucherModule {}
