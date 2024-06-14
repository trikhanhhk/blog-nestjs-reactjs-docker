import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReportDto {

  @ApiProperty()
  @IsEmpty()
  @IsNumber()
  dataId: number;


  @ApiProperty()
  @IsEmpty()
  @IsNumber()
  reason: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;

}