import { IsNumber, IsOptional, IsString } from "class-validator";

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  career?: string;

  @IsOptional()
  dateOfBirth: Date;

  @IsOptional()
  role: "USER" | "ADMIN" | "POST_ADMIN";

  @IsOptional()
  @IsNumber()
  status: 0 | 1

}