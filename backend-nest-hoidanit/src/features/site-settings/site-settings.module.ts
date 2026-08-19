import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSettingsController } from './site-settings.controller';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettingsRepository } from './repositories/site-settings.repository';
import { SiteSettings } from './entities/site-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettings])],
  controllers: [SiteSettingsController],
  providers: [SiteSettingsService, SiteSettingsRepository],
  exports: [SiteSettingsService],
})
export class SiteSettingsModule {}
