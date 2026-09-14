import { apiClient } from './api/client'
import type {
  AdminServiceDetail,
  CreateServiceOfferPayload,
  CreateServiceOptionPayload,
  UpdateServiceOfferPayload,
  UpdateServiceOptionPayload,
} from '../types/admin-service-detail.types'

export async function getAdminServiceDetail(id: number): Promise<AdminServiceDetail> {
  const { data } = await apiClient.get<AdminServiceDetail>(`/catalog/admin/services/${id}`)
  return data
}

// ─── Paquetes y add-ons ───────────────────────────────────────────────────────

export async function createServiceOption(
  serviceId: number,
  payload: CreateServiceOptionPayload,
): Promise<void> {
  await apiClient.post(`/catalog/services/${serviceId}/options`, payload)
}

export async function updateServiceOption(
  id: number,
  payload: UpdateServiceOptionPayload,
): Promise<void> {
  await apiClient.patch(`/catalog/service-option/${id}`, payload)
}

/** Siempre soft: OrderItemOption referencia esta fila por FK */
export async function deleteServiceOption(id: number): Promise<void> {
  await apiClient.delete(`/catalog/service-option/${id}`)
}

// ─── Ofertas ──────────────────────────────────────────────────────────────────

export async function createServiceOffer(payload: CreateServiceOfferPayload): Promise<void> {
  await apiClient.post('/catalog/service-offer', payload)
}

export async function updateServiceOffer(
  id: number,
  payload: UpdateServiceOfferPayload,
): Promise<void> {
  await apiClient.patch(`/catalog/service-offer/${id}`, payload)
}

export async function deleteServiceOffer(id: number): Promise<void> {
  await apiClient.delete(`/catalog/service-offer/${id}`)
}
