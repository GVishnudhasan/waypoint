import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AiService } from '../services/ai.service';
import { GoalsService } from '../services/goals.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private aiService: AiService,
    private goalsService: GoalsService,
  ) {}

  @Post()
  async create(@Body() body: any) {
    const user = await this.usersService.create(body);

    // Generate AI twin if profile is complete enough
    if (body.skills?.length > 0 || body.bio) {
      const goals = body.goals || [];
      const aiTwin = this.aiService.generateTwin({
        name: user.name,
        bio: user.bio || '',
        skills: user.skills || [],
        interests: user.interests || [],
        goals,
      });
      await this.usersService.updateAiTwin(user.id, aiTwin);

      // Generate embedding
      const embeddingText = [
        user.name, user.title, user.company, user.bio,
        ...(user.skills || []), ...(user.interests || []),
        ...goals.map((g: any) => g.description || g.goal_type),
      ].filter(Boolean).join(' ');
      const embedding = this.aiService.generateEmbedding(embeddingText);
      await this.usersService.updateEmbedding(user.id, embedding);

      // Create goals
      for (const goal of goals) {
        await this.goalsService.create({
          user_id: user.id,
          goal_type: goal.goal_type,
          description: goal.description || goal.goal_type,
          target_count: goal.target_count || 5,
          priority: goal.priority || 5,
        });
      }

      user.ai_twin = aiTwin;
    }

    return user;
  }

  @Get()
  async findAll(@Query('event_id') eventId?: string, @Query('limit') limit?: string) {
    const evId = eventId || 'default';
    const users = await this.usersService.findAll(evId);
    const memberships = await this.usersService.listMemberships(evId);
    const suspendedIds = memberships
      .filter((m) => m.status === 'suspended')
      .map((m) => m.user_id);

    const activeUsers = users.filter((u) => !suspendedIds.includes(u.id));
    return limit ? activeUsers.slice(0, parseInt(limit)) : activeUsers;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const user = await this.usersService.update(id, body);
    if (!user) {
      return { error: 'User not found' };
    }

    // Regenerate AI twin on profile update
    if (body.skills || body.interests || body.bio) {
      const goals = await this.goalsService.findByUser(id);
      const aiTwin = this.aiService.generateTwin({
        name: user.name,
        bio: user.bio || '',
        skills: user.skills || [],
        interests: user.interests || [],
        goals: goals.map((g) => ({ goal_type: g.goal_type, description: g.description })),
      });
      await this.usersService.updateAiTwin(id, aiTwin);

      const embeddingText = [user.name, user.title, user.company, user.bio, ...(user.skills || []), ...(user.interests || [])].filter(Boolean).join(' ');
      const embedding = this.aiService.generateEmbedding(embeddingText);
      await this.usersService.updateEmbedding(id, embedding);
    }

    return this.usersService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { success: true };
  }

  @Post(':id/generate-twin')
  async generateTwin(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) return { error: 'User not found' };
    const goals = await this.goalsService.findByUser(id);
    const aiTwin = this.aiService.generateTwin({
      name: user.name,
      bio: user.bio || '',
      skills: user.skills || [],
      interests: user.interests || [],
      goals: goals.map((g) => ({ goal_type: g.goal_type, description: g.description })),
    });
    await this.usersService.updateAiTwin(id, aiTwin);
    return aiTwin;
  }

  @Get('memberships/list')
  async listMemberships(@Query('event_id') eventId: string) {
    return this.usersService.listMemberships(eventId || 'default');
  }

  @Put(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Query('event_id') eventId: string,
    @Body('role') role: string,
  ) {
    return this.usersService.updateMembershipRole(id, eventId || 'default', role);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Query('event_id') eventId: string,
    @Body('status') status: string,
  ) {
    return this.usersService.updateMembershipStatus(id, eventId || 'default', status);
  }
}
