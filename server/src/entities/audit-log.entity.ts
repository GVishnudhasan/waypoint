import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  event_id: string;

  @Column()
  actor_name: string; // organizer name who performed action

  @Column()
  action: string; // e.g. SUSPEND_USER, BAN_USER, CREATE_ZONE, UPDATE_PERMISSIONS

  @Column({ type: 'text', nullable: true })
  details: string; // previous value vs new value JSON

  @CreateDateColumn()
  created_at: Date;
}
