// ─── Reference & Catalog Service ──────────────────────────────────────────────
//
// Public endpoints — no auth required by the server.
// Static collections (countries, timezones, games) are cached in memory for the
// duration of the session so they are fetched at most once per page load.

import { apiClient } from './api/client';
import type {
  CountryDto,
  TimezoneDto,
  GameDto,
  GameAttributeDto,
  GameCategoryDto,
} from '../types/reference.types';

// ─── In-memory cache for session-static data ──────────────────────────────────

let countriesCache: CountryDto[] | null = null;
let timezonesCache: TimezoneDto[] | null = null;
let gamesCache: GameDto[] | null = null;

// ─── Countries ────────────────────────────────────────────────────────────────

export async function getCountries(): Promise<CountryDto[]> {
  if (!countriesCache) {
    const { data } = await apiClient.get<CountryDto[]>('/reference/countries');
    countriesCache = data;
  }
  return countriesCache;
}

// ─── Timezones ────────────────────────────────────────────────────────────────

export async function getTimezones(): Promise<TimezoneDto[]> {
  if (!timezonesCache) {
    const { data } = await apiClient.get<TimezoneDto[]>('/reference/timezones');
    timezonesCache = data;
  }
  return timezonesCache;
}

// ─── Games ────────────────────────────────────────────────────────────────────

export async function getGames(): Promise<GameDto[]> {
  if (!gamesCache) {
    const { data } = await apiClient.get<GameDto[]>('/catalog/games');
    gamesCache = data;
  }
  return gamesCache;
}

// ─── Game-specific (depend on gameId — not cached) ───────────────────────────

/**
 * Returns the dynamic form attributes for a specific game, sorted by
 * displayOrder so the UI can render them in the correct sequence.
 */
export async function getGameAttributes(gameId: number): Promise<GameAttributeDto[]> {
  const { data } = await apiClient.get<GameAttributeDto[]>(
    `/catalog/games/${gameId}/attributes`,
  );
  return data.sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Returns the service categories available for a specific game.
 * Used to populate the "services you offer" step in provider onboarding.
 */
export async function getGameCategories(gameId: number): Promise<GameCategoryDto[]> {
  const { data } = await apiClient.get<GameCategoryDto[]>(
    `/catalog/games/${gameId}/categories`,
  );
  return data;
}
