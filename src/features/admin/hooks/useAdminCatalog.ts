import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

/** El backend manda mensajes accionables; propagarlos tal cual al toast. */
export function apiMessage(err: unknown, fallback: string): string {
  const data = (err as AxiosError<{ message?: string | string[] }>)?.response?.data
  const msg = data?.message
  if (Array.isArray(msg)) return msg.join('. ')
  return msg ?? fallback
}

interface Options<T> {
  /** Memoízalo con useCallback: su identidad es lo que dispara la recarga */
  fetcher: () => Promise<T[]>
}

/**
 * Estado de lista + ejecución de mutaciones con toast y recarga.
 * Compartido por las pantallas del backoffice para no repetir el mismo
 * bloque de carga/error/guardado en cada una.
 */
export function useAdminResource<T>({ fetcher }: Options<T>) {
  const [rows, setRows] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(() => {
    setIsLoading(true)
    setError(false)
    fetcher()
      .then(setRows)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }, [fetcher])

  useEffect(() => { load() }, [load])

  const run = async (action: () => Promise<void>, okMsg: string, failMsg: string) => {
    setIsSaving(true)
    try {
      await action()
      toast.success(okMsg)
      load()
      return true
    } catch (err) {
      toast.error(apiMessage(err, failMsg))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { rows, isLoading, error, isSaving, reload: load, run }
}
