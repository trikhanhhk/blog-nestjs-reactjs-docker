import { forwardRef, Module } from '@nestjs/common';
import { CommentSocketService } from './comment-socket.service';
import { CommentSocketGateway } from './comment-socket.gateway';
import { CommentSocketController } from './comment-socket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Comment } from './entities/comment-socket.entity';
import { CommentVote } from './entities/comment-vote.entity';
import { CommentReport } from './entities/comment-report.entity';
import { ReportCommentController } from './report-comment.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { ArticlesModule } from 'src/articles/articles.module';
import { Article } from 'src/articles/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentVote, CommentReport, Article]),
    ConfigModule,
    forwardRef(() => NotificationModule),
    forwardRef(() => ArticlesModule),
  ],
  providers: [CommentSocketGateway, CommentSocketService],
  controllers: [CommentSocketController, ReportCommentController],
})
export class CommentSocketModule { }
