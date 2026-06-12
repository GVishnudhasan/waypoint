import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async logAction(eventId: string, actorName: string, action: string, details?: any): Promise<AuditLog> {
    const log = this.auditRepo.create({
      event_id: eventId,
      actor_name: actorName,
      action,
      details: details ? JSON.stringify(details) : undefined,
    });
    return this.auditRepo.save(log);
  }

  async getLogs(eventId: string): Promise<AuditLog[]> {
    return this.auditRepo.find({
      where: { event_id: eventId },
      order: { created_at: 'DESC' },
    });
  }
}
