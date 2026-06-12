import { Controller, Get, Param } from '@nestjs/common';
import { MatchingService } from '../services/matching.service';

@Controller('api/matches')
export class MatchingController {
  constructor(private matchingService: MatchingService) {}

  @Get(':userId')
  async findMatches(@Param('userId') userId: string): Promise<any[]> {
    return this.matchingService.findMatchesCached(userId);
  }
}
