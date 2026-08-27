import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomepageSectionController } from './homepage-section.controller';
import { HomepageSectionService } from './homepage-section.service';
import { HomepageSectionRepository } from './repositories/homepage-section.repository';
import { HomepageSectionItemRepository } from './repositories/homepage-section-item.repository';
import { HomepageSection } from './entities/homepage-section.entity';
import { HomepageSectionItem } from './entities/homepage-section-item.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HomepageSection, HomepageSectionItem]),
    ProductModule,
  ],
  controllers: [HomepageSectionController],
  providers: [
    HomepageSectionService,
    HomepageSectionRepository,
    HomepageSectionItemRepository,
  ],
  exports: [HomepageSectionService],
})
export class HomepageSectionModule {}
