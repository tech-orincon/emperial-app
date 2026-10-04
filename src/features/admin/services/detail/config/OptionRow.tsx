import { X } from 'lucide-react'
import { inputCls } from '../../service-form.types'
import { PRICE_KINDS } from './config.types'
import type { PriceKind } from '../../../../../types/service-config.types'

export interface OptionDraft {
  label: string
  badge: string
  priceKind: PriceKind
  priceAmount: string
  deliveryMinutes: string
  isDefault: boolean
  isEnabled: boolean
}

interface Props {
  draft: OptionDraft
  onPatch: (key: keyof OptionDraft, value: OptionDraft[keyof OptionDraft]) => void
  onRemove: () => void
}

export function OptionRow({ draft, onPatch, onRemove }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-800/40 p-3">
      <div className="flex gap-2 mb-2">
        <input
          className={inputCls}
          value={draft.label}
          onChange={(e) => onPatch('label', e.target.value)}
          placeholder="Conquest gear (344 ilvl)"
        />
        <button
          onClick={onRemove}
          className="shrink-0 w-10 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center"
          aria-label="Quitar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid sm:grid-cols-4 gap-2">
        <select
          className={inputCls}
          value={draft.priceKind}
          onChange={(e) => onPatch('priceKind', e.target.value as PriceKind)}
        >
          {PRICE_KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
        <input
          className={inputCls}
          value={draft.priceAmount}
          onChange={(e) => onPatch('priceAmount', e.target.value)}
          inputMode="decimal"
          placeholder={draft.priceKind === 'PERCENT' ? '30' : '10.00'}
        />
        <input
          className={inputCls}
          value={draft.badge}
          onChange={(e) => onPatch('badge', e.target.value)}
          placeholder="Insignia"
        />
        <input
          className={inputCls}
          value={draft.deliveryMinutes}
          onChange={(e) => onPatch('deliveryMinutes', e.target.value)}
          inputMode="numeric"
          placeholder="Entrega (min)"
        />
      </div>

      <div className="flex flex-wrap gap-4 mt-2">
        <label className="flex items-center gap-1.5 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={draft.isDefault}
            onChange={(e) => onPatch('isDefault', e.target.checked)}
            className="w-3.5 h-3.5 accent-amber-500"
          />
          Por defecto
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={draft.isEnabled}
            onChange={(e) => onPatch('isEnabled', e.target.checked)}
            className="w-3.5 h-3.5 accent-amber-500"
          />
          Disponible
        </label>
        <span className="text-[11px] text-slate-500 self-center">
          {PRICE_KINDS.find((k) => k.value === draft.priceKind)?.hint}
        </span>
      </div>
    </div>
  )
}
