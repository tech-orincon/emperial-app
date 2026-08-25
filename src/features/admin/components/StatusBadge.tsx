interface Props {
  isActive: boolean
  deletedAt: string | null
}

/**
 * Los tres estados del catálogo: borrado (soft) gana sobre inactivo, porque
 * un registro borrado siempre queda además inactivo.
 */
export function StatusBadge({ isActive, deletedAt }: Props) {
  if (deletedAt) {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
        Borrado
      </span>
    )
  }
  if (!isActive) {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
        Inactivo
      </span>
    )
  }
  return (
    <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
      Activo
    </span>
  )
}
