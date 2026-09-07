import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_REVIEW_IMAGE_SIZE = 5 * 1024 * 1024;

@Controller('uploads')
export class ReviewUploadController {
  @Post('review-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: MAX_REVIEW_IMAGE_SIZE },
      fileFilter: (_req, file, callback) => {
        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
          callback(
            new BadRequestException('Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP'),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  uploadReviewImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn một file ảnh');
    }
    return { url: `/uploads/${file.filename}` };
  }
}
