import { HttpException, HttpStatus, Injectable, HttpServer, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EmailService } from 'src/email/email.service';
import { MailConstants } from 'src/Constants/MailConstants';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly cache;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore
  ) {
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const checkEmailExisted = await this.userRepository.findOneBy({ email: registerUserDto.email });

    if (checkEmailExisted) {
      throw new HttpException("Email already existed", HttpStatus.CONFLICT)
    }

    const hashPassword = await this.hashPassword(registerUserDto.password);
    const newUser = await this.userRepository.save({
      ...registerUserDto,
      password: hashPassword,
      flagFirst: false
    });

    const userName = `${newUser.first_name} ${newUser.last_name}`;

    this.emailService.sendMail(
      newUser.email,
      `[Chào mừng người dùng mới: ${userName}]`,
      MailConstants.TEMPLATE_MAIL_WELCOME_NEW_USER_REGISTER_FORM,
      {
        urlProfile: `${MailConstants.URL_PROFILE}${newUser.id}`,
        userName
      }
    );

    return newUser;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<{ userData: object, accessToken: string, refreshToken: string }> {
    const data = await this.userRepository
      .createQueryBuilder('user')
      .select(['user'])
      .where('user.email = :email', { email: loginUserDto.email })
      .getOne();

    if (!data) {
      throw new HttpException('Email không tồn tại', HttpStatus.UNAUTHORIZED);
    }

    const { password, refresh_token, ...user } = data;

    if (user.isDelete === 1) {
      throw new HttpException('Tài khoản đã bị xóa khỏi hệ thống, vui lòng liên hệ quản trị viên để được xử lý', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = bcrypt.compareSync(loginUserDto.password, password);

    if (!isMatch) {
      throw new HttpException('Mật khẩu không đúng', HttpStatus.UNAUTHORIZED);
    }

    const [accessToken, refreshToken] = await this.generateJwtToken({
      id: user.id,
      email: user.email,
    });

    return { userData: user, accessToken, refreshToken };
  }

  async refreshToken(refresh_token_client: string): Promise<any> {
    const verify_token = await this.jwtService.verifyAsync(refresh_token_client, {
      secret: process.env.JWT_SECRET,
    });

    if (!verify_token) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token_existed = await this.userRepository.findOneBy({
      id: verify_token.id,
      refresh_token: refresh_token_client,
    });

    if (!token_existed) {
      throw new HttpException(
        'Refesh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { password, refresh_token, ...user } = await this.userRepository
      .createQueryBuilder('user')
      .select(['user'])
      .where('user.email = :email', { email: verify_token.email })
      .getOne();

    if (user.isDelete === 1) {
      throw new HttpException('Tài khoản đã bị xóa khỏi hệ thống, vui lòng liên hệ quản trị viên để được xử lý', HttpStatus.UNAUTHORIZED);
    }

    const [accessToken, refreshToken] = await this.generateJwtToken({
      id: verify_token.id,
      email: verify_token.email,
    });

    return { userData: user, accessToken, refreshToken };
  }

  private async generateJwtToken(payload: { id: number; email: string }): Promise<[accessToken: string, refreshToken: string]> {
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET + '',
      expiresIn: process.env.JWT_EXP_IN_REFRESH_TOKEN + '',
    });

    await this.userRepository.update(
      { id: payload.id },
      { refresh_token: refreshToken },
    );

    return [accessToken, refreshToken];
  }

  async getUserDataFromGoogle(accessTokenGoogle: string): Promise<any> {
    const url = process.env.GOOGLE_INFO_URL;
    const { data } = await firstValueFrom(this.httpService.get(url, {
      headers: {
        Authorization: `Bearer ${accessTokenGoogle}`
      }
    }));

    const emailUser = (data as any).email;

    const checkExistedUser = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.first_name', 'user.last_name', 'user.career', 'user.flagFirst', 'user.dateOfBirth', 'user.gender', 'user.avatarPath', 'user.role', 'user.status', 'user.isDelete'])
      .where('user.email = :email', { email: emailUser })
      .getOne();

    let user = null;
    let [accessToken, refreshToken] = [null, null];
    if (checkExistedUser) { //nếu tồn tại user trong hệ thống

      if (checkExistedUser.isDelete === 1) {
        throw new HttpException('Tài khoản đã bị xóa khỏi hệ thống, vui lòng liên hệ quản trị viên để được xử lý', HttpStatus.UNAUTHORIZED);
      }
      [accessToken, refreshToken] = await this.generateJwtToken({ id: checkExistedUser.id, email: checkExistedUser.email });
      user = checkExistedUser;


    } else { // chưa tồn tại user trong hệ thống -> thêm vào hệ thống
      const newUser = await this.userRepository.save({

        email: emailUser,
        first_name: data.family_name,
        last_name: data.given_name,
        password: Math.random().toString(36).slice(-8),
        flagFirst: true

      });

      const userName = `${newUser.first_name} ${newUser.last_name}`;

      this.emailService.sendMail(
        newUser.email,
        `[Chào mừng người dùng mới: ${userName}]`,
        MailConstants.TEMPLATE_MAIL_WELCOME_NEW_USER_REGISTER_GOOGLE,
        {
          urlProfile: `${MailConstants.URL_PROFILE}${newUser.id}`,
          userName
        }
      );

      if (newUser) {
        user = newUser;
        [accessToken, refreshToken] = await this.generateJwtToken({ id: newUser.id, email: newUser.email });
      }
    }

    const { password, refresh_token, ...userData } = user;

    return { userData: userData, accessToken, refreshToken };;
  }

  async forgotPassword(email: string) {
    const checkUserExisted = await this.userRepository.findOneBy({
      email
    })

    if (!checkUserExisted) {
      throw new HttpException('Email không tồn tại', HttpStatus.NOT_FOUND);
    }

    const resetToken = this.generateRandomToken(10);

    const userName = `${checkUserExisted.first_name} ${checkUserExisted.last_name}`;
    await this.cacheManager.set(`forgotPassword:${checkUserExisted.id}`, resetToken, { ttl: 1800 });
    this.emailService.sendMail(
      checkUserExisted.email,
      `[Quên mật khẩu]`,
      MailConstants.TEMPLATE_MAIL_FORGOT_PASSWORD,
      {
        userName: userName,
        appName: "VIBLO",
        resetToken: resetToken
      }
    );

    return { email, userId: checkUserExisted.id };

  }

  private generateRandomToken(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    console.log("token---------------------", token);
    return token;
  }

  async validateTokenResetPassword(userId: number, resetToken: string, newPassword: string): Promise<{ userData: object, accessToken: string, refreshToken: string }> {
    const token = await this.cacheManager.get(`forgotPassword:${userId}`);

    if (resetToken != token) {
      throw new HttpException("Mã không chính xác hoặc đã hết hạn", HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await this.hashPassword(newPassword);

    const oldUser = await this.userRepository.findOneBy({ id: userId });

    const { password, refresh_token, ...user } = await this.userRepository.save({
      ...oldUser,
      password: hashPassword
    });


    const [accessToken, refreshToken] = await this.generateJwtToken({
      id: user.id,
      email: user.email,
    });

    return { userData: user, accessToken, refreshToken };
  }
}
