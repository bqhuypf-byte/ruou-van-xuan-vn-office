import { ArrayMaxSize, ArrayMinSize, IsInt } from 'class-validator';

export class ReorderIdsDto {
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  ids: number[];
}
