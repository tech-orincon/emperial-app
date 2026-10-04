import { ChevronDown } from 'lucide-react'
import type { ScalePoint } from '../../../types/service-config.types'

interface Props {
  caption: string
  point: ScalePoint | undefined
  onOpen: () => void
}

/**
 * Estandarte que muestra el punto elegido con su emblema. Al pulsarlo se abre
 * el selector completo — el desplegable plano no deja ver de qué liga se trata.
 */
export function RankBanner({ caption, point, onOpen }: Props) {
  const tier = point?.tier ?? point?.label ?? '—'
  const division = point?.tier && point.label !== point.tier ? point.label : null

  return (
    <button
      onClick={onOpen}
      className="group w-full rounded-xl border border-white/10 bg-slate-800/40 p-3 text-center transition-colors hover:border-emperial-500/40 hover:bg-slate-800/70"
    >
      <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1.5">{caption}</p>

      {point?.iconUrl ? (
        <img src={point.iconUrl} alt="" className="w-14 h-14 mx-auto" />
      ) : (
        <div className="w-14 h-14 mx-auto rounded-lg bg-slate-700/50" />
      )}

      <p className="mt-1.5 text-sm font-bold text-white uppercase leading-tight">{tier}</p>
      {division && <p className="text-[11px] text-slate-400">{division}</p>}

      <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-emperial-300">
        Cambiar <ChevronDown className="w-3 h-3" />
      </span>
    </button>
  )
}
