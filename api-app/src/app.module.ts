import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserFollower } from './user/userFollower.entity';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ExceptionsLoggerFilter } from './untils/exceptionsLogger.filter';
import { LoggerModule } from './logger/logger.module';
import { ImageItem } from './user/image.entity';
import { TagModule } from './tag/tag.module';
import { SeriesModule } from './series/series.module';
import { ArticlesModule } from './articles/articles.module';
import { Tag } from './tag/entities/tag.entity';
import { Series } from './series/entities/series.entity';
import { Article } from './articles/entities/article.entity';
import { CommentSocketModule } from './comment-socket/comment-socket.module';
import { Comment } from './comment-socket/entities/comment-socket.entity';
import { CommentVote } from './comment-socket/entities/comment-vote.entity';
import { ArticleVote } from './articles/entities/article-vote.entity';
import { Slider } from './slider/entities/slider.entity';
import { SliderModule } from './slider/slider.module';
import { S3Module } from './s3/s3.module';
import { SeriesVote } from './series/entities/series-vote.entity';
import { RolesGuard } from './auth/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { ArticleReport } from './articles/entities/article-report.entity';
import { CommentReport } from './comment-socket/entities/comment-report.entity';
import { SeriesReport } from './series/entities/series-report.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailModule } from './email/email.module';
import { BullModule } from '@nestjs/bull';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { NotificationModule } from './notification/notification.module';
import { Notification } from './notification/entities/notification.entity';

@Module({
  imports:
    [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ['.env.dev'],
      }),

      //config for connect database use postgres and typeorm
      TypeOrmModule.forRoot(
        {
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: +process.env.DATABASE_PORT,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities:
            [
              User, UserFollower, ImageItem, Tag, Article, Series, Comment,
              CommentVote, ArticleVote, Slider, SeriesVote, ArticleReport, CommentReport, SeriesReport,
              Notification
            ],
          migrations: ['src/db/migration/*{.ts,.js}'],
          synchronize: true,
          logging: false,
        }
      ),

      //config for mail smtp
      MailerModule.forRoot({
        transport: `smtp://${process.env.MAIL_HOST}:${process.env.MAIL_PORT}`,
        defaults: {
          from: `"nest-modules" <${process.env.MAIL_USER}>`,
        },
        template: {
          dir: __dirname + '/templates/mail',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),

      // config for Redis cache and queues
      BullModule.forRoot({
        redis: {
          host: 'redis',

          port: 6379,
        },
      }),

      CacheModule.registerAsync({
        isGlobal: true,
        useFactory: async () => ({
          store: (await redisStore({
            url: "redis://redis:6379",
          })) as unknown as CacheStore,
        }),
      }),

      AuthModule,
      UserModule,
      ConfigModule.forRoot(),
      LoggerModule,
      ArticlesModule,
      TagModule,
      SeriesModule,
      CommentSocketModule,
      SliderModule,
      S3Module,
      TypeOrmModule.forFeature([User]),
      EmailModule,
      NotificationModule,
    ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    },

    {
      provide: APP_GUARD,
      useClass: AuthGuard //use for Authorize
    },

    {
      provide: APP_GUARD,
      useClass: RolesGuard //use for ROLE user
    }
  ]
})
export class AppModule { }
