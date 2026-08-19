import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from '../entities/site-settings.entity';

@Injectable()
export class SiteSettingsRepository {
  constructor(
    @InjectRepository(SiteSettings)
    private readonly repository: Repository<SiteSettings>,
  ) {}

  findById(id: number): Promise<SiteSettings | null> {
    return this.repository.findOne({ where: { id } });
  }

  create(data: Partial<SiteSettings>): SiteSettings {
    return this.repository.create(data);
  }

  save(settings: SiteSettings): Promise<SiteSettings> {
    return this.repository.save(settings);
  }
}
