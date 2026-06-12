import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entities
import { User, Goal, Connection, Presence, Zone, Message, EventConfig, RoleConfig, UserMembership, Session, AuditLog, OutboxEvent, Recommendation } from './entities';

// Services
import { UsersService } from './services/users.service';
import { GoalsService } from './services/goals.service';
import { MatchingService } from './services/matching.service';
import { ConnectionsService } from './services/connections.service';
import { PresenceService } from './services/presence.service';
import { AiService } from './services/ai.service';
import { SeedService } from './services/seed.service';
import { EventConfigService } from './services/event-config.service';
import { EventBusService } from './services/event-bus.service';
import { SessionService } from './services/session.service';
import { AuditLogService } from './services/audit-log.service';
import { RoleConfigService } from './services/role-config.service';

// Controllers
import { UsersController } from './controllers/users.controller';
import { GoalsController } from './controllers/goals.controller';
import { MatchingController } from './controllers/matching.controller';
import { ConnectionsController } from './controllers/connections.controller';
import { PresenceController } from './controllers/presence.controller';
import { AnalyticsController } from './controllers/analytics.controller';
import { EventConfigController } from './controllers/event-config.controller';
import { SessionController } from './controllers/session.controller';
import { RoleConfigController } from './controllers/role-config.controller';
import { AuditLogController } from './controllers/audit-log.controller';

// Gateways
import { EventsGateway } from './gateways/events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'waypoint.db',
      entities: [User, Goal, Connection, Presence, Zone, Message, EventConfig, RoleConfig, UserMembership, Session, AuditLog, OutboxEvent, Recommendation],
      synchronize: true, // Auto-create tables (dev only)
    }),
    TypeOrmModule.forFeature([User, Goal, Connection, Presence, Zone, Message, EventConfig, RoleConfig, UserMembership, Session, AuditLog, OutboxEvent, Recommendation]),
  ],
  controllers: [
    UsersController,
    GoalsController,
    MatchingController,
    ConnectionsController,
    PresenceController,
    AnalyticsController,
    EventConfigController,
    SessionController,
    RoleConfigController,
    AuditLogController,
  ],
  providers: [
    UsersService,
    GoalsService,
    MatchingService,
    ConnectionsService,
    PresenceService,
    AiService,
    SeedService,
    EventConfigService,
    EventBusService,
    SessionService,
    AuditLogService,
    RoleConfigService,
    EventsGateway,
  ],
})
export class AppModule {}
