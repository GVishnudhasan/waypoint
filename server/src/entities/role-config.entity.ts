import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('role_configs')
export class RoleConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  event_id: string;

  @Column()
  name: string; // e.g. Speaker, Attendee, Moderator

  @Column({ type: 'simple-json', nullable: true })
  permissions: string[]; // ['create_sessions', 'manage_slides', 'moderate_users', 'view_analytics']

  @CreateDateColumn()
  created_at: Date;
}
