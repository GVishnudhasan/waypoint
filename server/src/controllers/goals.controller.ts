import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { GoalsService } from '../services/goals.service';

@Controller('api/goals')
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.goalsService.findByUser(userId);
  }

  @Post()
  async create(@Body() body: any) {
    return this.goalsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.goalsService.update(id, body);
  }

  @Post(':id/increment')
  async increment(@Param('id') id: string) {
    return this.goalsService.incrementProgress(id);
  }
}
