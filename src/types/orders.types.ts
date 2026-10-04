// ─── Orders DTOs ──────────────────────────────────────────────────────────────
//
// Espejo de src/modules/orders/dto/response/order.response.dto.ts en el backend.

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'QUEUED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED'

export interface OrderServiceSnapshot {
  id: number
  title: string
  imageUrl: string | null
}

/** Opción de la orden (paquete o add-on) congelada al momento de la compra */
export interface OrderItemSnapshot {
  serviceOptionId: number
  name: string
  price: string
}

export interface OrderProviderSnapshot {
  id: number
  displayName: string
  avatarUrl: string | null
  ratingAvg: number
}

export interface OrderDto {
  id: number
  status: OrderStatus
  /** monetarios, serializados como string */
  originalPrice: string
  discountAmount: string
  totalPrice: string
  currency: string
  createdAt: string
  service: OrderServiceSnapshot
  /** null si la orden no tiene opción de tipo PACKAGE */
  package: OrderItemSnapshot | null
  addons: OrderItemSnapshot[]
  /** Desglose del configurador; vacío si se compró por paquete */
  configuration: OrderConfigLine[]
  provider: OrderProviderSnapshot | null
}

/** GET /orders — el backend no pagina hoy, sólo devuelve data + total */
export interface OrdersResponse {
  data: OrderDto[]
  total: number
}

export interface CreateOrderRequest {
  serviceId: number
  /** Exactamente uno de packageId o selection; el backend rechaza ambos o ninguno */
  packageId?: number
  /** Opciones del configurador. El precio lo recalcula el servidor. */
  selection?: number[]
  /** Tramos de los grupos de escala; acompaña a `selection` */
  ranges?: { groupId: number; from: number; to: number }[]
  addonIds?: number[]
}

/** Línea del desglose del configurador, congelada al comprar */
export interface OrderConfigLine {
  groupLabel: string
  label: string
  kind: 'ABSOLUTE' | 'PERCENT' | 'FIXED'
  amount: string
}
