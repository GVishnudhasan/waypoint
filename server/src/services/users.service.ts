import { Injectable, Inject, forwardRef, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserMembership } from '../entities/user-membership.entity';
import { EventConfig } from '../entities/event-config.entity';
import { EventBusService } from './event-bus.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(UserMembership) private membershipRepo: Repository<UserMembership>,
    @InjectRepository(EventConfig) private eventConfigRepo: Repository<EventConfig>,
    @Inject(forwardRef(() => EventBusService))
    private eventBus: EventBusService,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const targetEventId = data.event_id || 'default';
    const eventExists = await this.eventConfigRepo.findOne({ where: { id: targetEventId } });
    if (!eventExists) {
      throw new ConflictException(`The event configuration for "${targetEventId}" does not exist in the database. Please go back to the landing page and select or create an active event.`);
    }

    if (data.email) {
      const emailNormalized = data.email.toLowerCase().trim();
      const existing = await this.usersRepo.findOne({ where: { email: emailNormalized } });
      if (existing) {
        throw new ConflictException(`The email "${data.email}" is already registered. Please use a unique email.`);
      }
      data.email = emailNormalized;
    }
    const user = this.usersRepo.create(data);
    const saved = await this.usersRepo.save(user);

    // Auto-create a membership for the user in this event
    const membership = this.membershipRepo.create({
      user_id: saved.id,
      event_id: saved.event_id || 'default',
      role: saved.role || 'attendee',
      status: 'active',
      bio: saved.bio,
      title: saved.title,
      company: saved.company,
    });
    await this.membershipRepo.save(membership);

    // Emit event bus log
    await this.eventBus.emitEvent('USER_REGISTERED', { userId: saved.id, eventId: saved.event_id || 'default' });

    return saved;
  }

  async findAll(eventId: string = 'default'): Promise<User[]> {
    return this.usersRepo.find({ where: { event_id: eventId }, relations: { goals: true } });
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id }, relations: { goals: true } });
  }

  async findByEmail(email: string, eventId: string = 'default'): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email, event_id: eventId }, relations: { goals: true } });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.usersRepo.update(id, data);
    const updated = await this.findOne(id);
    if (updated) {
      // Sync to active event membership if fields exist
      await this.membershipRepo.update(
        { user_id: id, event_id: updated.event_id || 'default' },
        {
          role: updated.role,
          title: updated.title,
          company: updated.company,
          bio: updated.bio,
        }
      );

      // Emit outbox event to queue AI match recalculations
      await this.eventBus.emitEvent('PROFILE_UPDATED', { userId: id, eventId: updated.event_id || 'default' });
    }
    return updated;
  }

  async updateAiTwin(id: string, aiTwin: Record<string, any>): Promise<User | null> {
    await this.usersRepo.update(id, { ai_twin: aiTwin });
    const updated = await this.findOne(id);
    if (updated) {
      await this.eventBus.emitEvent('PROFILE_UPDATED', { userId: id, eventId: updated.event_id || 'default' });
    }
    return updated;
  }

  async updateEmbedding(id: string, embedding: number[]): Promise<void> {
    await this.usersRepo.update(id, { embedding });
  }

  async delete(id: string): Promise<void> {
    await this.usersRepo.delete(id);
  }

  async count(): Promise<number> {
    return this.usersRepo.count();
  }

  // --- Multi-Tenant User Membership Helpers ---

  async getMembership(userId: string, eventId: string): Promise<UserMembership | null> {
    return this.membershipRepo.findOne({ where: { user_id: userId, event_id: eventId } });
  }

  async updateMembershipRole(userId: string, eventId: string, role: string): Promise<UserMembership> {
    let membership = await this.getMembership(userId, eventId);
    if (!membership) {
      membership = this.membershipRepo.create({ user_id: userId, event_id: eventId, role, status: 'active' });
    } else {
      membership.role = role;
    }
    const saved = await this.membershipRepo.save(membership);
    
    // Sync back to main User profile if it matches active event context
    await this.usersRepo.update({ id: userId, event_id: eventId }, { role });
    
    return saved;
  }

  async updateMembershipStatus(userId: string, eventId: string, status: string): Promise<UserMembership> {
    let membership = await this.getMembership(userId, eventId);
    if (!membership) {
      membership = this.membershipRepo.create({ user_id: userId, event_id: eventId, role: 'attendee', status });
    } else {
      membership.status = status;
    }
    const saved = await this.membershipRepo.save(membership);

    // Emit event bus log for audit
    await this.eventBus.emitEvent('USER_STATUS_MODERATED', { userId, eventId, status });

    return saved;
  }

  async listMemberships(eventId: string): Promise<UserMembership[]> {
    return this.membershipRepo.find({
      where: { event_id: eventId },
      relations: { user: true },
    });
  }
}
