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
  provider: OrderProviderSnapshot | null
}

/** GET /orders — el backend no pagina hoy, sólo devuelve data + total */
export interface OrdersResponse {
  data: OrderDto[]
  total: number
}

export interface CreateOrderRequest {
  serviceId: number
  packageId: number
  addonIds: number[]
}
