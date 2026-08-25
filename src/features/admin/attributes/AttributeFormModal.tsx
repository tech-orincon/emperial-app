import { useEffect, useState } from 'react'
import { Lock, Plus, X } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import type {
  AdminGameAttribute,
  AttributeOptionItem,
  UpdateGameAttributePayload,
} from '../../../types/admin.types'

interface Props {
  attribute: AdminGameAttribute | null
  isSaving: boolean
  onClose: () => void
  onSubmit: (payload: UpdateGameAttributePayload) => void
}

const inputCls =
  'w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'

export function AttributeFormModal({ attribute, isSaving, onClose, onSubmit }: Props) {
  const [label, setLabel] = useState('')
  const [isRequired, setIsRequired] = useState(false)
  const [displayOrder, setDisplayOrder] = useState(0)
  const [options, setOptions] = useState<AttributeOptionItem[]>([])

  const hasOptions =
    attribute?.inputType === 'SELECT' || attribute?.inputType === 'MULTI_SELECT'

  useEffect(() => {
    if (!attribute) return
    setLabel(attribute.label)
    setIsRequired(attribute.isRequired)
    setDisplayOrder(attribute.displayOrder)
    setOptions(attribute.options.map((o) => ({ value: o.value, label: o.label })))
  }, [attribute])

  if (!attribute) return <Modal isOpen={false} onClose={onClose}><div /></Modal>

  const setOption = (i: number, k: keyof AttributeOptionItem, v: string) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, [k]: v } : o)))

  const valid =
    label.trim() !== '' &&
    (!hasOptions || options.every((o) => o.value.trim() !== '' && o.label.trim() !== '')) &&
    new Set(options.map((o) => o.value.trim())).size === options.length

  return (
    <Modal isOpen onClose={onClose} title="Editar campo del onboarding" size="lg">
      <div className="space-y-4">
        {/* key e inputType son inmutables: la key indexa ProviderGameProfile.data */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Key', value: attribute.key },
            { label: 'Tipo', value: attribute.inputType },
          ].map((f) => (
            <div key={f.label} className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Lock className="w-3 h-3" /> {f.label}
              </div>
              <div className="font-mono text-sm text-slate-300">{f.value}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 -mt-2">
          No se pueden cambiar: la key indexa los datos que los boosters ya guardaron.
        </p>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Etiqueta *</label>
          <input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} />
          <p className="text-xs text-slate-500">Lo que ve el booster en el formulario.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Orden</label>
            <input
              type="number" min={0} className={inputCls} value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 pb-2">
            <input
              type="checkbox" checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="rounded border-slate-600 text-amber-500 focus:ring-amber-500 bg-slate-700"
            />
            Campo obligatorio
          </label>
        </div>

        {hasOptions && (
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Opciones</label>
            {options.map((o, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={`${inputCls} font-mono`} value={o.value} placeholder="valor"
                  onChange={(e) => setOption(i, 'value', e.target.value)}
                />
                <input
                  className={inputCls} value={o.label} placeholder="Etiqueta visible"
                  onChange={(e) => setOption(i, 'label', e.target.value)}
                />
                <button
                  onClick={() => setOptions((prev) => prev.filter((_, idx) => idx !== i))}
                  className="p-2 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setOptions((prev) => [...prev, { value: '', label: '' }])}
              className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300"
            >
              <Plus className="w-4 h-4" /> Añadir opción
            </button>
            <p className="text-xs text-slate-500">
              Se reemplaza la lista entera. Cambiar un valor deja huérfano el dato de quien lo eligiera.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isSaving}>Cancelar</Button>
          <Button
            className="flex-1"
            disabled={!valid || isSaving}
            onClick={() =>
              onSubmit({
                label, isRequired, displayOrder,
                ...(hasOptions && { options }),
              })
            }
          >
            {isSaving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
