/* eslint-disable @typescript-eslint/no-unused-vars */
// ─── Catalog Service ──────────────────────────────────────────────────────────
//
// Backend integration points for games, categories and services.
// Replace mock implementations with real API calls.

import type { Game, Category, Service } from '../types/catalog.types';

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
