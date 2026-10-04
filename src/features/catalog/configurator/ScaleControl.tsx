import { useState } from 'react'
import { RankBanner } from './RankBanner'
import { ScalePickerModal } from './ScalePickerModal'
import type { ConfigGroup, RangeSelection } from '../../../types/service-config.types'

interface Props {
  group: ConfigGroup
  range: RangeSelection | undefined
  onChange: (next: RangeSelection) => void
}

const nameOf = (group: ConfigGroup, value: number) =>
  group.scalePoints.find((p) => p.value === value)?.label ?? String(value)

/**
 * Un grupo de escala: el precio es la suma de los saltos del tramo elegido.
 * FROM_TO se pinta con dos selectores etiquetados; RANGE con dos deslizadores.
 */
export function ScaleControl({ group, range, onChange }: Props) {
  const points = group.scalePoints
  if (points.length < 2 || !range) return null

  const first = points[0].value
  const last = points[points.length - 1].value

  // El destino siempre por encima del origen: el backend rechaza lo contrario
  const setFrom = (v: number) => onChange({ ...range, from: v, to: Math.max(range.to, v + 1) })
  const setTo = (v: number) => onChange({ ...range, to: v, from: Math.min(range.from, v - 1) })

  // Con emblemas se usa el selector visual; sin ellos, dos desplegables
  if (group.control === 'FROM_TO' && points.some((p) => p.iconUrl)) {
    return (
      <VisualScale group={group} range={range} onChange={onChange} setFrom={setFrom} setTo={setTo} />
    )
  }

  if (group.control === 'FROM_TO') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">{group.label}</label>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <select
            value={range.from}
            onChange={(e) => setFrom(Number(e.target.value))}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emperial-500"
          >
            {points.slice(0, -1).map((p) => (
              <option key={p.value} value={p.value}>{p.label ?? p.value}</option>
            ))}
          </select>
          <span className="text-slate-500 text-sm">→</span>
          <select
            value={range.to}
            onChange={(e) => setTo(Number(e.target.value))}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emperial-500"
          >
            {points.slice(1).map((p) => (
              <option key={p.value} value={p.value}>{p.label ?? p.value}</option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  // RANGE: dos deslizadores sobre la misma escala numérica
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-400">{group.label}</label>
        <span className="text-sm text-white">
          {nameOf(group, range.from)} → {nameOf(group, range.to)}
          {group.scaleUnit && <span className="text-slate-500 text-xs ml-1">{group.scaleUnit}</span>}
        </span>
      </div>
      <div className="space-y-1.5">
        <input
          type="range"
          min={first}
          max={last - 1}
          value={range.from}
          onChange={(e) => setFrom(Number(e.target.value))}
          className="w-full accent-emperial-500"
          aria-label={`${group.label} desde`}
        />
        <input
          type="range"
          min={first + 1}
          max={last}
          value={range.to}
          onChange={(e) => setTo(Number(e.target.value))}
          className="w-full accent-emperial-500"
          aria-label={`${group.label} hasta`}
        />
      </div>
      <div className="flex justify-between text-[11px] text-slate-600">
        <span>{first}</span>
        <span>{last}</span>
      </div>
    </div>
  )
}

interface VisualProps {
  group: ConfigGroup
  range: RangeSelection
  onChange: (next: RangeSelection) => void
  setFrom: (v: number) => void
  setTo: (v: number) => void
}

/** Dos estandartes que abren el selector de ligas a pantalla ancha */
function VisualScale({ group, range, setFrom, setTo }: VisualProps) {
  const [open, setOpen] = useState<'from' | 'to' | null>(null)
  const at = (v: number) => group.scalePoints.find((p) => p.value === v)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-400">{group.label}</label>
      <div className="grid grid-cols-2 gap-2">
        <RankBanner caption="Rango actual" point={at(range.from)} onOpen={() => setOpen('from')} />
        <RankBanner caption="Rango deseado" point={at(range.to)} onOpen={() => setOpen('to')} />
      </div>

      <ScalePickerModal
        isOpen={open === 'from'}
        title="Selecciona rango actual"
        group={group}
        value={range.from}
        // no puede alcanzar ni pasar al destino
        disabledAbove={range.to}
        onPick={setFrom}
        onClose={() => setOpen(null)}
      />
      <ScalePickerModal
        isOpen={open === 'to'}
        title="Selecciona rango deseado"
        group={group}
        value={range.to}
        disabledBelow={range.from}
        onPick={setTo}
        onClose={() => setOpen(null)}
      />
    </div>
  )
}
