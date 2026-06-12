import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { EventConfig } from './event-config.entity';

@Entity('user_memberships')
export class UserMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  event_id: string;

  @Column({ default: 'attendee' })
  role: string; // attendee | organizer | speaker | moderator | sponsor | recruiter | volunteer

  @Column({ default: 'active' })
  status: string; // active | suspended | muted

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  company: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => EventConfig, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: EventConfig;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
