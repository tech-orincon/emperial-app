// ─── Sub-entidades de un servicio en el backoffice ────────────────────────────
//
// Espejo de admin-service-detail.response.dto.ts y service-sub-entities.request.dto.ts.
// El detalle público (`GET /catalog/services/:id`) no sirve aquí: filtra las ofertas
// por vigencia y no expone su id, así que no se podrían editar.

export type ServiceOptionType = 'PACKAGE' | 'ADDON'

export type OfferTag = 'BEST_VALUE' | 'POPULAR' | 'FLASH_SALE' | 'LIMITED'

export interface AdminOptionFeature {
  text: string
  displayOrder: number
}

export interface AdminServiceOption {
  id: number
  name: string
  /** Decimal serializado como string */
  price: string
  type: ServiceOptionType
  isPopular: boolean
  displayOrder: number
  description: string | null
  features: AdminOptionFeature[]
}

export interface AdminRequirement {
  id: number
  title: string
  description: string
  displayOrder: number
}

export interface AdminOffer {
  id: number
  title: string | null
  discountPct: number | null
  originalPrice: string | null
  finalPrice: string
  isActive: boolean
  startsAt: string | null
  endsAt: string | null
  tag: OfferTag | null
}

export interface AdminServiceDetail {
  id: number
  title: string
  game: { id: number; name: string }
  category: { id: number; name: string }
  isActive: boolean
  deletedAt: string | null
  packages: AdminServiceOption[]
  addons: AdminServiceOption[]
  features: AdminOptionFeature[]
  requirements: AdminRequirement[]
  /** Incluye caducadas e inactivas */
  offers: AdminOffer[]
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateServiceOptionPayload {
  name: string
  price: number
  type: ServiceOptionType
  isPopular?: boolean
  description?: string
  displayOrder?: number
  features?: { text: string; displayOrder?: number }[]
}

/** Omitir `features` deja la lista intacta; `[]` la vacía */
export type UpdateServiceOptionPayload = Partial<CreateServiceOptionPayload>

export interface CreateServiceOfferPayload {
  serviceId: number
  title?: string
  discountPct?: number
  originalPrice?: number
  /** El backend lo valida como positivo: 0 se rechaza */
  finalPrice: number
  isActive?: boolean
  startsAt?: string
  endsAt?: string
  tag?: OfferTag
}

export type UpdateServiceOfferPayload = Partial<Omit<CreateServiceOfferPayload, 'serviceId'>>
