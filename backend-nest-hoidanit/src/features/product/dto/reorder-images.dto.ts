import { ArrayMinSize, ArrayUnique, IsArray, IsInt } from 'class-validator';

export class ReorderImagesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsInt({ each: true })
  imageIds: number[];
}
