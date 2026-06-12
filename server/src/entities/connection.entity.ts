import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('connections')
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sender_id: string;

  @Column()
  receiver_id: string;

  @ManyToOne(() => User, (user) => user.sentConnections)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedConnections)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @Column({ default: 'pending' })
  status: string; // pending | accepted | declined

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'text', nullable: true })
  conversation_starter: string;

  @CreateDateColumn()
  created_at: Date;
}
