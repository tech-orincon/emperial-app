// ─── Catalog Service ──────────────────────────────────────────────────────────
//
// Backend integration points for games, categories and services.

import { apiClient } from './api/client';
import type {
  HomeData,
  GameCategoryResponseDto,
  CategoryServiceResponseDto,
  ServiceDetail,
  ReviewsResponse,
} from '../types/catalog.types';

// ─── Home ─────────────────────────────────────────────────────────────────────

/** GET /catalog/home — public, no auth required */
export async function getHomeData(): Promise<HomeData> {
  const { data } = await apiClient.get<HomeData>('/catalog/home');
  return data;
}

// ─── Game Categories ──────────────────────────────────────────────────────────

/** GET /catalog/games/{gameId}/categories */
export async function getGameCategories(gameId: number): Promise<GameCategoryResponseDto[]> {
  const { data } = await apiClient.get<GameCategoryResponseDto[]>(`/catalog/games/${gameId}/categories`);
  return data;
}

// ─── Category Services ────────────────────────────────────────────────────────

/** GET /catalog/categories/{slug}/services */
export async function getCategoryServices(slug: string): Promise<CategoryServiceResponseDto[]> {
  const { data } = await apiClient.get<CategoryServiceResponseDto[]>(`/catalog/categories/${slug}/services`);
  return data;
}

// ─── Service Detail ───────────────────────────────────────────────────────────

/** GET /catalog/services/{id} */
export async function getServiceDetail(id: string): Promise<ServiceDetail> {
  const { data } = await apiClient.get<ServiceDetail>(`/catalog/services/${id}`);
  return data;
}

/** GET /catalog/services/{id}/reviews?page=&limit= */
export async function getServiceReviews(id: string, page = 1, limit = 10): Promise<ReviewsResponse> {
  const { data } = await apiClient.get<ReviewsResponse>(`/catalog/services/${id}/reviews`, {
    params: { page, limit },
  });
  return data;
}
