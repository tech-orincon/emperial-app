import { Modal } from '../../../components/ui/Modal'
import type { ConfigGroup, ScalePoint } from '../../../types/service-config.types'

interface Props {
  isOpen: boolean
  title: string
  group: ConfigGroup
  /** Punto elegido ahora mismo */
  value: number
  /** Puntos que no se pueden elegir (romperían from < to) */
  disabledBelow?: number
  disabledAbove?: number
  onPick: (value: number) => void
  onClose: () => void
}

/** Agrupa los puntos por `tier` conservando el orden de la escala */
function byTier(points: ScalePoint[]): { tier: string; icon: string | null; points: ScalePoint[] }[] {
  const cols: { tier: string; icon: string | null; points: ScalePoint[] }[] = []
  for (const p of points) {
    const key = p.tier ?? p.label ?? String(p.value)
    const last = cols[cols.length - 1]
    if (last && last.tier === key) last.points.push(p)
    else cols.push({ tier: key, icon: p.iconUrl, points: [p] })
  }
  return cols
}

export function ScalePickerModal({
  isOpen,
  title,
  group,
  value,
  disabledBelow,
  disabledAbove,
  onPick,
  onClose,
}: Props) {
  const columns = byTier(group.scalePoints)

  const isBlocked = (v: number) =>
    (disabledBelow !== undefined && v <= disabledBelow) ||
    (disabledAbove !== undefined && v >= disabledAbove)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" title={title}>
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="flex gap-3 min-w-max pb-1">
          {columns.map((col) => {
            const columnHasPick = col.points.some((p) => p.value === value)
            return (
              <div key={col.tier} className="w-[88px] shrink-0 text-center">
                {col.icon && (
                  <img
                    src={col.icon}
                    alt=""
                    className={`w-14 h-14 mx-auto mb-1.5 transition-opacity ${
                      columnHasPick ? 'opacity-100' : 'opacity-60'
                    }`}
                  />
                )}
                <div className="space-y-0.5">
                  {col.points.map((p) => {
                    const blocked = isBlocked(p.value)
                    const active = p.value === value
                    return (
                      <button
                        key={p.value}
                        disabled={blocked}
                        onClick={() => {
                          onPick(p.value)
                          onClose()
                        }}
                        className={`w-full px-1 py-1.5 rounded text-xs transition-colors ${
                          active
                            ? 'bg-emperial-500/25 text-emperial-200 font-semibold'
                            : blocked
                              ? 'text-slate-700 cursor-not-allowed'
                              : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {p.label ?? p.value}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
