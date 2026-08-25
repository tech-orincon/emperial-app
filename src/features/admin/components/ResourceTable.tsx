import type { ReactNode } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Skeleton } from '../../../components/ui/Skeleton'
import { ErrorState } from '../../../components/ui/ErrorState'

export interface Column<T> {
  header: string
  /** Ancho Tailwind opcional, ej. "w-24" */
  className?: string
  render: (row: T) => ReactNode
}

interface Props<T> {
  rows: T[]
  columns: Column<T>[]
  rowKey: (row: T) => string | number
  isLoading: boolean
  error: boolean
  onRetry: () => void
  emptyMessage: string
  /** Se aplica a la fila; úsalo para atenuar borrados */
  rowClassName?: (row: T) => string
}

/**
 * Tabla genérica del backoffice. Cada pantalla sólo describe sus columnas, así
 * que no hay que reescribir estados de carga, error y vacío siete veces.
 */
export function ResourceTable<T>({
  rows,
  columns,
  rowKey,
  isLoading,
  error,
  onRetry,
  emptyMessage,
  rowClassName,
}: Props<T>) {
  if (error) {
    return (
      <ErrorState
        title="No se pudo cargar"
        description="Hubo un problema al obtener los datos."
        onRetry={onRetry}
      />
    )
  }

  return (
    <GlassCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-slate-800/40">
              {columns.map((c) => (
                <th
                  key={c.header}
                  className={`px-4 py-3 text-left font-medium text-slate-400 whitespace-nowrap ${c.className ?? ''}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  {columns.map((c) => (
                    <td key={c.header} className="px-4 py-3">
                      <Skeleton height={16} />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${rowClassName?.(row) ?? ''}`}
                >
                  {columns.map((c) => (
                    <td key={c.header} className={`px-4 py-3 ${c.className ?? ''}`}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
