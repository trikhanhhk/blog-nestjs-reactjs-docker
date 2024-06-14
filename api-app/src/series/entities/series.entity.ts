
import { Article } from "src/articles/entities/article.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SeriesVote } from "./series-vote.entity";
import { SeriesReport } from "./series-report.entity";

@Entity('series')
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Article, article => article.series, { nullable: true })
  articles: Article[];

  @Column()
  authorId: number;

  @Column({ default: 0 })
  view: number;

  @Column({ default: 0, name: "up_vote" })
  vote: number;

  @ManyToOne(() => User, user => user.series)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => SeriesVote, seriesVote => seriesVote.series)
  seriesVote: SeriesVote[];

  @OneToMany(() => SeriesReport, seriesReport => seriesReport.series)
  seriesReports: SeriesReport[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

}