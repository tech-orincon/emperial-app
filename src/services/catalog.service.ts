/* eslint-disable @typescript-eslint/no-unused-vars */
// ─── Catalog Service ──────────────────────────────────────────────────────────
//
// Backend integration points for games, categories and services.

import { apiClient } from './api/client';
import type { Game, Category, Service, HomeData, GameCategoryResponseDto, CategoryServiceResponseDto, ServiceDetail, ReviewsResponse } from '../types/catalog.types';

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

// TODO: Replace with real API call → GET /games
export async function getGames(): Promise<Game[]> {
  throw new Error('catalog.service.getGames: not implemented');
}

// TODO: Replace with real API call → GET /games/:gameId/categories
export async function getCategories(_gameId: string): Promise<Category[]> {
  throw new Error('catalog.service.getCategories: not implemented');
}

// TODO: Replace with real API call → GET /services?game=&category=
export async function getServices(_filters: {
  gameId?: string;
  categoryId?: string;
}): Promise<Service[]> {
  throw new Error('catalog.service.getServices: not implemented');
}

// TODO: Replace with real API call → GET /services/:id
export async function getServiceById(_id: string): Promise<Service> {
  throw new Error('catalog.service.getServiceById: not implemented');
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
