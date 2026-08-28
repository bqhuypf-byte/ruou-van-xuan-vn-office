import { Injectable, NotFoundException } from '@nestjs/common';
import { assignDefined } from '../../shared/utils/assign-defined.util';
import { BannerRepository } from './repositories/banner.repository';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner } from './entities/banner.entity';

@Injectable()
export class BannerService {
  constructor(private readonly bannerRepository: BannerRepository) {}

  findActive(): Promise<Banner[]> {
    return this.bannerRepository.findActiveSorted();
  }

  findAll(): Promise<Banner[]> {
    return this.bannerRepository.findAllSorted();
  }

  async create(dto: CreateBannerDto): Promise<Banner> {
    const banner = this.bannerRepository.create(dto);
    return this.bannerRepository.save(banner);
  }

  async update(id: number, dto: UpdateBannerDto): Promise<Banner> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException(`Banner #${id} not found`);
    }
    assignDefined(banner, dto);
    return this.bannerRepository.save(banner);
  }

  async remove(id: number): Promise<void> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException(`Banner #${id} not found`);
    }
    await this.bannerRepository.remove(banner);
  }
}
