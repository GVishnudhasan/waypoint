import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { SessionService } from '../services/session.service';
import { Session } from '../entities/session.entity';

@Controller('api/sessions')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Get()
  async listSessions(@Query('event_id') eventId: string): Promise<Session[]> {
    return this.sessionService.listSessions(eventId || 'default');
  }

  @Post()
  async createSession(@Body() data: Partial<Session>): Promise<Session> {
    return this.sessionService.createSession(data);
  }

  @Put(':id')
  async updateSession(@Param('id') id: string, @Body() data: Partial<Session>): Promise<Session> {
    return this.sessionService.updateSession(id, data);
  }

  @Delete(':id')
  async deleteSession(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.sessionService.deleteSession(id);
    return { success: true };
  }
}
