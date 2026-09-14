import {
  DELIVERY_TYPES,
  inputCls,
  type ServiceFormValues,
} from './service-form.types'
import type { DeliveryType } from '../../../types/catalog.types'

interface Props {
  values: ServiceFormValues
  onChange: <K extends keyof ServiceFormValues>(key: K, value: ServiceFormValues[K]) => void
  /** En alta se ofrece el toggle de publicado; en edición vive en la tabla */
  showActiveToggle: boolean
}

/** Campos comunes al alta y a la edición de un servicio. */
export function ServiceFormFields({ values, onChange, showActiveToggle }: Props) {
  const toggle = (
    key: 'isBestSeller' | 'isInstant' | 'isFeatured' | 'isActive',
    label: string,
  ) => (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
      <input
        type="checkbox"
        checked={values[key]}
        onChange={(e) => onChange(key, e.target.checked)}
        className="rounded border-slate-600 text-amber-500 focus:ring-amber-500 bg-slate-700"
      />
      {label}
    </label>
  )

  return (
    <>
      <div className="space-y-1.5">
        <label className="text-sm text-slate-400">Título *</label>
        <input
          className={inputCls}
          value={values.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Mythic +20 Key Carry"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm text-slate-400">Descripción *</label>
        <textarea
          className={`${inputCls} h-20 resize-none`}
          value={values.description}
          onChange={(e) => onChange('description', e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Precio base USD *</label>
          <input
            className={inputCls}
            value={values.basePrice}
            inputMode="decimal"
            onChange={(e) => onChange('basePrice', e.target.value)}
            placeholder="29.99"
          />
          <p className="text-xs text-slate-500">Debe ser mayor que 0.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Tipo de entrega *</label>
          <select
            className={inputCls}
            value={values.deliveryType}
            onChange={(e) => onChange('deliveryType', e.target.value as DeliveryType)}
          >
            {DELIVERY_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Tiempo de entrega *</label>
          <input
            className={inputCls}
            value={values.deliveryTime}
            onChange={(e) => onChange('deliveryTime', e.target.value)}
            placeholder="45 min"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Tiempo estimado *</label>
          <input
            className={inputCls}
            value={values.estimatedTime}
            onChange={(e) => onChange('estimatedTime', e.target.value)}
            placeholder="1-2 hours"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm text-slate-400">Imagen (URL)</label>
        <input
          className={inputCls}
          value={values.imageUrl}
          onChange={(e) => onChange('imageUrl', e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-5 pt-1">
        {toggle('isBestSeller', 'Best seller')}
        {toggle('isInstant', 'Entrega instantánea')}
        {toggle('isFeatured', 'Destacado')}
        {showActiveToggle && toggle('isActive', 'Publicado')}
      </div>
    </>
  )
}
