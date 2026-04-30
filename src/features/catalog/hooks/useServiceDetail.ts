import { useEffect, useState } from 'react'
import { getServiceDetail } from '../../../services/catalog.service'
import type { ServiceDetail } from '../../../types/catalog.types'

interface State {
  data: ServiceDetail | null
  isLoading: boolean
  error: boolean
}

export function useServiceDetail(id: string | undefined): State {
  const [state, setState] = useState<State>({ data: null, isLoading: true, error: false })

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setState({ data: null, isLoading: true, error: false })
    getServiceDetail(id)
      .then((data) => { if (!cancelled) setState({ data, isLoading: false, error: false }) })
      .catch(() => { if (!cancelled) setState({ data: null, isLoading: false, error: true }) })
    return () => { cancelled = true }
  }, [id])

  return state
}
