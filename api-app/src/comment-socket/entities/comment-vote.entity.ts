import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment-socket.entity";

@Entity('comment_vote')
export class CommentVote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id", nullable: true })
  userId: number;

  @ManyToOne(() => User, user => user.userCommentVotes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "comment_id", nullable: true })
  commentId: number;

  @ManyToOne(() => Comment, comment => comment.commentVotes)
  @JoinColumn({ name: "comment_id" })
  comment: Comment;

  @Column()
  voteType: 'upvote' | 'downvote' | '-';

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}