import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VoucherRepository } from './repositories/voucher.repository';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './entities/voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { UserVoucher } from './entities/user-voucher.entity';

export interface VoucherValidationResult {
  code: string;
  title: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  discountAmount: number;
  finalAmount: number;
}

@Injectable()
export class VoucherService {
  constructor(
    private readonly voucherRepository: VoucherRepository,
    @InjectRepository(UserVoucher)
    private readonly userVoucherRepository: Repository<UserVoucher>,
  ) {}

  private validateDiscountValue(
    type: 'percent' | 'fixed',
    value: number,
  ): void {
    if (value <= 0) {
      throw new BadRequestException('Giá trị giảm giá phải lớn hơn 0');
    }
    if (type === 'percent' && value > 100) {
      throw new BadRequestException(
        'Mức giảm theo phần trăm không được vượt quá 100%',
      );
    }
  }

  async findActive(userId?: number): Promise<Voucher[]> {
    const vouchers = await this.voucherRepository.findActiveSorted();
    if (!userId) return vouchers.filter((voucher) => !voucher.newMemberOnly);
    const grants = await this.userVoucherRepository.find({
      where: { userId, redeemedOrderId: IsNull() },
    });
    const grantedIds = new Set(grants.map((grant) => grant.voucherId));
    return vouchers.filter((voucher) => !voucher.newMemberOnly || grantedIds.has(voucher.id));
  }

  async findWelcomeVoucher(): Promise<Voucher | null> {
    const vouchers = await this.voucherRepository.findActiveSorted();
    return vouchers.find((voucher) => voucher.newMemberOnly) ?? null;
  }

  async grantWelcomeVoucher(userId: number): Promise<Voucher | null> {
    const voucher = await this.findWelcomeVoucher();
    if (!voucher) return null;
    const existing = await this.userVoucherRepository.findOne({
      where: { userId, voucherId: voucher.id },
    });
    if (!existing) {
      await this.userVoucherRepository.save(
        this.userVoucherRepository.create({
          userId,
          voucherId: voucher.id,
          redeemedOrderId: null,
          redeemedAt: null,
        }),
      );
    }
    return voucher;
  }

  findAll(): Promise<Voucher[]> {
    return this.voucherRepository.findAllSorted();
  }

  async findOne(id: number): Promise<Voucher> {
    const voucher = await this.voucherRepository.findById(id);
    if (!voucher) {
      throw new NotFoundException(`Voucher #${id} not found`);
    }
    return voucher;
  }

  async create(dto: CreateVoucherDto): Promise<Voucher> {
    this.validateDiscountValue(dto.discountType, dto.discountValue);
    const existing = await this.voucherRepository.findByCode(dto.code);
    if (existing) {
      throw new ConflictException(`Mã voucher "${dto.code}" đã tồn tại`);
    }
    const voucher = this.voucherRepository.create({
      code: dto.code,
      title: dto.title,
      description: dto.description ?? null,
      discountType: dto.discountType,
      discountValue: dto.discountValue.toFixed(2),
      minOrderAmount: (dto.minOrderAmount ?? 0).toFixed(2),
      maxDiscountAmount:
        dto.maxDiscountAmount !== undefined
          ? dto.maxDiscountAmount.toFixed(2)
          : null,
      startDate: dto.startDate ?? null,
      endDate: dto.endDate ?? null,
      sortOrder: dto.sortOrder ?? 0,
      isActive: dto.isActive ?? true,
      newMemberOnly: dto.newMemberOnly ?? false,
    });
    return this.voucherRepository.save(voucher);
  }

