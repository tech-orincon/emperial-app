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
  package: string | null
  addons: string[]
  customer: string
  customerAvatar: string
  reward: number
  deadline: string
  status: JobStatus
  priority: JobPriority
  notes: string | null
}

// Espejo de ProviderStatsResponseDto (GET /provider/stats)
export interface DashboardStats {
  activeJobs: number
  completedToday: number
  earningsToday: string   // monetario, string desde el backend
  earningsWeek: string    // monetario, string desde el backend
  rating: number
  totalReviews: number
  completionRate: number
  avgResponseMinutes: number
}
