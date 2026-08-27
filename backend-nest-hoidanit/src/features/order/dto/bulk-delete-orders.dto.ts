import { ArrayMinSize, IsArray, IsInt } from 'class-validator';

export class BulkDeleteOrdersDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  ids: number[];
}
