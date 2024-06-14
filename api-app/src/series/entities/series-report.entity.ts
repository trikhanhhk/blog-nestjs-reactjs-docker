import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/user/user.entity";
import { Series } from "./series.entity";

@Entity('series_report')
export class SeriesReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "reason", nullable: false })
  reason: number;  // 1: spam; 2: Vi phạm điều khoản; 3: Quấy rối; 4: Vi phạm bản quyền; 5: Bản dịch kém chất lượng

  @Column({ name: "note", nullable: true })
  note: string;

  @Column({ name: "status", nullable: false, default: 1 })
  status: number; // 1: chờ xử lý; 2: Xử lý; 3: không lỗi (bỏ qua, không xử lý)

  @Column({ name: "series_id", nullable: false })
  seriesId: number;

  @ManyToOne(() => Series, series => series.seriesReports)
  series: Series;

  @Column({ name: "author_id", nullable: false })
  authorId: number;

  @ManyToOne(() => User, user => user.seriesReports)
  @JoinColumn({ name: "author_id" })
  author: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", name: "created_at" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)", name: "updated_at" })
  public updatedAt: Date;

}