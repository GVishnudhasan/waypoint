import { Injectable } from '@nestjs/common';

/**
 * AI Service — handles AI Twin generation and conversation starters.
 * In production, this would call OpenAI/Gemini. For the hackathon,
 * we use deterministic logic that produces realistic, explainable results.
 */
@Injectable()
export class AiService {
  /**
   * Generate an AI Twin profile from user data
   */
  generateTwin(profile: {
    name: string;
    bio: string;
    skills: string[];
    interests: string[];
    goals: Array<{ goal_type: string; description: string }>;
  }): Record<string, any> {
    const { bio, skills, interests, goals } = profile;

    // Extract expertise areas from bio keywords
    const expertiseKeywords = ['engineer', 'architect', 'designer', 'manager', 'founder', 'cto', 'ceo', 'researcher', 'scientist', 'developer'];
    const expertise = expertiseKeywords.filter((k) => bio?.toLowerCase().includes(k));

    // Map goals to seeking
    const seekingMap: Record<string, string> = {
      hiring: 'Engineering Talent',
      job: 'New Opportunities',
      networking: 'Industry Connections',
      cofounder: 'Co-founding Partner',
      customer: 'Potential Customers',
      learning: 'Knowledge & Skills',
    };
    const seeking = goals.map((g) => seekingMap[g.goal_type] || g.description);

    // Determine networking intent
    const intentMap: Record<string, string> = {
      hiring: 'Actively recruiting for open positions',
      job: 'Exploring career opportunities',
      cofounder: 'Seeking co-founder for a venture',
      customer: 'Looking for design partners and early adopters',
      networking: 'Building professional connections',
      learning: 'Deepening technical knowledge',
    };
    const networkingIntent = goals.map((g) => intentMap[g.goal_type] || 'Open to connecting');

    // Compute topic interests from skills + interests
    const topicInterests = [...new Set([...skills.slice(0, 3), ...interests.slice(0, 3)])];

    return {
      skills: skills.slice(0, 8),
      expertise: expertise.length > 0 ? expertise : ['Technology Professional'],
      interests: interests.slice(0, 6),
      seeking,
      networkingIntent,
      topicInterests,
      learningObjectives: interests.filter((i) => i.toLowerCase().includes('ai') || i.toLowerCase().includes('learn')),
      summary: `${profile.name} is a ${expertise[0] || 'professional'} focused on ${skills.slice(0, 2).join(' and ')}${interests.length > 0 ? `, with interests in ${interests[0]}` : ''}.`,
    };
  }

  /**
   * Generate a simple embedding for matching.
   * In production this would call an embedding model.
   * For the hackathon, we generate a deterministic vector from profile text.
   */
  generateEmbedding(text: string): number[] {
    const dim = 64;
    const embedding = new Array(dim).fill(0);
    const words = text.toLowerCase().split(/\W+/).filter(Boolean);

    // Curated tech vocabulary for matching focus areas
    const vocab = [
      'react', 'typescript', 'rust', 'python', 'go', 'kubernetes', 'cloud', 'devops',
      'ai', 'ml', 'llm', 'agents', 'founder', 'ceo', 'cto', 'engineer',
      'developer', 'stripe', 'vercel', 'anthropic', 'google', 'lattice', 'linear', 'devflow',
      'hiring', 'job', 'recruit', 'investment', 'cofounder', 'design', 'frontend', 'backend'
    ];

    for (const word of words) {
      const vocabIdx = vocab.indexOf(word);
      if (vocabIdx !== -1) {
        // Boost curated keywords to specific dimension slots
        embedding[vocabIdx % dim] += 5.0;
      } else {
        // Fallback to hashing trick for all other words
        let hash = 0;
        for (let i = 0; i < word.length; i++) {
          hash = (hash * 31 + word.charCodeAt(i)) & 0xffffffff;
        }
        const idx = Math.abs(hash) % dim;
        embedding[idx] += 1.0;
      }
    }

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
    if (magnitude > 0) {
      for (let i = 0; i < dim; i++) {
        embedding[i] = embedding[i] / magnitude;
      }
    }

    return embedding;
  }

  /**
   * Generate an explainable conversation starter
   */
  generateConversationStarter(
    userA: { name: string; skills: string[]; interests: string[]; goals: Array<{ goal_type: string }> },
    userB: { name: string; skills: string[]; interests: string[]; company: string; goals: Array<{ goal_type: string }> },
  ): string {
    const shared = userA.skills.filter((s) => userB.skills.includes(s));
    const sharedInterests = userA.interests.filter((i) => userB.interests.includes(i));

    if (userA.goals.some((g) => g.goal_type === 'job') && userB.goals.some((g) => g.goal_type === 'hiring')) {
      return `Ask about the engineering culture at ${userB.company} and what they look for in senior hires. Mention your experience with ${shared[0] || userA.skills[0]}.`;
    }
    if (shared.length > 0) {
      return `You both work with ${shared.slice(0, 2).join(' and ')}. Discuss ${sharedInterests[0] || 'recent developments'} and how you're applying it in your current projects.`;
    }
    if (sharedInterests.length > 0) {
      return `You share an interest in ${sharedInterests[0]}. Ask about their perspective from ${userB.company} and share your own experience.`;
    }
    return `Introduce yourself and ask about their work at ${userB.company}. Share what you're hoping to get from the conference.`;
  }
}
