import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSeriesDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

}
