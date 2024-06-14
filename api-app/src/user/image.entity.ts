import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('images')
export class ImageItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  isAvatar: number;

  @ManyToOne(() => User, user => user.images)
  @JoinColumn({ name: 'userId' })
  author: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updatedAt: Date;
}