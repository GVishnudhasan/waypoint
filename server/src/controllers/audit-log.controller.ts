import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogService } from '../services/audit-log.service';
import { AuditLog } from '../entities/audit-log.entity';

@Controller('api/audit-logs')
export class AuditLogController {
  constructor(private auditLogService: AuditLogService) {}

  @Get()
  async getLogs(@Query('event_id') eventId: string): Promise<AuditLog[]> {
    return this.auditLogService.getLogs(eventId || 'default');
  }
}
