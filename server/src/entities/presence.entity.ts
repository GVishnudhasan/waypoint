import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('presence')
export class Presence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.presences)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: 'offline' })
  status: string; // available | busy | offline

  @Column({ nullable: true })
  zone: string; // Main Hall | Coffee Lounge | Expo Hall | Workshop Area | Networking Area

  @Column({ type: 'text', nullable: true })
  topics: string; // comma-separated

  @Column({ nullable: true })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
