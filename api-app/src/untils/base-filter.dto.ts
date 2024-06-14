import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class BaseFilter {
  @ApiProperty()
  @IsOptional()
  itemPerPage: number;

  @ApiProperty()
  @IsOptional()
  page: number;

  @ApiProperty()
  @IsOptional()
  search: string;

  @ApiProperty()
  @IsOptional()
  userId: number;

  @ApiProperty()
  @IsOptional()
  tag: number;

  @ApiProperty()
  @IsOptional()
  articleId: number

  @ApiProperty()
  @IsOptional()
  seriesId: number;

  @ApiProperty()
  @IsOptional()
  isParent: boolean;

  @ApiProperty()
  @IsOptional()
  parentId: number;

  @ApiProperty()
  @IsOptional()
  notIn: string;

  @IsOptional()
  status: 1 | 2;
}