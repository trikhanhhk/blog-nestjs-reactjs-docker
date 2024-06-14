import { ApiProperty } from '@nestjs/swagger';
export class BaseFilter {
  @ApiProperty()
  itemPerPage: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  search: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  isDelete: 0 | 1;

  @ApiProperty()
  status: 0 | 1;
}