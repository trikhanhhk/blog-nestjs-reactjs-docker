import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class BaseQuery {
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
  from: string | undefined | null;

  @ApiProperty()
  @IsOptional()
  to: string | undefined | null;
}