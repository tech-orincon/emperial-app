import { useEffect, useState, useCallback } from 'react'
import { getOrders } from '../../../services/orders.service'
import { useAuth } from '../../../context/AuthContext'
import type { OrderDto } from '../../../types/orders.types'

interface State {
  data: OrderDto[]
  total: number
  isLoading: boolean
  error: boolean
}

export function useOrders(): State & { retry: () => void } {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [state, setState] = useState<State>({ data: [], total: 0, isLoading: true, error: false })

  const fetch = useCallback(() => {
    setState({ data: [], total: 0, isLoading: true, error: false })
    getOrders()
      .then((res) => setState({ data: res.data, total: res.total, isLoading: false, error: false }))
      .catch(() => setState({ data: [], total: 0, isLoading: false, error: true }))
  }, [])

  useEffect(() => {
    if (isAuthLoading) return
    if (!isAuthenticated) { setState({ data: [], total: 0, isLoading: false, error: false }); return }
    fetch()
  }, [isAuthenticated, isAuthLoading, fetch])

  return { ...state, retry: fetch }
}
