import { useState, useEffect } from 'react'
import { getGameCategories, getCategoryServices } from '../../../services/catalog.service'
import type { GameCategoryResponseDto, CategoryServiceResponseDto } from '../../../types/catalog.types'

interface CategoryLoadState {
  data: GameCategoryResponseDto[]
  isLoading: boolean
  error: boolean
}

interface ServiceLoadState {
  data: CategoryServiceResponseDto[]
  isLoading: boolean
  error: boolean
}

export interface CatalogState {
  categories: CategoryLoadState
  servicesBySlug: Record<string, ServiceLoadState>
}

export function useCatalog(gameId: number | null): CatalogState {
  const [categories, setCategories] = useState<CategoryLoadState>({ data: [], isLoading: false, error: false })
  const [servicesBySlug, setServicesBySlug] = useState<Record<string, ServiceLoadState>>({})

  useEffect(() => {
    if (!gameId) return
    let cancelled = false

    setCategories({ data: [], isLoading: true, error: false })
    setServicesBySlug({})

    getGameCategories(gameId)
      .then((cats) => {
        if (cancelled) return
        setCategories({ data: cats, isLoading: false, error: false })

        // Only fetch services for categories that have them
        const activeCats = cats.filter((c) => c.countServices > 0)
        if (activeCats.length === 0) return

        // Mark all active categories as loading simultaneously
        setServicesBySlug(
          Object.fromEntries(activeCats.map((c) => [c.slug, { data: [], isLoading: true, error: false }]))
        )

        // Parallel fetch — each category is independent
        for (const cat of activeCats) {
          getCategoryServices(cat.slug)
            .then((services) => {
              if (!cancelled) {
                setServicesBySlug((prev) => ({
                  ...prev,
                  [cat.slug]: { data: services, isLoading: false, error: false },
                }))
              }
            })
            .catch(() => {
              if (!cancelled) {
                setServicesBySlug((prev) => ({
                  ...prev,
                  [cat.slug]: { data: [], isLoading: false, error: true },
                }))
              }
            })
        }
      })
      .catch(() => {
        if (!cancelled) setCategories({ data: [], isLoading: false, error: true })
      })

    return () => { cancelled = true }
  }, [gameId])

  return { categories, servicesBySlug }
}
