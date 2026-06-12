import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutboxEvent } from '../entities/outbox-event.entity';
import { EventsGateway } from '../gateways/events.gateway';
import { MatchingService } from './matching.service';

@Injectable()
export class EventBusService implements OnModuleInit {
  constructor(
    @InjectRepository(OutboxEvent)
    private outboxRepo: Repository<OutboxEvent>,
    private eventsGateway: EventsGateway,
    private matchingService: MatchingService,
  ) {}

  onModuleInit() {
    // Start background processing pipeline loop simulating Kafka/NATS consumers
    setInterval(() => {
      this.processOutbox();
    }, 5000); // run every 5 seconds
  }

  async emitEvent(eventType: string, payload: any): Promise<OutboxEvent> {
    const event = this.outboxRepo.create({
      event_type: eventType,
      payload,
      status: 'pending',
    });
    const saved = await this.outboxRepo.save(event);
    
    // Immediate local in-memory notification
    this.eventsGateway.broadcast('EVENT_BUS_LOG', {
      id: saved.id,
      type: eventType,
      timestamp: new Date(),
    });

    return saved;
  }

  async processOutbox() {
    const pending = await this.outboxRepo.find({
      where: { status: 'pending' },
      order: { created_at: 'ASC' },
      take: 10,
    });

    for (const event of pending) {
      try {
        await this.handleEvent(event.event_type, event.payload);
        event.status = 'processed';
      } catch (err) {
        console.error(`Error processing outbox event ${event.id}:`, err);
        event.status = 'failed';
      }
      await this.outboxRepo.save(event);
    }
  }

  private async handleEvent(type: string, payload: any) {
    console.log(`[EventBus Pipeline] Processing ${type}`, payload);

    switch (type) {
      case 'USER_AVAILABLE':
        // Notify other active attendees
        this.eventsGateway.broadcast('USER_AVAILABLE', payload);
        break;

      case 'USER_BUSY':
        this.eventsGateway.broadcast('USER_BUSY', payload);
        break;

      case 'CONNECTION_REQUESTED':
        this.eventsGateway.broadcast('CONNECTION_REQUEST', payload);
        break;

      case 'PROFILE_UPDATED':
        // Run AI match updating pipeline in background
        if (payload.userId) {
          console.log(`[AI Matching Pipeline] Recalculating matches for user ${payload.userId}`);
          // Simulate embedding recalculation delay and caching
          await this.matchingService.recalculateUserMatches(payload.userId);
        }
        break;

      case 'MISSION_COMPLETED':
        this.eventsGateway.broadcast('MISSION_COMPLETED_ALERT', payload);
        break;

      default:
        break;
    }
  }
}
