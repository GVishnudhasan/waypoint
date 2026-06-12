import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from '../entities/user.entity';
import { Goal } from '../entities/goal.entity';
import { Recommendation } from '../entities/recommendation.entity';

interface MatchResult {
  user: User;
  score: number;
  reasoning: string[];
  conversationStarter: string;
  suggestedAction: string;
}

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Goal) private goalsRepo: Repository<Goal>,
    @InjectRepository(Recommendation) private recRepo: Repository<Recommendation>,
  ) {}

  async findMatchesCached(userId: string): Promise<any[]> {
    const cached = await this.recRepo.find({ where: { user_id: userId } });
    if (cached.length === 0) {
      await this.recalculateUserMatches(userId);
      return this.findMatches(userId, 20);
    }
    const results: MatchResult[] = [];
    for (const rec of cached) {
      const user = await this.usersRepo.findOne({ where: { id: rec.target_id }, relations: { goals: true } });
      if (user) {
        results.push({
          user,
          score: rec.score,
          reasoning: rec.reasons || [],
          conversationStarter: `Ask about their role at ${user.company} and what they're hoping to get from the conference.`,
          suggestedAction: `Connect and explore collaboration opportunities`,
        });
      }
    }
    return results;
  }

  async recalculateUserMatches(userId: string): Promise<void> {
    const matches = await this.findMatches(userId, 20);
    await this.recRepo.delete({ user_id: userId });
    for (const match of matches) {
      const rec = this.recRepo.create({
        user_id: userId,
        target_id: match.user.id,
        target_type: 'user',
        score: match.score,
        reasons: match.reasoning,
      });
      await this.recRepo.save(rec);
    }
  }

  async findMatches(userId: string, limit = 20): Promise<MatchResult[]> {
    const currentUser = await this.usersRepo.findOne({ where: { id: userId }, relations: { goals: true } });
    if (!currentUser) return [];

    const allUsers = await this.usersRepo.find({
      where: { id: Not(userId) },
      relations: { goals: true },
    });

    const scored = allUsers.map((other) => this.scoreMatch(currentUser, other));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  }

  private scoreMatch(userA: User, userB: User): MatchResult {
    let score = 50;
    const reasoning: string[] = [];

    const sharedSkills = (userA.skills || []).filter((s) => (userB.skills || []).includes(s));
    if (sharedSkills.length > 0) {
      score += sharedSkills.length * 5;
      reasoning.push(`Shared skills: ${sharedSkills.join(', ')}`);
    }

    const sharedInterests = (userA.interests || []).filter((i) => (userB.interests || []).includes(i));
    if (sharedInterests.length > 0) {
      score += sharedInterests.length * 4;
      reasoning.push(`Common interests: ${sharedInterests.join(', ')}`);
    }

    const goalsA = userA.goals || [];
    const goalsB = userB.goals || [];
    const goalCompatibility = this.checkGoalCompatibility(goalsA, goalsB);
    if (goalCompatibility.compatible) {
      score += 20;
      reasoning.push(goalCompatibility.reason);
    }

    if (userA.embedding && userB.embedding) {
      const similarity = this.cosineSimilarity(userA.embedding, userB.embedding);
      score += Math.round(similarity * 15);
      if (similarity > 0.7) reasoning.push('Strong profile alignment based on AI analysis');
    }

    if (userA.ai_twin && userB.ai_twin) {
      score += this.twinCompatibility(userA.ai_twin, userB.ai_twin);
    }

    score = Math.min(99, Math.max(10, score));

    const conversationStarter = this.generateConversationStarter(userA, userB, sharedSkills, sharedInterests);
    const suggestedAction = this.generateSuggestedAction(goalsA, goalsB, userB);

    return { user: userB, score, reasoning, conversationStarter, suggestedAction };
  }

  private checkGoalCompatibility(goalsA: Goal[], goalsB: Goal[]): { compatible: boolean; reason: string } {
    const complementary: Record<string, string[]> = {
      hiring: ['job'], job: ['hiring'], networking: ['networking', 'cofounder', 'customer'],
      cofounder: ['cofounder', 'networking'], customer: ['networking', 'learning'], learning: ['learning', 'networking'],
    };
    for (const gA of goalsA) {
      for (const gB of goalsB) {
        const matches = complementary[gA.goal_type] || [];
        if (matches.includes(gB.goal_type)) {
          return { compatible: true, reason: `Goal synergy: You're ${gA.goal_type === 'job' ? 'looking for a role' : gA.goal_type} — they're ${gB.goal_type === 'hiring' ? 'hiring' : gB.goal_type}` };
        }
      }
    }
    return { compatible: false, reason: '' };
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0, mA = 0, mB = 0;
    for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; mA += a[i] * a[i]; mB += b[i] * b[i]; }
    const mag = Math.sqrt(mA) * Math.sqrt(mB);
    return mag === 0 ? 0 : dot / mag;
  }

  private twinCompatibility(twinA: Record<string, any>, twinB: Record<string, any>): number {
    let score = 0;
    const seekingA = twinA.seeking || [];
    const skillsB = twinB.skills || [];
    const seekingB = twinB.seeking || [];
    const skillsA = twinA.skills || [];
    for (const s of seekingA) { if (skillsB.some((sk: string) => sk.toLowerCase().includes(s.toLowerCase()))) score += 5; }
    for (const s of seekingB) { if (skillsA.some((sk: string) => sk.toLowerCase().includes(s.toLowerCase()))) score += 5; }
    return Math.min(score, 15);
  }

  private generateConversationStarter(userA: User, userB: User, sharedSkills: string[], sharedInterests: string[]): string {
    if (sharedSkills.length > 0) return `You both work with ${sharedSkills[0]}. Ask about their approach to ${sharedInterests[0] || sharedSkills[0]} and current challenges.`;
    if (sharedInterests.length > 0) return `You share an interest in ${sharedInterests[0]}. Discuss recent developments and how it impacts your work.`;
    return `Ask about their role at ${userB.company} and what they're hoping to get from the conference.`;
  }

  private generateSuggestedAction(goalsA: Goal[], goalsB: Goal[], userB: User): string {
    if (goalsA.some((g) => g.goal_type === 'job') && goalsB.some((g) => g.goal_type === 'hiring')) return `Discuss open roles at ${userB.company}`;
    if (goalsA.some((g) => g.goal_type === 'hiring')) return `Explore if ${userB.name} is open to new opportunities`;
    if (goalsA.some((g) => g.goal_type === 'cofounder')) return `Explore potential co-founding synergies`;
    return `Connect and explore collaboration opportunities`;
  }
}
