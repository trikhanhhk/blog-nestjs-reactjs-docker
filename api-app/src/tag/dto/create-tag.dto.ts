import { IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  tagName: string;

  description: string;

  @IsNotEmpty()
  @IsNumber()
  tagType: number;
}
