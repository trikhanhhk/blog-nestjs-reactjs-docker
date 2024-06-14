import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from 'src/email/email.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev']
    }),
    JwtModule.register(
      {
        global: true,
        secret: `${process.env.JWT_SECRET}`,
        signOptions: { expiresIn: `${process.env.JWT_EXT_IN_TOKEN}` }
      }
    ),
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    HttpModule,

    BullModule.registerQueue({
      name: 'mailing',
    }),
  ],
  providers: [AuthService, EmailService],
  controllers: [AuthController]
})
export class AuthModule { }
