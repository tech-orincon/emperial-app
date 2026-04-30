import { useEffect, useState } from 'react'
import { getServiceReviews } from '../../../services/catalog.service'
import type { ReviewsResponse } from '../../../types/catalog.types'

interface State {
  data: ReviewsResponse | null
  isLoading: boolean
  error: boolean
}

export function useServiceReviews(id: string | undefined, page: number, limit: number): State {
  const [state, setState] = useState<State>({ data: null, isLoading: true, error: false })

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setState((s) => ({ ...s, isLoading: true, error: false }))
    getServiceReviews(id, page, limit)
      .then((data) => { if (!cancelled) setState({ data, isLoading: false, error: false }) })
      .catch(() => { if (!cancelled) setState({ data: null, isLoading: false, error: true }) })
    return () => { cancelled = true }
  }, [id, page, limit])

  return state
}
