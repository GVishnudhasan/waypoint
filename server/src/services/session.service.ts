import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepo: Repository<Session>,
  ) {}

  async listSessions(eventId: string): Promise<Session[]> {
    return this.sessionsRepo.find({
      where: { event_id: eventId },
      order: { start_time: 'ASC' },
      relations: { speaker: true },
    });
  }

  async createSession(data: Partial<Session>): Promise<Session> {
    const session = this.sessionsRepo.create(data);
    return this.sessionsRepo.save(session);
  }

  async updateSession(id: string, data: Partial<Session>): Promise<Session> {
    await this.sessionsRepo.update(id, data);
    const updated = await this.sessionsRepo.findOne({ where: { id }, relations: { speaker: true } });
    if (!updated) throw new Error('Session not found');
    return updated;
  }

  async deleteSession(id: string): Promise<void> {
    await this.sessionsRepo.delete(id);
  }
}
