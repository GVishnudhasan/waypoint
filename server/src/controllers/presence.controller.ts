import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PresenceService } from '../services/presence.service';
import { EventsGateway } from '../gateways/events.gateway';

@Controller('api/presence')
export class PresenceController {
  constructor(
    private presenceService: PresenceService,
    private eventsGateway: EventsGateway,
  ) {}

  @Get('zones')
  async getZoneStats(@Query('event_id') eventId?: string) {
    return this.presenceService.getZoneStats(eventId || 'default');
  }

  @Get('zones-list')
  async getAllZones(@Query('event_id') eventId?: string) {
    return this.presenceService.getAllZones(eventId || 'default');
  }

  @Post('zones')
  async createZone(@Body() body: any) {
    return this.presenceService.createZone(body);
  }

  @Put('zones/:id')
  async updateZone(@Param('id') id: string, @Body() body: any) {
    return this.presenceService.updateZone(id, body);
  }

  @Delete('zones/:id')
  async deleteZone(@Param('id') id: string) {
    await this.presenceService.deleteZone(id);
    return { success: true };
  }

  @Get('zone/:zone')
  async getAvailableInZone(@Param('zone') zone: string) {
    return this.presenceService.getAvailableInZone(decodeURIComponent(zone));
  }

  @Get(':userId')
  async getPresence(@Param('userId') userId: string) {
    return this.presenceService.getPresence(userId);
  }

  @Post()
  async updatePresence(@Body() body: { user_id: string; status: string; zone?: string; topics?: string; duration_minutes?: number }) {
    const expiresAt = body.duration_minutes
      ? new Date(Date.now() + body.duration_minutes * 60 * 1000)
      : undefined;

    const presence = await this.presenceService.updatePresence(
      body.user_id,
      body.status,
      body.zone,
      body.topics,
      expiresAt,
    );

    // Broadcast presence change
    if (body.status === 'available') {
      this.eventsGateway.broadcast('USER_AVAILABLE', {
        userId: body.user_id,
        zone: body.zone,
        topics: body.topics,
      });
    } else if (body.status === 'busy') {
      this.eventsGateway.broadcast('USER_BUSY', { userId: body.user_id });
    }

    return presence;
  }
}
