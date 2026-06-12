import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('recommendations')
@Index(['user_id', 'target_type'])
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  target_id: string;

  @Column()
  target_type: string; // user | session | sponsor

  @Column({ type: 'float', default: 0 })
  score: number;

  @Column({ type: 'simple-json', nullable: true })
  reasons: string[];

  @CreateDateColumn()
  created_at: Date;
}
