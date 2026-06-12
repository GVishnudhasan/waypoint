import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Goal } from '../entities/goal.entity';
import { Presence } from '../entities/presence.entity';
import { Connection } from '../entities/connection.entity';
import { PresenceService } from './presence.service';
import { AiService } from './ai.service';

import { EventConfigService } from './event-config.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Goal) private goalsRepo: Repository<Goal>,
    @InjectRepository(Presence) private presenceRepo: Repository<Presence>,
    @InjectRepository(Connection) private connRepo: Repository<Connection>,
    private presenceService: PresenceService,
    private aiService: AiService,
    private configService: EventConfigService,
  ) {}

  async onModuleInit() {
    const count = await this.usersRepo.count();
    
    // Always initialize event config
    await this.configService.getConfig();

    if (count > 0) return;

    console.log('🌱 Seeding database...');
    await this.presenceService.seedZones();

    const usersData = [
      { name: 'Sarah Kim', email: 'sarah@devflow.io', role: 'organizer', title: 'CEO & Co-founder', company: 'DevFlow', bio: 'Building AI-powered code review tools. Former Google engineer.', skills: ['AI/ML', 'Python', 'React', 'System Design', 'Leadership'], interests: ['Developer Tools', 'AI Agents', 'Startups', 'Open Source'], goals: [{ goal_type: 'hiring', description: 'Hire 3 frontend engineers', target_count: 3, priority: 10 }] },
      { name: 'Marcus Rivera', email: 'marcus@synthwave.dev', title: 'CTO', company: 'Synthwave Labs', bio: 'Leading AI agent infrastructure.', skills: ['AI Agents', 'Rust', 'Infrastructure', 'TypeScript', 'Distributed Systems'], interests: ['AI Agents', 'Open Source', 'Infrastructure', 'Startups'], goals: [{ goal_type: 'cofounder', description: 'Find technical co-founder', target_count: 1, priority: 9 }] },
      { name: 'Priya Sharma', email: 'priya@cloudweave.io', title: 'Founder', company: 'CloudWeave', bio: 'Building cloud infrastructure tools. Former Google Cloud engineer.', skills: ['Cloud Native', 'Go', 'Kubernetes', 'React', 'DevOps'], interests: ['Cloud Native', 'DevOps', 'Startups', 'Developer Tools'], goals: [{ goal_type: 'customer', description: 'Find 5 design partners', target_count: 5, priority: 8 }] },
      { name: 'James Okonkwo', email: 'james@lattice.com', title: 'VP Engineering', company: 'Lattice', bio: 'Scaling engineering teams with React 19 and TypeScript.', skills: ['React', 'TypeScript', 'Engineering Management', 'Node.js', 'System Design'], interests: ['Engineering Leadership', 'React', 'Hiring', 'Open Source'], goals: [{ goal_type: 'hiring', description: 'Hire senior frontend engineers', target_count: 5, priority: 10 }] },
      { name: 'Luna Zhang', email: 'luna@anthropic.com', title: 'ML Engineer', company: 'Anthropic', bio: 'Working on AI safety and alignment.', skills: ['Machine Learning', 'Python', 'AI Safety', 'Research', 'NLP'], interests: ['AI Safety', 'LLMs', 'Research', 'Developer Tools'], goals: [{ goal_type: 'networking', description: 'Meet frontend engineers building AI tools', target_count: 5, priority: 7 }] },
      { name: 'David Osei', email: 'david@linear.app', title: 'Design Engineer', company: 'Linear', bio: 'Building Linear\'s design system and component library.', skills: ['React', 'CSS', 'Animation', 'Design Systems', 'TypeScript'], interests: ['Design Systems', 'Animation', 'Web Performance', 'Developer Tools'], goals: [{ goal_type: 'learning', description: 'Learn about AI-powered design tools', target_count: 3, priority: 6 }] },
      { name: 'Aisha Johnson', email: 'aisha@stripe.com', title: 'Head of DX', company: 'Stripe', bio: 'Leading DX at Stripe. Making APIs beautiful.', skills: ['Developer Experience', 'API Design', 'Technical Writing', 'React', 'Node.js'], interests: ['Developer Experience', 'APIs', 'Documentation', 'Open Source'], goals: [{ goal_type: 'networking', description: 'Meet developer tool founders', target_count: 5, priority: 8 }] },
      { name: 'Chen Wei', email: 'chen@vercel.com', title: 'Staff Engineer', company: 'Vercel', bio: 'Building frontend infrastructure. Next.js core team.', skills: ['React', 'Next.js', 'TypeScript', 'Performance', 'Infrastructure'], interests: ['Web Performance', 'React', 'Edge Computing', 'Open Source'], goals: [{ goal_type: 'learning', description: 'Explore AI integration patterns', target_count: 3, priority: 5 }] },
      { name: 'Sofia Martinez', email: 'sofia@a16z.com', title: 'Partner', company: 'Andreessen Horowitz', bio: 'Investing in developer tools and AI infrastructure.', skills: ['Venture Capital', 'Strategy', 'AI', 'Developer Tools', 'Startups'], interests: ['Investing', 'AI', 'Developer Tools', 'Startups'], goals: [{ goal_type: 'networking', description: 'Meet promising founders', target_count: 10, priority: 10 }] },
      { name: 'Raj Patel', email: 'raj@notion.so', title: 'Senior Engineer', company: 'Notion', bio: 'Building collaborative editing experiences.', skills: ['React', 'TypeScript', 'Real-time Systems', 'CRDTs', 'AI'], interests: ['Collaboration', 'Real-time', 'AI', 'Productivity Tools'], goals: [{ goal_type: 'job', description: 'Find founding engineer role at AI startup', target_count: 3, priority: 9 }] },
    ];

    const createdUsers: User[] = [];
    const zones = ['Main Hall', 'Coffee Lounge', 'Workshop Area', 'Expo Hall', 'Networking Area'];

    for (const userData of usersData) {
      const { goals, ...userFields } = userData;
      const user = await this.usersRepo.save(this.usersRepo.create(userFields)) as User;

      for (const goal of goals) {
        await this.goalsRepo.save(this.goalsRepo.create({ ...goal, user_id: user.id }));
      }

      const aiTwin = this.aiService.generateTwin({
        name: user.name, bio: user.bio || '', skills: user.skills || [], interests: user.interests || [],
        goals: goals.map((g) => ({ goal_type: g.goal_type, description: g.description })),
      });
      user.ai_twin = aiTwin;

      const text = [user.name, user.title, user.company, user.bio, ...(user.skills || []), ...(user.interests || [])].filter(Boolean).join(' ');
      user.embedding = this.aiService.generateEmbedding(text);
      await this.usersRepo.save(user);

      createdUsers.push(user);
    }

    // Seed presences
    for (let i = 0; i < createdUsers.length; i++) {
      if (i % 4 !== 3) { // 75% available
        await this.presenceRepo.save(this.presenceRepo.create({
          user_id: createdUsers[i].id,
          status: 'available',
          zone: zones[i % zones.length],
          topics: (createdUsers[i].skills || []).slice(0, 2).join(', '),
        }));
      }
    }

    // Seed connections
    if (createdUsers.length >= 4) {
      await this.connRepo.save(this.connRepo.create({
        sender_id: createdUsers[0].id, receiver_id: createdUsers[1].id, status: 'accepted',
        conversation_starter: 'Discuss AI agent infrastructure and code review automation.',
      }));
      await this.connRepo.save(this.connRepo.create({
        sender_id: createdUsers[2].id, receiver_id: createdUsers[3].id, status: 'pending',
        conversation_starter: 'Explore cloud infrastructure for engineering teams.',
      }));
    }

    console.log(`✅ Seeded ${createdUsers.length} users with goals, AI twins, embeddings, and presences`);
  }
}
