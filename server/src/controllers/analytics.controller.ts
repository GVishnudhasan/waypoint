import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ConnectionsService } from '../services/connections.service';
import { PresenceService } from '../services/presence.service';
import { EventConfigService } from '../services/event-config.service';
import { DataSource } from 'typeorm';

@Controller('api/analytics')
export class AnalyticsController {
  constructor(
    private usersService: UsersService,
    private connectionsService: ConnectionsService,
    private presenceService: PresenceService,
    private configService: EventConfigService,
    private dataSource: DataSource,
  ) {}

  @Get('reset')
  async resetDatabase() {
    const entities = this.dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = this.dataSource.getRepository(entity.name);
      await repository.clear();
    }
    // Recreate the default event configuration to prevent foreign key errors for fallback sessions
    await this.configService.getConfig('default');
    return { status: 'success', message: 'Database flushed completely.' };
  }

  @Get('overview')
  async getOverview() {
    const [totalUsers, totalConnections, acceptedConnections, availableNetworkers] = await Promise.all([
      this.usersService.count(),
      this.connectionsService.countByStatus('pending'),
      this.connectionsService.countByStatus('accepted'),
      this.presenceService.countAvailable(),
    ]);

    return {
      activeAttendees: totalUsers,
      connectionsMade: acceptedConnections,
      pendingRequests: totalConnections,
      activeNetworkers: availableNetworkers,
      meetingsScheduled: Math.floor(acceptedConnections * 0.6), // estimated
      missionCompletion: totalUsers > 0 ? 67 : 0, // would compute from goals in production
    };
  }

  @Get('zones')
  async getZoneAnalytics() {
    return this.presenceService.getZoneStats();
  }
}
