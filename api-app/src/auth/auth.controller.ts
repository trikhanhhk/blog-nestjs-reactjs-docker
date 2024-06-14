import { Body, Controller, Post, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ExceptionsLoggerFilter } from 'src/untils/exceptionsLogger.filter';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/base-response.dto';
import { Public } from './decorator/public.decorator';

@ApiTags('Auth')
@Controller('api/v1/auth')
@UseFilters(ExceptionsLoggerFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post("login")
  @Public()
  @UseFilters(ExceptionsLoggerFilter)
  @ApiResponse({ status: 201, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async login(@Body() loginUserDto: LoginUserDto): Promise<BaseResponse<any>> {
    const data = await this.authService.loginUser(loginUserDto);
    return new BaseResponse(data);
  }

  @Post("register")
  @Public()
  @UsePipes(ValidationPipe)
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { password, refresh_token, ...data } = await this.authService.registerUser(registerUserDto);
    return new BaseResponse<any>(data);
  }

  @Post("refresh-token")
  @Public()
  async refreshToken(@Body() { refresh_token }) {
    console.log('refresh_token', refresh_token);
    return new BaseResponse<any>(await this.authService.refreshToken(refresh_token));
  }

  @Post("forgotPassword")
  @Public()
  async forgotPassword(@Body() { emailAddress }) {
    return new BaseResponse<{ email: string, userId: number }>(await this.authService.forgotPassword(emailAddress))
  }

  @Post("forgotPassword/newPass")
  @Public()
  async validateResetToken(@Body() { resetToken, userId, newPassword }) {
    return new BaseResponse<any>(await this.authService.validateTokenResetPassword(userId, resetToken, newPassword))
  }

  @Post("google-auth")
  @Public()
  async loginGoogleAuth(@Body() googleToken: { token: string }) {

    return new BaseResponse<any>(await this.authService.getUserDataFromGoogle(googleToken.token));

  }

}
