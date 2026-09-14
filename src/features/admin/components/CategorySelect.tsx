import { useEffect, useState } from 'react'
import { getAdminCategories } from '../../../services/admin.service'
import type { AdminCategory } from '../../../types/admin.types'

interface Props {
  /** null deshabilita el selector: primero hay que elegir juego */
  gameId: number | null
  value: number | null
  onChange: (categoryId: number | null) => void
  className?: string
}

/**
 * Categorías del juego seleccionado. Se recarga al cambiar de juego y limpia
 * la selección previa, porque una categoría de otro juego sería inválida.
 */
export function CategorySelect({ gameId, value, onChange, className = '' }: Props) {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!gameId) {
      setCategories([])
      return
    }
    let cancelled = false
    setIsLoading(true)
    getAdminCategories(gameId)
      .then((rows) => { if (!cancelled) setCategories(rows.filter((c) => !c.deletedAt)) })
      .catch(() => { if (!cancelled) setCategories([]) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [gameId])

  const placeholder = !gameId
    ? 'Elige un juego primero'
    : isLoading
      ? 'Cargando…'
      : categories.length === 0
        ? 'Este juego no tiene categorías'
        : 'Selecciona una categoría'

  return (
    <select
      className={className}
      value={value ?? ''}
      disabled={!gameId || isLoading || categories.length === 0}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
    >
      <option value="">{placeholder}</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
          {c.isActive ? '' : ' (inactiva)'}
        </option>
      ))}
    </select>
  )
}
