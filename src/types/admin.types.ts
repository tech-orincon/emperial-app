// ─── Backoffice DTOs ──────────────────────────────────────────────────────────
//
// Espejo de src/modules/catalog/dto/{request,response} en el backend.
// A diferencia de los tipos públicos, estos incluyen inactivos y borrados.

import type { DeliveryType } from './catalog.types'

export interface AdminRef {
  id: number
  name: string
}

export interface AdminGame {
  id: number
  name: string
  slug: string
  imageUrl: string | null
  icon: string | null
  tags: string[]
  isActive: boolean
  deletedAt: string | null
  categoriesCount: number
  servicesCount: number
  providersCount: number
}

export interface AdminCategory {
  id: number
  game: AdminRef
  name: string
  slug: string
  description: string | null
  icon: string | null
  imageUrl: string | null
  isActive: boolean
  deletedAt: string | null
  servicesCount: number
  providerSkillsCount: number
}

export interface AdminService {
  id: number
  game: AdminRef
  category: AdminRef
  title: string
  description: string
  imageUrl: string | null
  /** Decimal serializado como string */
  basePrice: string
  deliveryType: DeliveryType
  deliveryTime: string | null
  estimatedTime: string
  isBestSeller: boolean
  isInstant: boolean
  isFeatured: boolean
  isActive: boolean
  deletedAt: string | null
  optionsCount: number
  offersCount: number
  ordersCount: number
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateGamePayload {
  name: string
  slug: string
  imageUrl?: string
  icon?: string
  tags?: string[]
}

/** Parcial: sólo se envían los campos que cambian */
export type UpdateGamePayload = Partial<CreateGamePayload & { isActive: boolean }>

export interface CreateCategoryPayload {
  gameId: number
  name: string
  slug: string
  description: string
  icon: string
  imageUrl?: string
}

export type UpdateCategoryPayload = Partial<
  Omit<CreateCategoryPayload, 'gameId'> & { isActive: boolean }
>

export type UpdateServicePayload = Partial<{
  gameCategoryId: number
  title: string
  description: string
  imageUrl: string
  isBestSeller: boolean
  isInstant: boolean
  deliveryType: DeliveryType
  deliveryTime: string
  basePrice: number
  estimatedTime: string
  isActive: boolean
  isFeatured: boolean
}>

export interface TextItem {
  text: string
  displayOrder?: number
}

export interface RequirementItem {
  title: string
  description: string
  displayOrder?: number
}

// ─── Referencia: países y zonas horarias ──────────────────────────────────────

export type CountryStatus = 'ACTIVE' | 'DISABLED'

export interface AdminCountry {
  id: number
  name: string
  isoCode: string
  currencyCode: string
  status: CountryStatus
  deletedAt: string | null
  usersCount: number
  providersCount: number
}

export interface AdminTimezone {
  id: number
  name: string
  label: string
  utcOffset: string
  region: string
  isActive: boolean
}

export interface CreateCountryPayload {
  name: string
  isoCode: string
  currencyCode: string
  status?: CountryStatus
}
export type UpdateCountryPayload = Partial<CreateCountryPayload>

export interface CreateTimezonePayload {
  name: string
  label: string
  utcOffset: string
  region: string
}
export type UpdateTimezonePayload = Partial<CreateTimezonePayload & { isActive: boolean }>

// ─── Atributos de juego (campos del onboarding) ───────────────────────────────

export type AttributeInputType = 'TEXT' | 'NUMBER' | 'SELECT' | 'MULTI_SELECT'

export interface AdminAttributeOption {
  id: number
  value: string
  label: string
  displayOrder: number
  isActive: boolean
}

export interface AdminGameAttribute {
  id: number
  /** Inmutable: indexa el JSON de ProviderGameProfile.data */
  key: string
  label: string
  /** Inmutable tras la creación */
  inputType: AttributeInputType
  isRequired: boolean
  displayOrder: number
  isActive: boolean
  options: AdminAttributeOption[]
}

export interface AttributeOptionItem {
  value: string
  label: string
  displayOrder?: number
}

export interface UpdateGameAttributePayload {
  label?: string
  isRequired?: boolean
  displayOrder?: number
  isActive?: boolean
  /** Omitir deja las opciones intactas; [] las borra */
  options?: AttributeOptionItem[]
}
