import { ListPlus, Pencil, Ruler, Trash2 } from 'lucide-react'
import { CONTROLS, formatAmount, isScaleControl } from './config.types'
import type { ConfigGroup } from '../../../../../types/service-config.types'

interface Props {
  group: ConfigGroup
  /** "Type of gear: PvP gear", o null si el grupo es siempre visible */
  triggerLabel: string | null
  onEditOptions: () => void
  onEdit: () => void
  onDelete: () => void
}

export function GroupCard({ group, triggerLabel, onEditOptions, onEdit, onDelete }: Props) {
  const escala = isScaleControl(group.control)
  const puntos = group.scalePoints ?? []
  const recorrido = puntos.reduce((s, p) => s + parseFloat(p.stepPrice), 0)

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-white font-medium text-sm">
            {group.label}
            <span className="ml-2 text-[10px] uppercase tracking-wide text-slate-500">
              {CONTROLS.find((c) => c.value === group.control)?.label}
            </span>
            {group.isRequired && group.control !== 'SWITCH' && (
              <span className="ml-1.5 text-[10px] text-amber-500/70">obligatorio</span>
            )}
          </p>
          {triggerLabel && (
            <p className="text-[11px] text-slate-500 mt-0.5">Visible sólo si → {triggerLabel}</p>
          )}
        </div>
        <div className="shrink-0 flex gap-1">
          <button
            onClick={onEditOptions}
            title={escala ? 'Editar escala' : 'Editar opciones'}
            className="p-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
          >
            {escala ? <Ruler className="w-4 h-4" /> : <ListPlus className="w-4 h-4" />}
          </button>
          <button
            onClick={onEdit}
            title="Editar grupo"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            title="Eliminar"
            className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {escala ? (
        puntos.length < 2 ? (
          <p className="text-[11px] text-amber-400/80 mt-2">
            Sin escala: este grupo no se muestra al cliente.
          </p>
        ) : (
          <p className="text-[11px] text-slate-500 mt-2">
            {puntos.length} puntos · {puntos[0].label ?? puntos[0].value} →{' '}
            {puntos[puntos.length - 1].label ?? puntos[puntos.length - 1].value} · recorrido
            completo <span className="text-amber-400">${recorrido.toFixed(2)}</span>
            {puntos.some((p) => p.iconUrl) && ' · con emblemas'}
          </p>
        )
      ) : group.options.length === 0 ? (
        <p className="text-[11px] text-amber-400/80 mt-2">
          Sin opciones: este grupo no se muestra al cliente.
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {group.options.map((o) => (
            <span
              key={o.id}
              className={`px-2 py-0.5 rounded text-[11px] border ${
                o.isEnabled
                  ? 'bg-slate-800 border-white/10 text-slate-300'
                  : 'bg-slate-800/40 border-white/5 text-slate-600 line-through'
              }`}
            >
              {o.label}
              <span className="ml-1 text-slate-500">
                {formatAmount(o.priceKind, o.priceAmount)}
              </span>
              {o.isDefault && <span className="ml-1 text-amber-400">★</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
