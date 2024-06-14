import { Comment } from 'src/comment-socket/entities/comment-socket.entity';
import { Series } from 'src/series/entities/series.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleVote } from './article-vote.entity';
import { ArticleReport } from './article-report.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column()
  description: string;

  @Column({ default: '' })
  keyword: string;

  @Column({ default: 0 })
  view: number;

  @Column({ nullable: true })
  body: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ name: "up_vote", default: 0 })
  vote: number;

  @Column({ name: "count_comment", default: 0 })
  countComment: number;

  @Column()
  userId: number;

  @Column({ default: 1 })
  status: 1 | 2 //1: published; 2: ban

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({ name: 'userId' })
  author: User;

  @Column({ name: 'seriesId', nullable: true })
  seriesId: number;

  @Column({ name: 'number_oder', nullable: true })
  numberOder: number;

  @ManyToOne(() => Series, (series) => series.articles, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'seriesId' })
  series: Series;

  @ManyToMany(() => Tag, (tag) => tag.articles, { cascade: true })
  @JoinTable({ name: 'article_tag' })
  tags: Tag[];

  @OneToMany(() => Comment, comment => comment.article, { nullable: true, cascade: true })
  comments: Comment[];

  @OneToMany(() => ArticleVote, articleVote => articleVote.article, { nullable: true, cascade: true })
  articleVotes: ArticleVote[];

  @OneToMany(() => ArticleReport, articleReport => articleReport.article, { nullable: true, cascade: true })
  articleReports: ArticleReport[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
