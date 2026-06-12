import type { Recommendation, Session, Sponsor, Connection, VenueZone, Mission, Notification, ActivityItem, AnalyticsMetric, User } from '../types';

export const mockUser: User = {
  id: 'u1',
  name: 'Alex Chen',
  title: 'Senior Frontend Engineer',
  company: 'Vercel',
  bio: 'Building the future of developer tooling. Passionate about React, TypeScript, and AI-powered developer experiences.',
  avatar: '',
  linkedin: 'alexchen',
  github: 'alexchen',
  twitter: 'alexchen_dev',
  website: 'https://alexchen.dev',
  skills: ['React', 'TypeScript', 'Node.js', 'AI/ML', 'System Design', 'WebGL'],
  interests: ['Developer Tools', 'AI Agents', 'Open Source', 'Startups', 'Web Performance'],
  role: 'attendee',
  networkingStatus: { status: 'available', location: 'Coffee Lounge', availableUntil: '4:30 PM', topics: ['AI Agents', 'React 19'] },
  createdAt: '2024-01-15',
};

export const mockMission: Mission = {
  id: 'm1',
  userId: 'u1',
  title: 'Meet 5 Startup Founders',
  description: 'Connect with founders building developer tools and AI products',
  targetCount: 5,
  currentCount: 3,
  category: 'networking',
  achievements: [
    { id: 'a1', title: 'Connected with Sarah Kim', description: 'CEO at DevFlow — AI-powered code review', icon: '🤝', completedAt: '2h ago' },
    { id: 'a2', title: 'Met startup CTO', description: 'Marcus Rivera, CTO at Synthwave Labs', icon: '💬', completedAt: '4h ago' },
    { id: 'a3', title: 'Scheduled follow-up', description: 'Coffee chat with Priya Sharma tomorrow', icon: '📅', completedAt: '5h ago' },
  ],
  createdAt: '2024-01-15',
};

export const mockRecommendations: Recommendation[] = [
  {
    id: 'r1', type: 'person', title: 'Sarah Kim', subtitle: 'CEO & Co-founder at DevFlow',
    matchScore: 96, tags: ['AI', 'Developer Tools', 'Startup Founder'],
    reasoning: ['Building AI-powered code review tools', 'Hiring frontend engineers with React expertise', 'Shared interest in developer experience'],
    suggestedAction: 'Discuss collaboration on AI developer tools',
    conversationStarter: 'Ask about their approach to AI-assisted code review and how they handle React component analysis.',
    availability: 'available', saved: false, connected: false,
  },
  {
    id: 'r2', type: 'person', title: 'Marcus Rivera', subtitle: 'CTO at Synthwave Labs',
    matchScore: 91, tags: ['AI Agents', 'Infrastructure', 'Open Source'],
    reasoning: ['Leading AI agent infrastructure company', 'Open source contributor', 'Looking for technical advisors'],
    suggestedAction: 'Explore technical advisory opportunity',
    conversationStarter: 'Discuss the challenges of building reliable AI agent orchestration systems.',
    availability: 'available', saved: true, connected: false,
  },
  {
    id: 'r3', type: 'person', title: 'Priya Sharma', subtitle: 'Founder at CloudWeave',
    matchScore: 88, tags: ['Cloud Native', 'DevOps', 'Startup Founder'],
    reasoning: ['Building cloud infrastructure tools', 'Former Google engineer', 'Interested in frontend for CLI tools'],
    suggestedAction: 'Discuss frontend patterns for developer platforms',
    conversationStarter: 'Share experiences building developer-facing UIs for infrastructure products.',
    availability: 'busy', saved: false, connected: true,
  },
  {
    id: 'r4', type: 'person', title: 'James Okonkwo', subtitle: 'VP Engineering at Lattice',
    matchScore: 85, tags: ['Engineering Leadership', 'Hiring', 'React'],
    reasoning: ['Actively hiring senior frontend engineers', 'Building with React 19 and TypeScript', 'Values open source contributions'],
    suggestedAction: 'Discuss engineering culture and open roles',
    conversationStarter: 'Ask about their migration to React 19 and lessons learned at scale.',
    availability: 'available', saved: false, connected: false,
  },
  {
    id: 'r5', type: 'person', title: 'Luna Zhang', subtitle: 'ML Engineer at Anthropic',
    matchScore: 82, tags: ['AI Safety', 'LLMs', 'Python'],
    reasoning: ['Working on AI safety research', 'Interested in frontend for AI tools', 'Published researcher in alignment'],
    suggestedAction: 'Learn about AI safety implications for developer tools',
    conversationStarter: 'Discuss how frontend design can improve AI transparency and interpretability.',
    availability: 'offline', saved: false, connected: false,
  },
  {
    id: 'r6', type: 'person', title: 'David Osei', subtitle: 'Design Engineer at Linear',
    matchScore: 79, tags: ['Design Systems', 'Animation', 'React'],
    reasoning: ['Expert in design engineering', 'Building Linear\'s component library', 'Speaking about micro-interactions'],
    suggestedAction: 'Discuss design system architecture',
    conversationStarter: 'Ask about Linear\'s approach to animation performance in React.',
    availability: 'available', saved: false, connected: false,
  },
];

