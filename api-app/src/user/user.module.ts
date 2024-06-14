import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { ImageItem } from './image.entity';
import { UserFollower } from './userFollower.entity';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ImageItem, UserFollower]),
    ConfigModule
  ],
  controllers: [UserController],
  providers: [UserService, S3Service],
  exports: [UserService]
})
export class UserModule { }
