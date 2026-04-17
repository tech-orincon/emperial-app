export type JobStatus = 'new' | 'accepted' | 'in-progress' | 'completed'
export type JobPriority = 'high' | 'normal'

export interface Job {
  id: string
  service: string
  customer: string
  customerAvatar: string
  realm: string
  reward: number
  deadline: string
  status: JobStatus
  priority: JobPriority
  notes?: string
  addons?: string[]
}

export interface DashboardStats {
  activeJobs: number
  completedToday: number
  earningsToday: number
  rating: number
  totalReviews: number
}
