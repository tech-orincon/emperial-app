import { useEffect, useState, useCallback } from 'react'
import { getOrderById } from '../../../services/orders.service'
import { useAuth } from '../../../context/AuthContext'
import type { OrderDto } from '../../../types/orders.types'

interface State {
  data: OrderDto | null
  isLoading: boolean
  error: boolean
}

export function useOrderDetail(id: string | undefined): State & { retry: () => void } {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [state, setState] = useState<State>({ data: null, isLoading: true, error: false })

  const fetch = useCallback(() => {
    if (!id) return
    setState({ data: null, isLoading: true, error: false })
    getOrderById(id)
      .then((data) => setState({ data, isLoading: false, error: false }))
      .catch(() => setState({ data: null, isLoading: false, error: true }))
  }, [id])

  useEffect(() => {
    if (isAuthLoading) return
    if (!isAuthenticated) { setState({ data: null, isLoading: false, error: false }); return }
    fetch()
  }, [isAuthenticated, isAuthLoading, fetch])

  return { ...state, retry: fetch }
}
