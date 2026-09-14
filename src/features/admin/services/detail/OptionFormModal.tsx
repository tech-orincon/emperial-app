import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Modal } from '../../../../components/ui/Modal'
import { Button } from '../../../../components/ui/Button'
import { inputCls } from '../service-form.types'
import type {
  AdminServiceOption,
  CreateServiceOptionPayload,
  ServiceOptionType,
} from '../../../../types/admin-service-detail.types'

interface Props {
  isOpen: boolean
  type: ServiceOptionType
  /** null = alta */
  option: AdminServiceOption | null
  onClose: () => void
  onSubmit: (payload: CreateServiceOptionPayload) => Promise<boolean>
}

const LABEL: Record<ServiceOptionType, string> = { PACKAGE: 'paquete', ADDON: 'add-on' }

export function OptionFormModal({ isOpen, type, option, onClose, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [isPopular, setIsPopular] = useState(false)
  const [displayOrder, setDisplayOrder] = useState('0')
  const [features, setFeatures] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setName(option?.name ?? '')
    setPrice(option?.price ?? '')
    setDescription(option?.description ?? '')
    setIsPopular(option?.isPopular ?? false)
    setDisplayOrder(String(option?.displayOrder ?? 0))
    setFeatures(option?.features.map((f) => f.text) ?? [])
    setIsSaving(false)
  }, [isOpen, option])

  const parsedPrice = parseFloat(price)
  const canSave = name.trim().length > 0 && Number.isFinite(parsedPrice) && parsedPrice >= 0

  const handleSubmit = async () => {
    if (!canSave) return
    setIsSaving(true)
    const ok = await onSubmit({
      name: name.trim(),
      price: parsedPrice,
      type,
      isPopular,
      description: description.trim() || undefined,
      displayOrder: parseInt(displayOrder, 10) || 0,
      // se manda siempre: omitirlo dejaría la lista intacta en el PATCH
      features: features
        .map((text, i) => ({ text: text.trim(), displayOrder: i }))
        .filter((f) => f.text.length > 0),
    })
    setIsSaving(false)
    if (ok) onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={`${option ? 'Editar' : 'Nuevo'} ${LABEL[type]}`}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!canSave || isSaving}>
            {isSaving ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-400 mb-1.5">Nombre *</label>
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Standard"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Precio (USD) *</label>
            <input
              className={inputCls}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              inputMode="decimal"
              placeholder="89.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Descripción</label>
          <textarea
            className={inputCls}
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Orden</label>
            <input
              className={inputCls}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              inputMode="numeric"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300 pb-2.5">
            <input
              type="checkbox"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            Marcar como popular
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-slate-400">Qué incluye</label>
            <button
              onClick={() => setFeatures((prev) => [...prev, ''])}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
            >
              <Plus className="w-3 h-3" /> Añadir
            </button>
          </div>
          {features.length === 0 && (
            <p className="text-xs text-slate-500 py-2">Sin elementos.</p>
          )}
          <div className="space-y-2">
            {features.map((text, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inputCls}
                  value={text}
                  onChange={(e) =>
                    setFeatures((prev) => prev.map((t, j) => (j === i ? e.target.value : t)))
                  }
                  placeholder="Timed guarantee"
                />
                <button
                  onClick={() => setFeatures((prev) => prev.filter((_, j) => j !== i))}
                  className="shrink-0 w-10 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center"
                  aria-label="Quitar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </Modal>
  )
}
