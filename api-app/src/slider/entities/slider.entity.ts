import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("slider")
export class Slider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ default: 'off' })
  status: "on" | "off";

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
