import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('outbox_events')
export class OutboxEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  event_type: string; // USER_AVAILABLE, CONNECTION_REQUESTED, MISSION_COMPLETED

  @Column({ type: 'simple-json' })
  payload: any;

  @Column({ default: 'pending' })
  status: string; // pending | processed | failed

  @CreateDateColumn()
  created_at: Date;
}
