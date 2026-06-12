// ===== Core Domain Types =====

export interface User {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  skills: string[];
  interests: string[];
  role: 'attendee' | 'organizer' | 'admin' | 'sponsor' | 'speaker';
  networkingStatus: NetworkingStatus;
  createdAt: string;
}

export interface Mission {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  category: 'networking' | 'learning' | 'hiring' | 'business' | 'general';
  achievements: Achievement[];
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  completedAt: string;
}

export interface Recommendation {
  id: string;
  type: 'person' | 'session' | 'sponsor';
  title: string;
  subtitle: string;
  avatar?: string;
  matchScore: number;
  reasoning: string[];
  suggestedAction: string;
  conversationStarter?: string;
  tags: string[];
  availability?: 'available' | 'busy' | 'offline';
  saved: boolean;
  connected: boolean;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  speakers: Speaker[];
  topics: string[];
  time: string;
  duration: string;
  location: string;
  attendeeCount: number;
  matchScore: number;
  reasoning: string[];
  saved: boolean;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  description: string;
  hiringRoles: string[];
  products: string[];
  matchScore: number;
  reasoning: string[];
  boothLocation: string;
}

export interface Connection {
  id: string;
  user: Pick<User, 'id' | 'name' | 'title' | 'company' | 'avatar'>;
  status: 'pending' | 'accepted' | 'declined';
  meetingSuggestion?: MeetingSuggestion;
  connectedAt?: string;
  requestedAt: string;
}

export interface MeetingSuggestion {
  location: string;
  conversationStarter: string;
  sharedInterests: string[];
  suggestedTime?: string;
}

export interface NetworkingStatus {
  status: 'available' | 'busy' | 'offline';
  location?: string;
  availableUntil?: string;
  topics?: string[];
}

export interface VenueZone {
  id: string;
  name: string;
  icon: string;
  activeCount: number;
  trendingTopics: string[];
  color: string;
}

export interface Notification {
  id: string;
  type: 'connection_request' | 'meeting_reminder' | 'mission_milestone' | 'recommendation' | 'networking';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AnalyticsMetric {
  label: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: string;
}

export interface ActivityItem {
  id: string;
  type: 'connection' | 'meeting' | 'achievement' | 'session' | 'mission';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface OnboardingData {
  name: string;
  title: string;
  company: string;
  bio: string;
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
  skills: string[];
  interests: string[];
  mission: string;
  missionCategory: Mission['category'];
  missionTarget: number;
}
