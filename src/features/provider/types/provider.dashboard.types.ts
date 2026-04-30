// Frontend display types for provider dashboard UI.
// Backend DTOs live in src/types/provider.types.ts.

export type JobStatus = 'new' | 'accepted' | 'in-progress' | 'completed'
export type JobPriority = 'high' | 'normal'

// UI model mapped from ProviderJobDto
export interface Job {
  id: number
  service: string
  game: string
  category: string
  package: string
  addons: string[]
  customer: string
  customerAvatar: string
  reward: number
  deadline: string
  status: JobStatus
  priority: JobPriority
  notes: string | null
}

// Matches ProviderStatsResponse exactly
export interface DashboardStats {
  activeJobs: number
  completedToday: number
  earningsToday: string   // string (monetary, from backend)
  totalEarnings: string   // string (monetary, from backend)
  ratingAvg: number
  totalOrdersCompleted: number
}
