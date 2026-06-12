import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.goals)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  goal_type: string; // hiring | job | networking | cofounder | customer | learning

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 5 })
  target_count: number;

  @Column({ default: 0 })
  current_count: number;

  @Column({ default: 5 })
  priority: number;

  @CreateDateColumn()
  created_at: Date;
}