export const mockSessions: Session[] = [
  {
    id: 's1', title: 'Building AI Agents That Actually Work', description: 'A deep dive into production AI agent architectures, covering reliability, observability, and user experience patterns.',
    speakers: [{ id: 'sp1', name: 'Sarah Kim', title: 'CEO', company: 'DevFlow' }],
    topics: ['AI Agents', 'Architecture', 'Production ML'], time: '10:00 AM', duration: '45 min',
    location: 'Main Stage', attendeeCount: 420, matchScore: 94,
    reasoning: ['Directly relevant to your AI interests', 'Speaker is a recommended connection', 'Covers production patterns you can apply'],
    saved: true,
  },
  {
    id: 's2', title: 'React 19: What Actually Changed', description: 'Beyond the hype — practical migration strategies, new patterns, and performance implications of React 19.',
    speakers: [{ id: 'sp2', name: 'Dan Chen', title: 'Staff Engineer', company: 'Meta' }],
    topics: ['React', 'Frontend', 'Performance'], time: '11:30 AM', duration: '30 min',
    location: 'Hall A', attendeeCount: 380, matchScore: 92,
    reasoning: ['Core to your skill set', 'Practical migration advice', 'Networking opportunity with React community'],
    saved: false,
  },
  {
    id: 's3', title: 'Developer Experience as a Product', description: 'How to think about DX as a competitive advantage, from documentation to SDK design.',
    speakers: [{ id: 'sp3', name: 'Aisha Johnson', title: 'Head of DX', company: 'Stripe' }],
    topics: ['Developer Experience', 'Product', 'APIs'], time: '2:00 PM', duration: '45 min',
    location: 'Hall B', attendeeCount: 290, matchScore: 87,
    reasoning: ['Aligns with developer tooling interest', 'Stripe\'s DX is industry-leading', 'Applicable to your current work'],
    saved: false,
  },
  {
    id: 's4', title: 'The Future of Open Source Business', description: 'Sustainable open source models, community building, and commercial open source strategies.',
    speakers: [{ id: 'sp4', name: 'Mitchell Hashimoto', title: 'Co-founder', company: 'HashiCorp' }],
    topics: ['Open Source', 'Business', 'Community'], time: '3:30 PM', duration: '30 min',
    location: 'Main Stage', attendeeCount: 510, matchScore: 81,
    reasoning: ['Open source is a key interest', 'Strategic insights for career growth', 'High-profile networking opportunity'],
    saved: false,
  },
];

export const mockSponsors: Sponsor[] = [
  {
    id: 'sp1', name: 'Vercel', industry: 'Developer Tools', description: 'The platform for frontend developers. Providing the best developer experience with a focus on end-user performance.',
    hiringRoles: ['Senior Frontend Engineer', 'Staff Engineer', 'Developer Advocate'],
    products: ['Next.js', 'Turbopack', 'v0'], matchScore: 95,
    reasoning: ['Your current employer — stay updated on company vision', 'Internal mobility opportunities', 'Connect with other teams'],
    boothLocation: 'Expo Hall A-1',
  },
  {
    id: 'sp2', name: 'Anthropic', industry: 'AI Safety', description: 'AI safety company building reliable, interpretable, and steerable AI systems.',
    hiringRoles: ['ML Engineer', 'Full Stack Engineer', 'Research Engineer'],
    products: ['Claude', 'Claude API', 'Constitutional AI'], matchScore: 88,
    reasoning: ['AI/ML aligns with your interests', 'Actively hiring engineers', 'Leading AI safety research'],
    boothLocation: 'Expo Hall A-3',
  },
  {
    id: 'sp3', name: 'Linear', industry: 'Developer Tools', description: 'The issue tracking tool you\'ll enjoy using. Streamline software projects, sprints, tasks, and bug tracking.',
    hiringRoles: ['Design Engineer', 'Frontend Engineer', 'Backend Engineer'],
    products: ['Linear', 'Linear Mobile', 'Linear API'], matchScore: 85,
    reasoning: ['Best-in-class developer tool UX', 'React & TypeScript stack', 'Strong design engineering culture'],
    boothLocation: 'Expo Hall B-2',
  },
];

