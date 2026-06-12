import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  event_id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'talk' })
  type: string; // keynote | talk | workshop | panel | meetup

  @Column({ nullable: true })
  zone_name: string; // checked-in venue zone location

  @Column({ nullable: true })
  speaker_id: string;

  @Column({ nullable: true })
  moderator_id: string;

  @Column({ nullable: true })
  start_time: Date;

  @Column({ nullable: true })
  end_time: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'speaker_id' })
  speaker: User;

  @CreateDateColumn()
  created_at: Date;
}
