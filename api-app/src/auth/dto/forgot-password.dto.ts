import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}