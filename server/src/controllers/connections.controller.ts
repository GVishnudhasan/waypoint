import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ConnectionsService } from '../services/connections.service';
import { EventsGateway } from '../gateways/events.gateway';

@Controller('api/connections')
export class ConnectionsController {
  constructor(
    private connectionsService: ConnectionsService,
    private eventsGateway: EventsGateway,
  ) {}

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.connectionsService.findByUser(userId);
  }

  @Get('pending/:userId')
  async findPending(@Param('userId') userId: string) {
    return this.connectionsService.findPending(userId);
  }

  @Post()
  async create(@Body() body: { sender_id: string; receiver_id: string; message?: string; conversation_starter?: string }) {
    const conn = await this.connectionsService.create(body);
    this.eventsGateway.emitToUser(body.receiver_id, 'CONNECTION_REQUEST', {
      connectionId: conn.id,
      senderId: body.sender_id,
    });
    return conn;
  }

  @Put(':id/accept')
  async accept(@Param('id') id: string) {
    const conn = await this.connectionsService.accept(id);
    this.eventsGateway.emitToUser(conn.sender_id, 'CONNECTION_ACCEPTED', {
      connectionId: conn.id,
      acceptedBy: conn.receiver_id,
    });
    return conn;
  }

  @Put(':id/decline')
  async decline(@Param('id') id: string) {
    return this.connectionsService.decline(id);
  }
}
