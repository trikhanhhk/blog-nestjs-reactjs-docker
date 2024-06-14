import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { BaseQuery } from "./BaseQuery.dto";

export class ReportQuery extends BaseQuery {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  articleId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  commentId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  status: number;
}