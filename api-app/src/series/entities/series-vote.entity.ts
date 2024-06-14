import { User } from "src/user/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Series } from "./series.entity";

@Entity('series_vote')
export class SeriesVote {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @ManyToOne(() => User, user => user.userSeriesVote, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Index()
  @Column({ name: "series_id" })
  seriesId: number;

  @ManyToOne(() => Series, series => series.seriesVote, { nullable: true })
  @JoinColumn({ name: "series_id" })
  series: Series;

  @Column()
  voteType: 'upvote' | 'downvote';

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}