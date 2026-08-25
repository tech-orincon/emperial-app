import { useEffect, useState } from 'react'
import { getAdminGames } from '../../../services/admin.service'
import type { AdminGame } from '../../../types/admin.types'

interface Props {
  value: number | null
  onChange: (gameId: number | null) => void
  label?: string
}

const cls =
  'bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500'

/** Selector de juego reutilizado como filtro en Categorías y Servicios. */
export function GameFilter({ value, onChange, label = 'Juego' }: Props) {
  const [games, setGames] = useState<AdminGame[]>([])

  useEffect(() => {
    getAdminGames().then(setGames).catch(() => setGames([]))
  }, [])

  return (
    <label className="flex items-center gap-2 text-sm text-slate-400">
      {label}
      <select
        className={cls}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      >
        <option value="">Todos</option>
        {games.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
            {g.isActive ? '' : ' (inactivo)'}
          </option>
        ))}
      </select>
    </label>
  )
}
