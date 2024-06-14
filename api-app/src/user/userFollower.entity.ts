import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("user_follower")
export class UserFollower {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'follower_id' })
    followerId: number;

    @ManyToOne(() => User, user => user.following)
    @JoinColumn({ name: 'follower_id' }) //người follow
    follower: User;

    @Column({ name: 'following_id' })
    followingId: number;

    @ManyToOne(() => User, user => user.followers)
    @JoinColumn({ name: 'following_id' })   //người được follow
    following: User;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

}