import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { ConfigModule } from '@nestjs/config';
import { SeriesVote } from './entities/series-vote.entity';
import { SeriesSocketGateway } from './series-socket.gateway';
import { SeriesReport } from './entities/series-report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Series, SeriesVote, SeriesReport]),
    ConfigModule
  ],
  controllers: [SeriesController],
  providers: [SeriesService, SeriesSocketGateway],
})
export class SeriesModule { }