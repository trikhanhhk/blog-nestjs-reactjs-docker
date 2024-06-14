import { Article } from "src/articles/entities/article.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  tagName: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  tagType: number; // 1: Thường, 2: Kỹ năng

  @Column({ name: "number_use", default: 0 })
  numberUse: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToMany(() => Article, (article) => article.tags, { cascade: false })
  @JoinTable({ name: 'article_tag' })
  articles: Article[];

}
