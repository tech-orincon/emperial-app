import { useState, useEffect } from 'react';
import {
  getCountries,
  getTimezones,
  getGames,
  getGameAttributes,
  getGameCategories,
} from '../../../services/reference.service';
import type {
  CountryDto,
  TimezoneDto,
  GameDto,
  GameAttributeDto,
  GameCategoryDto,
} from '../../../types/reference.types';

interface ReferenceDataState {
  countries: CountryDto[];
  timezones: TimezoneDto[];
  games: GameDto[];
  gameAttributes: GameAttributeDto[];
  gameCategories: GameCategoryDto[];
  isLoadingStatic: boolean;
  isLoadingGame: boolean;
  staticError: string | null;
}

/**
 * Loads and caches reference data for the provider onboarding form.
 *
 * - Static data (countries, timezones, games) is fetched once on mount.
 * - Game-specific data (attributes, categories) is re-fetched whenever
 *   `selectedGameId` changes (and reset to [] when it becomes null).
 */
export function useReferenceData(selectedGameId: number | null) {
  const [state, setState] = useState<ReferenceDataState>({
    countries: [],
    timezones: [],
    games: [],
    gameAttributes: [],
    gameCategories: [],
    isLoadingStatic: true,
    isLoadingGame: false,
    staticError: null,
  });

  // ── Static data — fetch once ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadStatic() {
      try {
        const [countries, timezones, games] = await Promise.all([
          getCountries(),
          getTimezones(),
          getGames(),
        ]);
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            countries,
            timezones,
            games,
            isLoadingStatic: false,
          }));
        }
      } catch {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            isLoadingStatic: false,
            staticError: 'Failed to load reference data. Please refresh.',
          }));
        }
      }
    }

    loadStatic();
    return () => { cancelled = true; };
  }, []);

  // ── Game-specific data — re-fetch on game change ────────────────────────────
  useEffect(() => {
    if (!selectedGameId) {
      setState((prev) => ({ ...prev, gameAttributes: [], gameCategories: [] }));
      return;
    }

    const gameId = selectedGameId;
    let cancelled = false;
    setState((prev) => ({ ...prev, isLoadingGame: true }));

    async function loadGameData() {
      try {
        const [attributes, categories] = await Promise.all([
          getGameAttributes(gameId),
          getGameCategories(gameId),
        ]);
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            gameAttributes: attributes,
            gameCategories: categories,
            isLoadingGame: false,
          }));
        }
      } catch {
        if (!cancelled) {
          setState((prev) => ({ ...prev, isLoadingGame: false }));
        }
      }
    }

    loadGameData();
    return () => { cancelled = true; };
  }, [selectedGameId]);

  return state;
}
