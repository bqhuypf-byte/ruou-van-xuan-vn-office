import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './features/auth/auth.module';
import { RolesModule } from './features/roles/roles.module';
import { UsersModule } from './features/users/users.module';
import { UserProfileModule } from './features/user-profile/user-profile.module';
import { ProductModule } from './features/product/product.module';
import { CartModule } from './features/cart/cart.module';
import { OrderModule } from './features/order/order.module';
import { ReviewModule } from './features/review/review.module';
import { SiteContentModule } from './features/site-content/site-content.module';
import { BannerModule } from './features/banner/banner.module';
import { BrandModule } from './features/brand/brand.module';
import { SiteSettingsModule } from './features/site-settings/site-settings.module';
import { FaqModule } from './features/faq/faq.module';
import { PageModule } from './features/page/page.module';
import { VoucherModule } from './features/voucher/voucher.module';
import { HomepageSectionModule } from './features/homepage-sections/homepage-section.module';
import { UploadModule } from './shared/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    RolesModule,
    UsersModule,
    AuthModule,
    UserProfileModule,
    ProductModule,
    CartModule,
    OrderModule,
    ReviewModule,
    SiteContentModule,
    BannerModule,
    BrandModule,
    SiteSettingsModule,
    FaqModule,
    PageModule,
    VoucherModule,
    HomepageSectionModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
