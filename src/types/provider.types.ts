export type JobStatus = 'available' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
export type JobPriority = 'urgent' | 'high' | 'normal';

export interface ProviderJob {
  id: string;
  orderId: string;
  serviceTitle: string;
  gameId: string;
  categoryId: string;
  payout: number;
  priority: JobPriority;
  status: JobStatus;
  customerUsername: string;
  characterDetails: Record<string, string>;
  deadline?: string;
  createdAt: string;
}

export interface ProviderStats {
  totalEarnings: number;
  weeklyEarnings: number;
  completedJobs: number;
  rating: number;
  reviewCount: number;
  acceptanceRate: number;
}

export interface ProviderProfile {
  id: string;
  username: string;
  bio: string;
  avatarUrl?: string;
  stats: ProviderStats;
  skills: string[];
  isOnline: boolean;
  joinedAt: string;
}
