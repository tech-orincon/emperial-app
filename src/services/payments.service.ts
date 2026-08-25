// ─── Payments Service ─────────────────────────────────────────────────────────

import { apiClient } from './api/client'
import type {
  CreatePaymentIntentRequest,
  PaymentIntentResponse,
} from '../types/payments.types'

/**
 * POST /payments/intent — crea una única intención de pago para todas las
 * órdenes del checkout. El monto lo calcula el backend desde las órdenes
 * persistidas; aquí sólo se mandan los ids.
 */
export async function createPaymentIntent(
  payload: CreatePaymentIntentRequest,
): Promise<PaymentIntentResponse> {
  const { data } = await apiClient.post<PaymentIntentResponse>('/payments/intent', payload)
  return data
}
