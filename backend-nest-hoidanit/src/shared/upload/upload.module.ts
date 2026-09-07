import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { ReviewUploadController } from './review-upload.controller';

@Module({
  controllers: [UploadController, ReviewUploadController],
})
export class UploadModule {}
