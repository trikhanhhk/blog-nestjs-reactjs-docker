import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'recipient_id', type: 'integer', nullable: true })
  recipientId: number;  // id nguoi nhan

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'content_detail', type: 'text', default: null })
  contentDetail: string

  @Column({ name: 'related_id', type: 'integer' })
  relatedId: number;  //id chuyen huong

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  // loại đối tượng nhận (recipient_type) để xác định loại đối tượng nhận
  @Column({ name: 'recipient_type', type: 'varchar', length: 50, default: null, nullable: true })
  recipientType: string;
}
