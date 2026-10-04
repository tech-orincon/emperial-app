import { apiClient } from './api/client'
import type {
  ConfigOptionInput,
  CreateConfigGroupPayload,
  Quote,
  RangeSelection,
  ScalePointInput,
  ServiceConfig,
  UpdateConfigGroupPayload,
} from '../types/service-config.types'

/** Público: lo usa el invitado mientras navega */
export async function getServiceConfig(serviceId: number): Promise<ServiceConfig> {
  const { data } = await apiClient.get<ServiceConfig>(`/catalog/services/${serviceId}/config`)
  return data
}

/** El precio lo calcula el servidor; nunca se manda desde el cliente */
export async function quoteService(
  serviceId: number,
  optionIds: number[],
  ranges: RangeSelection[] = [],
): Promise<Quote> {
  const { data } = await apiClient.post<Quote>(`/catalog/services/${serviceId}/quote`, {
    optionIds,
    ranges,
  })
  return data
}

/** Reemplazo total de la escala de un grupo RANGE o FROM_TO */
export async function replaceScalePoints(
  groupId: number,
  items: ScalePointInput[],
): Promise<void> {
  await apiClient.put(`/catalog/config-group/${groupId}/scale`, { items })
}

// ─── Backoffice ───────────────────────────────────────────────────────────────

export async function createConfigGroup(
  serviceId: number,
  payload: CreateConfigGroupPayload,
): Promise<void> {
  await apiClient.post(`/catalog/services/${serviceId}/config-groups`, payload)
}

export async function updateConfigGroup(
  groupId: number,
  payload: UpdateConfigGroupPayload,
): Promise<void> {
  await apiClient.patch(`/catalog/config-group/${groupId}`, payload)
}

export async function deleteConfigGroup(groupId: number): Promise<void> {
  await apiClient.delete(`/catalog/config-group/${groupId}`)
}

/** Reemplazo total: items: [] vacía el grupo */
export async function replaceConfigOptions(
  groupId: number,
  items: ConfigOptionInput[],
): Promise<void> {
  await apiClient.put(`/catalog/config-group/${groupId}/options`, { items })
}