export const mockConnections: Connection[] = [
  {
    id: 'c1', user: { id: 'u2', name: 'Sarah Kim', title: 'CEO & Co-founder', company: 'DevFlow' },
    status: 'accepted',
    meetingSuggestion: { location: 'Coffee Lounge', conversationStarter: 'Discuss AI-assisted code review and React component analysis patterns.', sharedInterests: ['AI', 'Developer Tools', 'React'] },
    connectedAt: '2h ago', requestedAt: '3h ago',
  },
  {
    id: 'c2', user: { id: 'u3', name: 'Marcus Rivera', title: 'CTO', company: 'Synthwave Labs' },
    status: 'accepted',
    meetingSuggestion: { location: 'Workshop Area', conversationStarter: 'Explore AI agent orchestration challenges and frontend architectures.', sharedInterests: ['AI Agents', 'Open Source'] },
    connectedAt: '4h ago', requestedAt: '5h ago',
  },
  {
    id: 'c3', user: { id: 'u4', name: 'James Okonkwo', title: 'VP Engineering', company: 'Lattice' },
    status: 'pending', requestedAt: '1h ago',
  },
  {
    id: 'c4', user: { id: 'u5', name: 'Luna Zhang', title: 'ML Engineer', company: 'Anthropic' },
    status: 'pending', requestedAt: '30m ago',
  },
];

export const mockVenueZones: VenueZone[] = [
  { id: 'z1', name: 'Main Hall', icon: '🎤', activeCount: 45, trendingTopics: ['AI Agents', 'React 19', 'Web Performance'], color: '#6366F1' },
  { id: 'z2', name: 'Coffee Lounge', icon: '☕', activeCount: 28, trendingTopics: ['Startups', 'Hiring', 'Open Source'], color: '#F59E0B' },
  { id: 'z3', name: 'Workshop Area', icon: '🔧', activeCount: 18, trendingTopics: ['TypeScript', 'System Design', 'DevOps'], color: '#22C55E' },
  { id: 'z4', name: 'Expo Hall', icon: '🏢', activeCount: 62, trendingTopics: ['Developer Tools', 'Cloud', 'AI'], color: '#8B5CF6' },
  { id: 'z5', name: 'Networking Area', icon: '🤝', activeCount: 34, trendingTopics: ['Career Growth', 'Mentorship', 'Freelancing'], color: '#EC4899' },
  { id: 'z6', name: 'Quiet Zone', icon: '📚', activeCount: 8, trendingTopics: ['Deep Work', 'Reading', 'Reflection'], color: '#14B8A6' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'connection_request', title: 'New Connection Request', message: 'James Okonkwo wants to connect with you', read: false, createdAt: '5m ago', actionUrl: '/connections' },
  { id: 'n2', type: 'mission_milestone', title: 'Mission Progress!', message: 'You\'re 60% to your goal of meeting 5 founders', read: false, createdAt: '1h ago', actionUrl: '/dashboard' },
  { id: 'n3', type: 'recommendation', title: 'New Match Found', message: 'Luna Zhang (96% match) is now available to network', read: true, createdAt: '2h ago', actionUrl: '/recommendations/r5' },
  { id: 'n4', type: 'meeting_reminder', title: 'Meeting in 30 minutes', message: 'Coffee chat with Sarah Kim at Coffee Lounge', read: true, createdAt: '3h ago' },
];

export const mockActivity: ActivityItem[] = [
  { id: 'act1', type: 'connection', title: 'Connected with Sarah Kim', description: 'CEO at DevFlow — discussed AI code review', timestamp: '2h ago', icon: '🤝' },
  { id: 'act2', type: 'session', title: 'Attended AI Agents talk', description: 'Key insight: reliability > capability', timestamp: '3h ago', icon: '🎤' },
  { id: 'act3', type: 'achievement', title: 'Mission milestone reached', description: '3 of 5 founders met', timestamp: '4h ago', icon: '🏆' },
  { id: 'act4', type: 'connection', title: 'Met Marcus Rivera', description: 'CTO at Synthwave Labs — AI agent infrastructure', timestamp: '4h ago', icon: '💬' },
  { id: 'act5', type: 'meeting', title: 'Scheduled follow-up', description: 'Coffee chat with Priya Sharma tomorrow 10 AM', timestamp: '5h ago', icon: '📅' },
];

export const mockOrganizerMetrics: AnalyticsMetric[] = [
  { label: 'Active Attendees', value: 2847, change: 12, changeLabel: 'vs yesterday', icon: '👥' },
  { label: 'Connections Made', value: 1293, change: 23, changeLabel: 'today', icon: '🤝' },
  { label: 'Meetings Scheduled', value: 456, change: 8, changeLabel: 'this hour', icon: '📅' },
  { label: 'Mission Completion', value: 67, change: 5, changeLabel: 'vs avg', icon: '🎯' },
  { label: 'Active Networkers', value: 892, change: -3, changeLabel: 'vs last hour', icon: '📡' },
  { label: 'Session Engagement', value: 84, change: 7, changeLabel: 'satisfaction', icon: '⭐' },
];
