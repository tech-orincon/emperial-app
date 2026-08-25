import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import {
  createGame,
  deleteGame,
  getAdminGames,
  updateGame,
} from '../../../services/admin.service'
import type {
  AdminGame,
  CreateGamePayload,
  UpdateGamePayload,
} from '../../../types/admin.types'

/** El backend manda mensajes accionables (ej. "still has 4 category(ies)"); mostrarlos tal cual. */
function apiMessage(err: unknown, fallback: string): string {
  const data = (err as AxiosError<{ message?: string | string[] }>)?.response?.data
  const msg = data?.message
  if (Array.isArray(msg)) return msg.join('. ')
  return msg ?? fallback
}

export function useAdminGames() {
  const [games, setGames] = useState<AdminGame[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(() => {
    setIsLoading(true)
    setError(false)
    getAdminGames()
      .then((data) => setGames(data))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }, [])

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

  return {
    games,
    isLoading,
    error,
    isSaving,
    reload: load,
    create: (p: CreateGamePayload) =>
      run(() => createGame(p), 'Juego creado', 'No se pudo crear el juego'),
    update: (id: number, p: UpdateGamePayload) =>
      run(() => updateGame(id, p), 'Juego actualizado', 'No se pudo actualizar'),
    toggleActive: (g: AdminGame) =>
      run(
        () => updateGame(g.id, { isActive: !g.isActive }),
        g.isActive ? 'Juego desactivado' : 'Juego activado',
        'No se pudo cambiar el estado',
      ),
    remove: (id: number) =>
      run(() => deleteGame(id), 'Juego borrado', 'No se pudo borrar'),
  }
}
