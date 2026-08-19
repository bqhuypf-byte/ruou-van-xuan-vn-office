import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomepageContentController } from './homepage-content.controller';
import { HomepageContentService } from './homepage-content.service';
import { HomepageContentRepository } from './repositories/homepage-content.repository';
import { HomepageContent } from './entities/homepage-content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HomepageContent])],
  controllers: [HomepageContentController],
  providers: [HomepageContentService, HomepageContentRepository],
  exports: [HomepageContentService],
})
export class SiteContentModule {}
