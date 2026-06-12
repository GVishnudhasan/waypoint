import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleConfig } from '../entities/role-config.entity';

@Injectable()
export class RoleConfigService {
  constructor(
    @InjectRepository(RoleConfig)
    private roleRepo: Repository<RoleConfig>,
  ) {}

  async seedDefaultRoles(eventId: string): Promise<RoleConfig[]> {
    // Seed default roles and permissions if they don't exist yet
    const existing = await this.roleRepo.find({ where: { event_id: eventId } });
    if (existing.length > 0) return existing;

    const defaults = [
      {
        name: 'organizer',
        permissions: ['create_sessions', 'manage_slides', 'accept_meetings', 'view_analytics', 'moderate_users', 'manage_zones'],
      },
      {
        name: 'moderator',
        permissions: ['moderate_users', 'view_analytics', 'accept_meetings'],
      },
      {
        name: 'speaker',
        permissions: ['create_sessions', 'manage_slides', 'accept_meetings'],
      },
      {
        name: 'attendee',
        permissions: ['accept_meetings'],
      },
      {
        name: 'sponsor',
        permissions: ['accept_meetings', 'manage_slides'],
      },
    ];

    const seeded: RoleConfig[] = [];
    for (const r of defaults) {
      const config = this.roleRepo.create({
        event_id: eventId,
        name: r.name,
        permissions: r.permissions,
      });
      seeded.push(await this.roleRepo.save(config));
    }
    return seeded;
  }

  async listRoles(eventId: string): Promise<RoleConfig[]> {
    await this.seedDefaultRoles(eventId); // Auto seed if empty
    return this.roleRepo.find({ where: { event_id: eventId } });
  }

  async createRole(eventId: string, name: string, permissions: string[]): Promise<RoleConfig> {
    const role = this.roleRepo.create({
      event_id: eventId,
      name: name.toLowerCase(),
      permissions,
    });
    return this.roleRepo.save(role);
  }

  async updateRolePermissions(id: string, permissions: string[]): Promise<RoleConfig> {
    await this.roleRepo.update(id, { permissions });
    const updated = await this.roleRepo.findOne({ where: { id } });
    if (!updated) throw new Error('Role not found');
    return updated;
  }

  async deleteRole(id: string): Promise<void> {
    await this.roleRepo.delete(id);
  }
}
