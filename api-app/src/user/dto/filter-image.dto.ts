import { ApiProperty } from "@nestjs/swagger";

export class FilterImage {
  @ApiProperty()
  itemPerPage: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  userId: number;

}