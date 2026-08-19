import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandRepository } from './repositories/brand.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  findActive(): Promise<Brand[]> {
    return this.brandRepository.findActiveSorted();
  }

  findAll(): Promise<Brand[]> {
    return this.brandRepository.findAllSorted();
  }

  async create(dto: CreateBrandDto): Promise<Brand> {
    const brand = this.brandRepository.create(dto);
    return this.brandRepository.save(brand);
  }

  async update(id: number, dto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    Object.assign(brand, dto);
    return this.brandRepository.save(brand);
  }

  async remove(id: number): Promise<void> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    await this.brandRepository.remove(brand);
  }
}
