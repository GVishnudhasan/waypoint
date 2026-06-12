import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Presence } from '../entities/presence.entity';
import { Zone } from '../entities/zone.entity';

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence) private presenceRepo: Repository<Presence>,
    @InjectRepository(Zone) private zoneRepo: Repository<Zone>,
  ) {}

  async updatePresence(userId: string, status: string, zone?: string, topics?: string, expiresAt?: Date): Promise<Presence> {
    let presence = await this.presenceRepo.findOne({ where: { user_id: userId } });
    if (presence) {
      presence.status = status;
      presence.zone = zone ?? '';
      presence.topics = topics ?? '';
      presence.expires_at = expiresAt ?? new Date(0);
    } else {
      presence = this.presenceRepo.create({ user_id: userId, status, zone: zone ?? '', topics: topics ?? '' });
      if (expiresAt) presence.expires_at = expiresAt;
    }
    return this.presenceRepo.save(presence);
  }

  async getPresence(userId: string): Promise<Presence | null> {
    return this.presenceRepo.findOne({ where: { user_id: userId }, relations: { user: true } });
  }

  async getAvailableInZone(zone: string): Promise<Presence[]> {
    return this.presenceRepo.find({
      where: { zone, status: 'available' },
      relations: { user: true },
    });
  }

  async getZoneStats(eventId: string = 'default'): Promise<any[]> {
    const zones = await this.zoneRepo.find({ where: { event_id: eventId } });
    const stats: any[] = [];
    for (const zone of zones) {
      const presences = await this.presenceRepo.find({ where: { zone: zone.name, status: 'available' } });
      const allTopics = presences
        .map((p) => (p.topics || '').split(',').map((t) => t.trim()))
        .flat()
        .filter(Boolean);
      const topicCounts: Record<string, number> = {};
      allTopics.forEach((t) => { topicCounts[t] = (topicCounts[t] || 0) + 1; });
      const trendingTopics = Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([t]) => t);
      stats.push({ zone: zone.name, icon: zone.icon, color: zone.color, count: presences.length, topics: trendingTopics });
    }
    return stats;
  }

  async getAllZones(eventId: string = 'default'): Promise<Zone[]> {
    return this.zoneRepo.find({ where: { event_id: eventId } });
  }

  async createZone(data: Partial<Zone>): Promise<Zone> {
    const zone = this.zoneRepo.create(data);
    return this.zoneRepo.save(zone);
  }

  async updateZone(id: string, data: Partial<Zone>): Promise<Zone | null> {
    await this.zoneRepo.update(id, data);
    return this.zoneRepo.findOne({ where: { id } });
  }

  async deleteZone(id: string): Promise<void> {
    await this.zoneRepo.delete(id);
  }

  async seedZones(): Promise<void> {
    const defaultZones = [
      { name: 'Main Hall', icon: '🎤', color: '#6366F1', capacity: 500 },
      { name: 'Coffee Lounge', icon: '☕', color: '#F59E0B', capacity: 100 },
      { name: 'Workshop Area', icon: '🔧', color: '#22C55E', capacity: 200 },
      { name: 'Expo Hall', icon: '🏢', color: '#8B5CF6', capacity: 300 },
      { name: 'Networking Area', icon: '🤝', color: '#EC4899', capacity: 150 },
      { name: 'Quiet Zone', icon: '📚', color: '#14B8A6', capacity: 50 },
    ];
    for (const z of defaultZones) {
      const exists = await this.zoneRepo.findOne({ where: { name: z.name } });
      if (!exists) await this.zoneRepo.save(this.zoneRepo.create(z));
    }
  }

  async countAvailable(): Promise<number> {
    return this.presenceRepo.count({ where: { status: 'available' } });
  }
}
