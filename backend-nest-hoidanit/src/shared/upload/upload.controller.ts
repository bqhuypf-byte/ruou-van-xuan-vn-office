import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

@Controller('admin/uploads')
export class UploadController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: MAX_IMAGE_SIZE },
      fileFilter: (_req, file, callback) => {
        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              'Chỉ chấp nhận file ảnh JPEG, PNG hoặc WebP',
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn một file ảnh');
    }
    return { url: `/uploads/${file.filename}` };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: MAX_VIDEO_SIZE },
      fileFilter: (_req, file, callback) => {
        if (!ALLOWED_VIDEO_MIME_TYPES.includes(file.mimetype)) {
          callback(
            new BadRequestException('Chỉ chấp nhận file video MP4, WebM hoặc OGG'),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  uploadVideo(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn một file video');
    }
    return { url: `/uploads/${file.filename}` };
  }
}
