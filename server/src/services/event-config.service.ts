import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventConfig } from '../entities/event-config.entity';

@Injectable()
export class EventConfigService {
  constructor(
    @InjectRepository(EventConfig)
    private configRepo: Repository<EventConfig>,
  ) {}

  async getAllConfigs(): Promise<EventConfig[]> {
    return this.configRepo.find();
  }

  async getConfig(id: string = 'default'): Promise<EventConfig> {
    let config = await this.configRepo.findOne({ where: { id } });
    if (!config && id === 'default') {
      config = this.configRepo.create({
        id: 'default',
        name: 'Waypoint Summit 2026',
        description: 'The premier outcome-driven tech conference.',
        is_active: false,
        allowed_roles: ['speaker', 'moderator', 'panelist', 'attendee'],
        allow_connections: true,
        allow_presence: true,
        allow_ai_matching: true,
        allow_registration: true,
        allow_messaging: true,
        allow_sponsor_discovery: true,
        allow_session_recs: true,
        theme_color: '#6366F1',
        timezone: 'UTC',
        dates: 'Oct 12-14, 2026',
      });
      await this.configRepo.save(config);
    }
    if (!config) {
      throw new Error(`Event configuration not found for id: ${id}`);
    }
    return config;
  }

  async createConfig(data: any): Promise<EventConfig> {
    const config = this.configRepo.create({
      id: data.id || Math.random().toString(36).substring(2, 11),
      name: data.name || 'Unnamed Conference',
      description: data.description || '',
      is_active: data.is_active ?? false,
      allowed_roles: data.allowed_roles || ['speaker', 'moderator', 'panelist', 'attendee'],
      allow_connections: data.allow_connections ?? true,
      allow_presence: data.allow_presence ?? true,
      allow_ai_matching: data.allow_ai_matching ?? true,
      allow_registration: data.allow_registration ?? true,
      allow_messaging: data.allow_messaging ?? true,
      allow_sponsor_discovery: data.allow_sponsor_discovery ?? true,
      allow_session_recs: data.allow_session_recs ?? true,
      logo: data.logo,
      theme_color: data.theme_color || '#6366F1',
      timezone: data.timezone || 'UTC',
      dates: data.dates || '',
    });
    return this.configRepo.save(config);
  }

  async updateConfig(id: string, data: Partial<EventConfig>): Promise<EventConfig> {
    await this.getConfig(id);
    await this.configRepo.update(id, data);
    return this.getConfig(id);
  }
}
