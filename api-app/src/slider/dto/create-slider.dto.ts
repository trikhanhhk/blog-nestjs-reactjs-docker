import { IsNotEmpty, IsOptional, IsString, IsUrl, IsNumber, IsEnum } from 'class-validator';

export class CreateSliderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  link?: string;

  @IsOptional()
  @IsEnum(['on', 'off'])
  status?: "on" | "off";
}
