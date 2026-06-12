import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from '../entities/goal.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal) private goalsRepo: Repository<Goal>,
  ) {}

  async create(data: Partial<Goal>): Promise<Goal> {
    const goal = this.goalsRepo.create(data);
    return this.goalsRepo.save(goal);
  }

  async findByUser(userId: string): Promise<Goal[]> {
    return this.goalsRepo.find({ where: { user_id: userId }, order: { priority: 'DESC' } });
  }

  async incrementProgress(id: string): Promise<Goal | null> {
    const goal = await this.goalsRepo.findOne({ where: { id } });
    if (goal && goal.current_count < goal.target_count) {
      goal.current_count += 1;
      return this.goalsRepo.save(goal);
    }
    return goal;
  }

  async update(id: string, data: Partial<Goal>): Promise<Goal | null> {
    await this.goalsRepo.update(id, data);
    return this.goalsRepo.findOne({ where: { id } });
  }
}
