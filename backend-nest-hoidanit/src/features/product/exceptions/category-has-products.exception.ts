import { BadRequestException } from '@nestjs/common';

export class CategoryHasProductsException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
