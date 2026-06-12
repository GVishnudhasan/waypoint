import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Goal } from './goal.entity';
import { Connection } from './connection.entity';
import { Presence } from './presence.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: 'default' })
  event_id: string;

  @Column({ default: 'attendee' })
  role: string; // attendee | organizer | admin | sponsor | speaker

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  company: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  linkedin_url: string;

  @Column({ nullable: true })
  github_url: string;

  @Column({ nullable: true })
  twitter_url: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'simple-json', nullable: true })
  skills: string[];

  @Column({ type: 'simple-json', nullable: true })
  interests: string[];

  @Column({ type: 'simple-json', nullable: true })
  ai_twin: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  embedding: number[];

  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];

  @OneToMany(() => Connection, (conn) => conn.sender)
  sentConnections: Connection[];

  @OneToMany(() => Connection, (conn) => conn.receiver)
  receivedConnections: Connection[];

  @OneToMany(() => Presence, (p) => p.user)
  presences: Presence[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