  async update(id: number, dto: UpdateVoucherDto): Promise<Voucher> {
    const voucher = await this.findOne(id);
    this.validateDiscountValue(
      dto.discountType ?? voucher.discountType,
      dto.discountValue ?? Number(voucher.discountValue),
    );
    if (dto.code && dto.code !== voucher.code) {
      const existing = await this.voucherRepository.findByCode(dto.code);
      if (existing) {
        throw new ConflictException(`Mã voucher "${dto.code}" đã tồn tại`);
      }
    }

    if (dto.code !== undefined) voucher.code = dto.code;
    if (dto.title !== undefined) voucher.title = dto.title;
    if (dto.description !== undefined) voucher.description = dto.description;
    if (dto.discountType !== undefined) voucher.discountType = dto.discountType;
    if (dto.discountValue !== undefined)
      voucher.discountValue = dto.discountValue.toFixed(2);
    if (dto.minOrderAmount !== undefined)
      voucher.minOrderAmount = dto.minOrderAmount.toFixed(2);
    if (dto.maxDiscountAmount !== undefined) {
      voucher.maxDiscountAmount =
        dto.maxDiscountAmount === null
          ? null
          : dto.maxDiscountAmount.toFixed(2);
    }
    if (dto.startDate !== undefined) voucher.startDate = dto.startDate;
    if (dto.endDate !== undefined) voucher.endDate = dto.endDate;
    if (dto.sortOrder !== undefined) voucher.sortOrder = dto.sortOrder;
    if (dto.isActive !== undefined) voucher.isActive = dto.isActive;
    if (dto.newMemberOnly !== undefined) voucher.newMemberOnly = dto.newMemberOnly;

    return this.voucherRepository.save(voucher);
  }

  async validate(
    code: string,
    orderAmount: number,
    userId?: number,
  ): Promise<VoucherValidationResult> {
    const normalizedCode = code.trim().toUpperCase();
    const voucher = await this.voucherRepository.findByCode(normalizedCode);

    if (!voucher || !voucher.isActive) {
      throw new BadRequestException(
        'Mã khuyến mãi không hợp lệ hoặc đã ngừng áp dụng',
      );
    }

    if (voucher.newMemberOnly) {
      if (!userId) {
        throw new BadRequestException('Mã này chỉ dành cho thành viên mới');
      }
      const grant = await this.userVoucherRepository.findOne({
        where: { userId, voucherId: voucher.id, redeemedOrderId: IsNull() },
      });
      if (!grant) {
        throw new BadRequestException('Mã thành viên mới chỉ áp dụng cho đơn hàng đầu tiên');
      }
    }

    const today = new Date().toISOString().slice(0, 10);
    if (voucher.startDate && voucher.startDate > today) {
      throw new BadRequestException('Mã khuyến mãi chưa đến thời gian áp dụng');
    }
    if (voucher.endDate && voucher.endDate < today) {
      throw new BadRequestException('Mã khuyến mãi đã hết hạn');
    }

    const minOrderAmount = Number(voucher.minOrderAmount);
    if (orderAmount < minOrderAmount) {
      throw new BadRequestException(
        `Đơn hàng phải đạt tối thiểu ${minOrderAmount.toLocaleString('vi-VN')} đ`,
      );
    }

    const discountValue = Number(voucher.discountValue);
    const maxDiscountAmount = voucher.maxDiscountAmount
      ? Number(voucher.maxDiscountAmount)
      : null;
    let discountAmount =
      voucher.discountType === 'percent'
        ? (orderAmount * discountValue) / 100
        : discountValue;

    if (voucher.discountType === 'percent' && maxDiscountAmount !== null) {
      discountAmount = Math.min(discountAmount, maxDiscountAmount);
    }

    discountAmount =
      Math.round(Math.min(discountAmount, orderAmount) * 100) / 100;

    return {
      code: voucher.code,
      title: voucher.title,
      discountType: voucher.discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      discountAmount,
      finalAmount: Math.round((orderAmount - discountAmount) * 100) / 100,
    };
  }

  async redeem(code: string, userId: number, orderId: number, manager: EntityManager): Promise<void> {
    const voucher = await this.voucherRepository.findByCode(code.trim().toUpperCase());
    if (!voucher?.newMemberOnly) return;
    const repository = manager.getRepository(UserVoucher);
    const grant = await repository.findOne({
      where: { userId, voucherId: voucher.id, redeemedOrderId: IsNull() },
      lock: { mode: 'pessimistic_write' },
    });
    if (!grant) throw new BadRequestException('Mã thành viên mới đã được sử dụng');
    grant.redeemedOrderId = orderId;
    grant.redeemedAt = new Date();
    await repository.save(grant);
  }

  async remove(id: number): Promise<void> {
    const voucher = await this.findOne(id);
    await this.voucherRepository.remove(voucher);
  }
}
