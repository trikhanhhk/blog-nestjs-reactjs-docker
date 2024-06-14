import { Module } from '@nestjs/common';
import { SliderService } from './slider.service';
import { SliderController } from './slider.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Slider } from './entities/slider.entity';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Slider]),
    ConfigModule
  ],
  controllers: [SliderController],
  providers: [SliderService, S3Service],
})
export class SliderModule { }
