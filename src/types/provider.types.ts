// Tipos alineados exactamente con los DTOs del backend (src/modules/provider/dto).
// No usar modelos internos de Prisma. No inferir campos que no existan.

export type ProviderTier = 'STANDARD' | 'ADVANCED' | 'MASTER' | 'ELITE'

// ─── GET /provider/jobs ────────────────────────────────────────────────────────

export interface ProviderJobDto {
  id: number
  /** OrderStatus del backend: QUEUED | ACCEPTED | IN_PROGRESS | COMPLETED | ... */
  status: string
  priority: 'HIGH' | 'NORMAL'
  reward: string
  createdAt: string
  deadline: string | null
  service: {
    id: number
    title: string
    imageUrl: string | null
    game: { name: string }
    category: { name: string }
  }
  /** null si la orden no tiene opción de tipo PACKAGE */
  package: {
    id: number
    name: string
  } | null
  addons: {
    id: number
    name: string
  }[]
  customer: {
    id: number
    username: string
    avatarInitials: string
    realm: string | null
  }
  notes: string | null
}

export interface ProviderJobsResponseDto {
  data: ProviderJobDto[]
  total: number
  page: number
  limit: number
}

// ─── Acciones sobre jobs ───────────────────────────────────────────────────────
//
// accept / reject / start / complete devuelven el job actualizado, no { success }.

export type JobActionResponseDto = ProviderJobDto

// ─── GET /provider/stats ───────────────────────────────────────────────────────

export interface ProviderStatsResponseDto {
  activeJobs: number
  completedToday: number
  /** monetario, serializado como string */
  earningsToday: string
  /** monetario, serializado como string */
  earningsWeek: string
  rating: number
  totalReviews: number
  completionRate: number
  avgResponseMinutes: number
}

// ─── GET /provider/profile ─────────────────────────────────────────────────────

export interface ProfileReviewDto {
  id: number
  customerUsername: string
  rating: number
  comment: string
  createdAt: string
}

export interface ProviderProfileResponseDto {
  id: number
  username: string
  avatarUrl: string | null
  specialization: string | null
  tier: ProviderTier
  isVerified: boolean
  isOnline: boolean
  completedJobs: number
  rating: number
  totalReviews: number
  yearsExperience: number
  completionRate: number
  avgResponseMinutes: number
  earningsWeek: string
  badges: string[]
  recentReviews: ProfileReviewDto[]
}

// ─── PATCH /provider/availability ─────────────────────────────────────────────

export interface UpdateAvailabilityRequestDto {
  isOnline: boolean
}

export interface UpdateAvailabilityResponseDto {
  isOnline: boolean
}
