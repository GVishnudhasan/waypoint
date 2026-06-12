import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('event_config')
export class EventConfig {
  @PrimaryColumn()
  id: string;

  @Column({ default: 'Waypoint Summit' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  is_active: boolean; // Conference is active and ready for participants

  @Column({ type: 'simple-json', nullable: true })
  allowed_roles: string[]; // ['speaker', 'moderator', 'panelist', 'attendee']

  // Global Permissions/Policies
  @Column({ default: true })
  allow_connections: boolean;

  @Column({ default: true })
  allow_presence: boolean;

  @Column({ default: true })
  allow_ai_matching: boolean;

  @Column({ default: true })
  allow_registration: boolean;

  @Column({ default: true })
  allow_messaging: boolean;

  @Column({ default: true })
  allow_sponsor_discovery: boolean;

  @Column({ default: true })
  allow_session_recs: boolean;

  @Column({ nullable: true })
  logo: string;

  @Column({ default: '#6366F1' })
  theme_color: string;

  @Column({ default: 'UTC' })
  timezone: string;

  @Column({ nullable: true })
  dates: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
