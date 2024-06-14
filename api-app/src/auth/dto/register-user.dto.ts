import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
  @ApiProperty()
  @IsEmail({}, { message: "Email not valid" })
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: "First name must be not empty" })
  first_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Last name must be not empty" })
  last_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Password must be not empty" })
  @MinLength(6, { message: "Passwords must be at least 6 characters" })
  password: string;
}