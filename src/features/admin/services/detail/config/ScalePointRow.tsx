import { X } from 'lucide-react'
import { inputCls } from '../../service-form.types'
import type { ScalePointInput } from '../../../../../types/service-config.types'

interface Props {
  point: ScalePointInput
  /** El último punto no tiene salto: su precio se fuerza a 0 */
  isLast: boolean
  onPatch: (key: keyof ScalePointInput, value: string | number | null) => void
  onRemove: () => void
}

export function ScalePointRow({ point, isLast, onPatch, onRemove }: Props) {
  return (
    <div className="grid grid-cols-[3rem_1fr_1fr_5rem_5rem_2.5rem] gap-1.5 items-center">
      <input
        className={`${inputCls} px-2 text-center`}
        value={point.value}
        onChange={(e) => onPatch('value', Number(e.target.value) || 0)}
        inputMode="numeric"
        aria-label="Posición"
      />
      <input
        className={`${inputCls} px-2`}
        value={point.label ?? ''}
        onChange={(e) => onPatch('label', e.target.value || null)}
        placeholder="Bronze IV"
        aria-label="Etiqueta"
      />
      <input
        className={`${inputCls} px-2`}
        value={point.tier ?? ''}
        onChange={(e) => onPatch('tier', e.target.value || null)}
        placeholder="Bronze"
        aria-label="Columna"
      />
      <input
        className={`${inputCls} px-2 text-right ${isLast ? 'opacity-40' : ''}`}
        value={isLast ? 0 : point.stepPrice}
        disabled={isLast}
        onChange={(e) => onPatch('stepPrice', parseFloat(e.target.value) || 0)}
        inputMode="decimal"
        aria-label="Precio del salto"
        title={isLast ? 'El último punto no tiene salto después' : undefined}
      />
      <input
        className={`${inputCls} px-2 text-right ${isLast ? 'opacity-40' : ''}`}
        value={point.stepMinutes ?? ''}
        disabled={isLast}
        onChange={(e) => onPatch('stepMinutes', e.target.value ? Number(e.target.value) : null)}
        inputMode="numeric"
        placeholder="min"
        aria-label="Minutos del salto"
      />
      <button
        onClick={onRemove}
        className="h-9 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center"
        aria-label="Quitar punto"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
