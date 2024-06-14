import { Article } from "src/articles/entities/article.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentVote } from "./comment-vote.entity";
import { CommentReport } from "./comment-report.entity";

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'article_id', nullable: true })
  articleId: number;

  @ManyToOne(() => Article, article => article.comments, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @Column({ name: 'content', length: 255, nullable: true })
  content: string;

  @Column({ name: 'up_vote', nullable: true, default: 0 })
  vote: number;

  @OneToMany(() => CommentVote, commentVote => commentVote.comment, { nullable: true, cascade: true })
  commentVotes: CommentVote[];

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @Column({ default: 1 })
  status: number; //1: publish; 2: hide

  @ManyToOne(() => User, user => user.comments)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ManyToOne(() => Comment, comment => comment.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @OneToMany(() => Comment, comment => comment.parent, { nullable: true, cascade: true })
  children: Comment[];

  @OneToMany(() => CommentReport, commentReport => commentReport.comment, { nullable: true, cascade: true })
  commentReports: Comment[];
}
