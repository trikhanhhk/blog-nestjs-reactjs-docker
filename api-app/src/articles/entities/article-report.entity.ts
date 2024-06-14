import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Article } from "./article.entity";
import { User } from "src/user/user.entity";

@Entity('article_report')
export class ArticleReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "reason", nullable: false })
  reason: number;  // 1: spam; 2: Vi phạm điều khoản; 3: Quấy rối; 4: Vi phạm bản quyền; 5: Bản dịch kém chất lượng

  @Column({ name: "note", nullable: true })
  note: string;

  @Column({ name: "status", nullable: false, default: 1 })
  status: number; // 1: chờ xử lý; 2: Gỡ bài; 3: không lỗi (bỏ qua, không xử lý)

  @Column({ name: "article_id", nullable: false })
  articleId: number;

  @ManyToOne(() => Article, article => article.articleReports, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: "article_id" })
  article: Article;

  @Column({ name: "author_id", nullable: false })
  authorId: number;

  @ManyToOne(() => User, user => user.articleReports)
  @JoinColumn({ name: "author_id" })
  author: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", name: "created_at" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)", name: "updated_at" })
  public updatedAt: Date;

}