import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from '../entities/connection.entity';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connection) private connRepo: Repository<Connection>,
  ) {}

  async create(data: Partial<Connection>): Promise<Connection> {
    const conn = this.connRepo.create(data);
    return this.connRepo.save(conn);
  }

  async findByUser(userId: string): Promise<Connection[]> {
    return this.connRepo.find({
      where: [{ sender_id: userId }, { receiver_id: userId }],
      relations: { sender: true, receiver: true },
      order: { created_at: 'DESC' },
    });
  }

  async findPending(userId: string): Promise<Connection[]> {
    return this.connRepo.find({
      where: { receiver_id: userId, status: 'pending' },
      relations: { sender: true },
      order: { created_at: 'DESC' },
    });
  }

  async accept(id: string): Promise<Connection> {
    await this.connRepo.update(id, { status: 'accepted' });
    return this.connRepo.findOne({ where: { id }, relations: { sender: true, receiver: true } }) as Promise<Connection>;
  }

  async decline(id: string): Promise<Connection> {
    await this.connRepo.update(id, { status: 'declined' });
    return this.connRepo.findOne({ where: { id } }) as Promise<Connection>;
  }

  async countByStatus(status: string): Promise<number> {
    return this.connRepo.count({ where: { status } });
  }

  async countToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.connRepo.createQueryBuilder('c')
      .where('c.created_at >= :today', { today })
      .getCount();
  }
}
