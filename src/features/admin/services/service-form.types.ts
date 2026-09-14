import type { DeliveryType } from '../../../types/catalog.types'

export interface ServiceFormValues {
  gameId: number | null
  gameCategoryId: number | null
  title: string
  description: string
  imageUrl: string
  /** Como texto para no pelear con el input mientras se escribe */
  basePrice: string
  deliveryType: DeliveryType
  deliveryTime: string
  estimatedTime: string
  isBestSeller: boolean
  isInstant: boolean
  isFeatured: boolean
  isActive: boolean
}

export const EMPTY_SERVICE: ServiceFormValues = {
  gameId: null,
  gameCategoryId: null,
  title: '',
  description: '',
  imageUrl: '',
  basePrice: '',
  deliveryType: 'FIXED',
  deliveryTime: '',
  estimatedTime: '',
  isBestSeller: false,
  isInstant: false,
  isFeatured: false,
  isActive: true,
}

export const DELIVERY_TYPES: DeliveryType[] = ['FIXED', 'RANGE', 'FLEXIBLE', 'SCHEDULED']

export const inputCls =
  'w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50'
