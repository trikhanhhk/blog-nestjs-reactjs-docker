import { PartialType } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateUserDto {
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
  gender: 1 | 2 | 3;

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'Invalid Facebook link' })
  facebookLink?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'Invalid Discord link' })
  discordLink?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'Invalid Github link' })
  githubLink?: string;
}