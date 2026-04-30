// Tipos alineados exactamente con los DTOs del OpenAPI del backend.
// No usar modelos internos de Prisma. No inferir campos que no existan.

// ─── GET /provider/jobs ────────────────────────────────────────────────────────

export interface ProviderJobDto {
  id: number
  status: string
  priority: string
  reward: string
  createdAt: string
  deadline: string | null
  service: {
    id: number
    title: string
    imageUrl?: string
    game: { name: string }
    category: { name: string }
  }
  package: {
    id: number
    name: string
  }
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

// ─── GET /provider/jobs/:id ────────────────────────────────────────────────────

export interface ProviderJobDetailResponseDto {
  id: number
  status: string
  priority: string
  totalPrice: string
  currency: string
  originalPrice?: string
  discountAmount?: string
  createdAt: string
  deadline?: string
  notes?: string
  service: {
    id: number
    title: string
    imageUrl?: string
  }
  user: {
    id: number
    username: string
    avatarUrl?: string
  }
  options: {
    name: string
    type: string
    price: string
  }[]
  canAccept: boolean
  canStart: boolean
  canComplete: boolean
}

// ─── Action responses ──────────────────────────────────────────────────────────

export interface AcceptJobResponseDto {
  success: boolean
  message?: string
}

export interface RejectJobResponseDto {
  success: boolean
  message?: string
}

export interface StartJobResponseDto {
  success: boolean
}

export interface CompleteJobResponseDto {
  success: boolean
}

// ─── GET /provider/stats ───────────────────────────────────────────────────────

export interface ProviderStatsResponseDto {
  activeJobs: number
  completedToday: number
  earningsToday: string
  totalEarnings: string
  ratingAvg: number
  totalOrdersCompleted: number
}

// ─── GET /provider/profile ─────────────────────────────────────────────────────

export interface ProviderProfileResponseDto {
  id: number
  displayName: string
  avatarUrl?: string
  tier: string
  ratingAvg: number
  totalOrdersCompleted: number
  isOnline: boolean
  isActive: boolean
  verificationStatus: string
  completionRate?: number
}

// ─── PATCH /provider/availability ─────────────────────────────────────────────

export interface UpdateAvailabilityRequestDto {
  isOnline: boolean
}

export interface UpdateAvailabilityResponseDto {
  success: boolean
}
