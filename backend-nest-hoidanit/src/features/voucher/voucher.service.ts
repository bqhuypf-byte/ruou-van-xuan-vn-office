import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { VoucherRepository } from './repositories/voucher.repository';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './entities/voucher.entity';

@Injectable()
export class VoucherService {
  constructor(private readonly voucherRepository: VoucherRepository) {}

  findActive(): Promise<Voucher[]> {
    return this.voucherRepository.findActiveSorted();
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
        dto.maxDiscountAmount !== undefined ? dto.maxDiscountAmount.toFixed(2) : null,
      startDate: dto.startDate ?? null,
      endDate: dto.endDate ?? null,
      sortOrder: dto.sortOrder ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.voucherRepository.save(voucher);
  }

  async update(id: number, dto: UpdateVoucherDto): Promise<Voucher> {
    const voucher = await this.findOne(id);
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
    if (dto.discountValue !== undefined) voucher.discountValue = dto.discountValue.toFixed(2);
    if (dto.minOrderAmount !== undefined) voucher.minOrderAmount = dto.minOrderAmount.toFixed(2);
    if (dto.maxDiscountAmount !== undefined)
      voucher.maxDiscountAmount = dto.maxDiscountAmount.toFixed(2);
    if (dto.startDate !== undefined) voucher.startDate = dto.startDate;
    if (dto.endDate !== undefined) voucher.endDate = dto.endDate;
    if (dto.sortOrder !== undefined) voucher.sortOrder = dto.sortOrder;
    if (dto.isActive !== undefined) voucher.isActive = dto.isActive;

    return this.voucherRepository.save(voucher);
  }

  async remove(id: number): Promise<void> {
    const voucher = await this.findOne(id);
    await this.voucherRepository.remove(voucher);
  }
}
