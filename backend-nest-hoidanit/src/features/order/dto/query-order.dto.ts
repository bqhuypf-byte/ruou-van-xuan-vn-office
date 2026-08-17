import { IsOptional, IsString } from 'class-validator';

export class QueryOrderDto {
  @IsOptional()
  @IsString()
  status?: string;
}
