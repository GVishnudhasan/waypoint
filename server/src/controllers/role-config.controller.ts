import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { RoleConfigService } from '../services/role-config.service';
import { RoleConfig } from '../entities/role-config.entity';

@Controller('api/roles')
export class RoleConfigController {
  constructor(private roleService: RoleConfigService) {}

  @Get()
  async listRoles(@Query('event_id') eventId: string): Promise<RoleConfig[]> {
    return this.roleService.listRoles(eventId || 'default');
  }

  @Post()
  async createRole(
    @Query('event_id') eventId: string,
    @Body() body: { name: string; permissions: string[] },
  ): Promise<RoleConfig> {
    return this.roleService.createRole(eventId || 'default', body.name, body.permissions);
  }

  @Put(':id')
  async updateRolePermissions(
    @Param('id') id: string,
    @Body() body: { permissions: string[] },
  ): Promise<RoleConfig> {
    return this.roleService.updateRolePermissions(id, body.permissions);
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.roleService.deleteRole(id);
    return { success: true };
  }
}
