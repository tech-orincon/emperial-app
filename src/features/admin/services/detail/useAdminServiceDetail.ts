import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getAdminServiceDetail } from '../../../../services/admin-service-detail.service'
import type { AdminServiceDetail } from '../../../../types/admin-service-detail.types'

/** Los mensajes del backend son accionables — no los sustituyas por un genérico */
function apiMessage(err: unknown, fallback: string): string {
  const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data
    ?.message
  if (Array.isArray(message)) return message.join(', ')
  return message ?? fallback
}

export function useAdminServiceDetail(serviceId: number) {
  const [detail, setDetail] = useState<AdminServiceDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      setError(null)
      setDetail(await getAdminServiceDetail(serviceId))
    } catch (err) {
      setError(apiMessage(err, 'No se pudo cargar el servicio'))
    } finally {
      setIsLoading(false)
    }
  }, [serviceId])

  useEffect(() => {
    reload()
  }, [reload])

  /** Ejecuta una mutación, avisa y recarga. Devuelve si tuvo éxito. */
  const mutate = useCallback(
    async (action: () => Promise<void>, successMsg: string, errorMsg: string) => {
      try {
        await action()
        toast.success(successMsg)
        await reload()
        return true
      } catch (err) {
        toast.error(apiMessage(err, errorMsg))
        return false
      }
    },
    [reload],
  )

  return { detail, isLoading, error, reload, mutate }
}
