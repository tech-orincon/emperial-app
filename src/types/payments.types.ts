// ─── Payments DTOs ────────────────────────────────────────────────────────────
//
// Espejo de src/modules/payments/dto en el backend.

export interface CreatePaymentIntentRequest {
  /** Todas las órdenes del checkout se cobran en una sola intención */
  orderIds: number[]
}

export interface PaymentIntentResponse {
  orderIds: number[]
  /** Secreto que consume el Payment Element para confirmar el cobro */
  clientSecret: string
  /** Total cobrado en unidades mayores, serializado como string */
  amount: string
  currency: string
}
