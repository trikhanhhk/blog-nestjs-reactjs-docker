import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article.entity";

@Entity('article_vote')
export class ArticleVote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @ManyToOne(() => User, user => user.userArticleVotes, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "article_id" })
  articleId: number;

  @ManyToOne(() => Article, article => article.articleVotes, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "article_id" })
  article: Article;

  @Column()
  voteType: 'upvote' | 'downvote';

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}