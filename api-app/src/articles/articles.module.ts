import { forwardRef, Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Article } from './entities/article.entity';
import { ImageItem } from 'src/user/image.entity';
import { TagService } from 'src/tag/tag.service';
import { Tag } from 'src/tag/entities/tag.entity';
import { ArticleVote } from './entities/article-vote.entity';
import { ArticleSocketGateway } from './article-socket.gateway';
import { S3Service } from 'src/s3/s3.service';
import { ArticleReport } from './entities/article-report.entity';
import { ArticlesReportController } from './report-article.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';
import { Comment } from 'src/comment-socket/entities/comment-socket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, ImageItem, Tag, ArticleVote, ArticleReport, Comment]),
    ConfigModule,
    forwardRef(() => NotificationModule),
    forwardRef(() => UserModule)
  ],
  controllers: [ArticlesController, ArticlesReportController],
  providers: [ArticlesService, TagService, ArticleSocketGateway, S3Service],

  exports: [ArticlesService]
})
export class ArticlesModule { }
