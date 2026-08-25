import { useEffect, useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import type { AdminService, UpdateServicePayload } from '../../../types/admin.types'
import type { DeliveryType } from '../../../types/catalog.types'

interface Props {
  /** null = cerrado */
  service: AdminService | null
  isSaving: boolean
  onClose: () => void
  onSubmit: (payload: UpdateServicePayload) => void
}

const DELIVERY: DeliveryType[] = ['FIXED', 'RANGE', 'FLEXIBLE', 'SCHEDULED']

const inputCls =
  'w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'

interface FormState {
  title: string
  description: string
  imageUrl: string
  basePrice: string
  deliveryType: DeliveryType
  deliveryTime: string
  estimatedTime: string
  isBestSeller: boolean
  isInstant: boolean
  isFeatured: boolean
}

export function ServiceFormModal({ service, isSaving, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<FormState | null>(null)

  useEffect(() => {
    if (!service) { setForm(null); return }
    setForm({
      title: service.title,
      description: service.description,
      imageUrl: service.imageUrl ?? '',
      basePrice: service.basePrice,
      deliveryType: service.deliveryType,
      deliveryTime: service.deliveryTime ?? '',
      estimatedTime: service.estimatedTime,
      isBestSeller: service.isBestSeller,
      isInstant: service.isInstant,
      isFeatured: service.isFeatured,
    })
  }, [service])

  if (!service || !form) {
    return <Modal isOpen={false} onClose={onClose}><div /></Modal>
  }

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => (prev ? { ...prev, [k]: v } : prev))

  const price = Number.parseFloat(form.basePrice)
  const canSubmit =
    form.title.trim() !== '' && Number.isFinite(price) && price >= 0 && !isSaving

  const submit = () =>
    onSubmit({
      title: form.title,
      description: form.description,
      imageUrl: form.imageUrl || undefined,
      basePrice: price,
      deliveryType: form.deliveryType,
      deliveryTime: form.deliveryTime || undefined,
      estimatedTime: form.estimatedTime,
      isBestSeller: form.isBestSeller,
      isInstant: form.isInstant,
      isFeatured: form.isFeatured,
    })

  const toggle = (k: 'isBestSeller' | 'isInstant' | 'isFeatured', label: string) => (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
      <input
        type="checkbox"
        checked={form[k]}
        onChange={(e) => set(k, e.target.checked)}
        className="rounded border-slate-600 text-amber-500 focus:ring-amber-500 bg-slate-700"
      />
      {label}
    </label>
  )

  return (
    <Modal isOpen onClose={onClose} title="Editar servicio" size="lg">
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          {service.game.name} · {service.category.name} — mover de categoría sólo se permite
          dentro del mismo juego, y aún no está en este formulario.
        </p>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Título *</label>
          <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Descripción</label>
          <textarea
            className={`${inputCls} h-20 resize-none`}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Precio base (USD) *</label>
            <input
              className={inputCls}
              value={form.basePrice}
              onChange={(e) => set('basePrice', e.target.value)}
              inputMode="decimal"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Tipo de entrega</label>
            <select
              className={inputCls}
              value={form.deliveryType}
              onChange={(e) => set('deliveryType', e.target.value as DeliveryType)}
            >
              {DELIVERY.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Tiempo de entrega</label>
            <input className={inputCls} value={form.deliveryTime} onChange={(e) => set('deliveryTime', e.target.value)} placeholder="45 min" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Tiempo estimado</label>
            <input className={inputCls} value={form.estimatedTime} onChange={(e) => set('estimatedTime', e.target.value)} placeholder="1-2 hours" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Imagen (URL)</label>
          <input className={inputCls} value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
        </div>

        <div className="flex flex-wrap gap-5 pt-1">
          {toggle('isBestSeller', 'Best seller')}
          {toggle('isInstant', 'Entrega instantánea')}
          {toggle('isFeatured', 'Destacado')}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isSaving}>Cancelar</Button>
          <Button className="flex-1" onClick={submit} disabled={!canSubmit}>
            {isSaving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
