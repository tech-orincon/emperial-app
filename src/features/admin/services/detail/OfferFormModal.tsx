import { useEffect, useState } from 'react'
import { Modal } from '../../../../components/ui/Modal'
import { Button } from '../../../../components/ui/Button'
import { inputCls } from '../service-form.types'
import type {
  AdminOffer,
  OfferTag,
  UpdateServiceOfferPayload,
} from '../../../../types/admin-service-detail.types'

interface Props {
  isOpen: boolean
  offer: AdminOffer | null
  onClose: () => void
  onSubmit: (payload: UpdateServiceOfferPayload) => Promise<boolean>
}

const TAGS: OfferTag[] = ['BEST_VALUE', 'POPULAR', 'FLASH_SALE', 'LIMITED']

/** ISO → valor de <input type="datetime-local"> en hora local */
const toLocalInput = (iso: string | null) => {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function OfferFormModal({ isOpen, offer, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('')
  const [finalPrice, setFinalPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountPct, setDiscountPct] = useState('')
  const [tag, setTag] = useState<OfferTag | ''>('')
  const [isActive, setIsActive] = useState(true)
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setTitle(offer?.title ?? '')
    setFinalPrice(offer?.finalPrice ?? '')
    setOriginalPrice(offer?.originalPrice ?? '')
    setDiscountPct(offer?.discountPct != null ? String(offer.discountPct) : '')
    setTag(offer?.tag ?? '')
    setIsActive(offer?.isActive ?? true)
    setStartsAt(toLocalInput(offer?.startsAt ?? null))
    setEndsAt(toLocalInput(offer?.endsAt ?? null))
    setIsSaving(false)
  }, [isOpen, offer])

  const parsedFinal = parseFloat(finalPrice)
  // el backend valida finalPrice con @IsPositive: 0 se rechaza
  const canSave = Number.isFinite(parsedFinal) && parsedFinal > 0

  const handleSubmit = async () => {
    if (!canSave) return
    setIsSaving(true)
    const original = parseFloat(originalPrice)
    const pct = parseInt(discountPct, 10)
    const ok = await onSubmit({
      title: title.trim() || undefined,
      finalPrice: parsedFinal,
      originalPrice: Number.isFinite(original) ? original : undefined,
      discountPct: Number.isFinite(pct) ? pct : undefined,
      tag: tag || undefined,
      isActive,
      startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
      endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
    })
    setIsSaving(false)
    if (ok) onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={offer ? 'Editar oferta' : 'Nueva oferta'}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!canSave || isSaving}>
            {isSaving ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Título</label>
            <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Flash Sale" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Etiqueta</label>
            <select className={inputCls} value={tag} onChange={(e) => setTag(e.target.value as OfferTag | '')}>
              <option value="">Sin etiqueta</option>
              {TAGS.map((t) => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Precio final (USD) *</label>
            <input className={inputCls} value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} inputMode="decimal" placeholder="29.99" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Precio tachado</label>
            <input className={inputCls} value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} inputMode="decimal" placeholder="39.99" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Descuento %</label>
            <input className={inputCls} value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} inputMode="numeric" placeholder="25" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Empieza</label>
            <input type="datetime-local" className={inputCls} value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Termina</label>
            <input type="datetime-local" className={inputCls} value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-amber-500" />
          Activa
        </label>
        <p className="text-xs text-slate-500">
          El detalle público sólo muestra la oferta si está activa y dentro de la ventana de fechas.
        </p>
      </div>

    </Modal>
  )
}
