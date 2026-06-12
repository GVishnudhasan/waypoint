import { Controller, Get, Put, Post, Body, Param, UseGuards } from '@nestjs/common';
import { EventConfigService } from '../services/event-config.service';

@Controller('api/event-config')
export class EventConfigController {
  constructor(private configService: EventConfigService) {}

  @Get('list')
  async listConfigs() {
    return this.configService.getAllConfigs();
  }

  @Get(':id')
  async getConfigById(@Param('id') id: string) {
    return this.configService.getConfig(id);
  }

  @Get()
  async getConfig() {
    return this.configService.getConfig('default');
  }

  @Post()
  async createConfig(@Body() body: any) {
    return this.configService.createConfig(body);
  }

  @Put(':id')
  async updateConfigById(@Param('id') id: string, @Body() body: any) {
    return this.configService.updateConfig(id, body);
  }

  @Put()
  async updateConfig(@Body() body: any) {
    return this.configService.updateConfig('default', body);
  }
}
