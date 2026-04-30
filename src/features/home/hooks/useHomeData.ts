import { useState, useEffect } from 'react'
import { getHomeData } from '../../../services/catalog.service'
import type { HomeGame, HomeOffer } from '../../../types/catalog.types'

interface State {
  games: HomeGame[]
  offers: HomeOffer[]
  isLoading: boolean
}

export function useHomeData(): State {
  const [state, setState] = useState<State>({ games: [], offers: [], isLoading: true })

  useEffect(() => {
    let cancelled = false
    getHomeData()
      .then((data) => {
        if (!cancelled) setState({ games: data.games, offers: data.offers, isLoading: false })
      })
      .catch(() => {
        if (!cancelled) setState({ games: [], offers: [], isLoading: false })
      })
    return () => { cancelled = true }
  }, [])

  return state
}
