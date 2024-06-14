import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserFollower } from './userFollower.entity';
import { ImageItem } from './image.entity';
import { Series } from 'src/series/entities/series.entity';
import { Article } from 'src/articles/entities/article.entity';
import { Comment } from 'src/comment-socket/entities/comment-socket.entity';
import { ArticleVote } from 'src/articles/entities/article-vote.entity';
import { CommentVote } from 'src/comment-socket/entities/comment-vote.entity';
import { SeriesVote } from 'src/series/entities/series-vote.entity';
import { ArticleReport } from 'src/articles/entities/article-report.entity';
import { SeriesReport } from 'src/series/entities/series-report.entity';
import { CommentReport } from 'src/comment-socket/entities/comment-report.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, length: 255 })
  email: string;

  @Column({ nullable: false, length: 255 })
  first_name: string;

  @Column({ nullable: false, length: 255 })
  last_name: string;

  @Column({ nullable: true })
  avatarPath: string;

  @Column({ nullable: false, length: 255 })
  password: string;

  @Column({ default: 1 })
  gender: 1 | 2 | 3;  // 1: man, 2: woman, 3 undefine :)))

  @Column({ name: "flag_first", default: false })
  flagFirst: boolean;

  @Column({ default: "USER" })
  role: "USER" | "ADMIN" | "POST_ADMIN";

  @Column({ default: null, nullable: true })
  maxim: string;

  @Column({ nullable: true, length: 255 })
  career: string;

  @Column({ default: null, name: "facebook_link" })
  facebookLink: string

  @Column({ default: null, name: "discord_link" })
  discordLink: string

  @Column({ default: null, name: "github_link" })
  githubLink: string


  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: false, default: 1 })
  status: 0 | 1;

  @Column({ nullable: true, name: "date_of_birth" })
  dateOfBirth: Date;

  @Column({ nullable: false, default: 0, name: "is_delete" })
  isDelete: 0 | 1;

  @OneToMany(() => UserFollower, follower => follower.follower)
  following: UserFollower[];

  @OneToMany(() => UserFollower, follow => follow.following)
  followers: UserFollower[];

  @OneToMany(() => ImageItem, image => image.author)
  images: ImageItem[];

  @OneToMany(() => Series, series => series.author)
  series: Series[];

  @OneToMany(() => Article, article => article.author)
  articles: Article[];

  @OneToMany(() => ArticleVote, articleVote => articleVote.user, { nullable: true })
  userArticleVotes: ArticleVote[];

  @OneToMany(() => CommentVote, commentVote => commentVote.user, { nullable: true })
  userCommentVotes: CommentVote[];

  @OneToMany(() => SeriesVote, seriesVote => seriesVote.user, { nullable: true })
  userSeriesVote: SeriesVote[];

  @OneToMany(() => Comment, comment => comment.author, { nullable: true })
  comments: Comment[];

  // for report
  @OneToMany(() => ArticleReport, articleReport => articleReport.author, { nullable: true })
  articleReports: ArticleReport[];

  @OneToMany(() => SeriesReport, seriesReport => seriesReport.author, { nullable: true })
  seriesReports: SeriesReport[];

  @OneToMany(() => CommentReport, commentReport => commentReport.author, { nullable: true })
  commentReports: CommentReport[];


  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", name: "created_at" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)", name: "updated_at" })
  public updatedAt: Date;
}