// ─── Backoffice Service ───────────────────────────────────────────────────────
//
// Todos estos endpoints exigen rol ADMIN en el backend (RolesGuard).

import { apiClient } from './api/client'
import type {
  AdminCategory,
  AdminCountry,
  AdminGame,
  AdminGameAttribute,
  AdminService,
  AdminTimezone,
  CreateCountryPayload,
  CreateTimezonePayload,
  UpdateCountryPayload,
  UpdateGameAttributePayload,
  UpdateTimezonePayload,
  CreateCategoryPayload,
  CreateGamePayload,
  RequirementItem,
  TextItem,
  UpdateCategoryPayload,
  UpdateGamePayload,
  UpdateServicePayload,
} from '../types/admin.types'

// ─── Juegos ───────────────────────────────────────────────────────────────────

export async function getAdminGames(): Promise<AdminGame[]> {
  const { data } = await apiClient.get<AdminGame[]>('/catalog/admin/games')
  return data
}

export async function createGame(payload: CreateGamePayload): Promise<void> {
  await apiClient.post('/catalog/game', payload)
}

export async function updateGame(id: number, payload: UpdateGamePayload): Promise<void> {
  await apiClient.patch(`/catalog/game/${id}`, payload)
}

export async function deleteGame(id: number): Promise<void> {
  await apiClient.delete(`/catalog/game/${id}`)
}

// ─── Categorías ───────────────────────────────────────────────────────────────

export async function getAdminCategories(gameId?: number): Promise<AdminCategory[]> {
  const { data } = await apiClient.get<AdminCategory[]>('/catalog/admin/categories', {
    params: gameId ? { gameId } : undefined,
  })
  return data
}

export async function createCategory(payload: CreateCategoryPayload): Promise<void> {
  await apiClient.post('/catalog/category', payload)
}

export async function updateCategory(
  id: number,
  payload: UpdateCategoryPayload,
): Promise<void> {
  await apiClient.patch(`/catalog/category/${id}`, payload)
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/catalog/category/${id}`)
}

// ─── Servicios ────────────────────────────────────────────────────────────────

export async function getAdminServices(filter?: {
  gameId?: number
  categoryId?: number
}): Promise<AdminService[]> {
  const { data } = await apiClient.get<AdminService[]>('/catalog/admin/services', {
    params: filter,
  })
  return data
}

export async function updateService(
  id: number,
  payload: UpdateServicePayload,
): Promise<void> {
  await apiClient.patch(`/catalog/service/${id}`, payload)
}

export async function deleteService(id: number): Promise<void> {
  await apiClient.delete(`/catalog/service/${id}`)
}

// ─── Contenido de un servicio (reemplazo total) ───────────────────────────────

export async function replaceServiceFeatures(id: number, items: TextItem[]): Promise<void> {
  await apiClient.put(`/catalog/services/${id}/features`, { items })
}

export async function replaceServiceRequirements(
  id: number,
  items: RequirementItem[],
): Promise<void> {
  await apiClient.put(`/catalog/services/${id}/requirements`, { items })
}

// ─── Países ───────────────────────────────────────────────────────────────────

export async function getAdminCountries(): Promise<AdminCountry[]> {
  const { data } = await apiClient.get<AdminCountry[]>('/reference/admin/countries')
  return data
}

export async function createCountry(payload: CreateCountryPayload): Promise<void> {
  await apiClient.post('/reference/country', payload)
}

export async function updateCountry(id: number, payload: UpdateCountryPayload): Promise<void> {
  await apiClient.patch(`/reference/country/${id}`, payload)
}

export async function deleteCountry(id: number): Promise<void> {
  await apiClient.delete(`/reference/country/${id}`)
}

// ─── Zonas horarias ───────────────────────────────────────────────────────────

export async function getAdminTimezones(): Promise<AdminTimezone[]> {
  const { data } = await apiClient.get<AdminTimezone[]>('/reference/admin/timezones')
  return data
}

export async function createTimezone(payload: CreateTimezonePayload): Promise<void> {
  await apiClient.post('/reference/timezone', payload)
}

export async function updateTimezone(id: number, payload: UpdateTimezonePayload): Promise<void> {
  await apiClient.patch(`/reference/timezone/${id}`, payload)
}

/** No borra: la tabla no tiene deletedAt, el backend pone isActive: false */
export async function deactivateTimezone(id: number): Promise<void> {
  await apiClient.delete(`/reference/timezone/${id}`)
}

// ─── Atributos de juego ───────────────────────────────────────────────────────

export async function getAdminGameAttributes(gameId: number): Promise<AdminGameAttribute[]> {
  const { data } = await apiClient.get<AdminGameAttribute[]>(
    `/catalog/admin/games/${gameId}/attributes`,
  )
  return data
}

/** Devuelve cuántos providers ya tienen datos bajo la key del atributo */
export async function updateGameAttribute(
  id: number,
  payload: UpdateGameAttributePayload,
): Promise<{ providersAffected: number }> {
  const { data } = await apiClient.patch<{ success: true; providersAffected: number }>(
    `/catalog/game-attribute/${id}`,
    payload,
  )
  return { providersAffected: data.providersAffected }
}

export async function deactivateGameAttribute(id: number): Promise<void> {
  await apiClient.delete(`/catalog/game-attribute/${id}`)
}
