import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { PageRepository } from './repositories/page.repository';
import { Page } from './entities/page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Page])],
  controllers: [PageController],
  providers: [PageService, PageRepository],
  exports: [PageService],
})
export class PageModule {}
