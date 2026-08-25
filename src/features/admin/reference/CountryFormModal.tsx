import { useEffect, useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import type { AdminCountry, CreateCountryPayload } from '../../../types/admin.types'

interface Props {
  isOpen: boolean
  country: AdminCountry | null
  isSaving: boolean
  onClose: () => void
  onSubmit: (payload: CreateCountryPayload) => void
}

const EMPTY: CreateCountryPayload = { name: '', isoCode: '', currencyCode: '' }
const inputCls =
  'w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'

export function CountryFormModal({ isOpen, country, isSaving, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CreateCountryPayload>(EMPTY)
  const isEdit = country !== null

  useEffect(() => {
    if (!isOpen) return
    setForm(
      country
        ? { name: country.name, isoCode: country.isoCode, currencyCode: country.currencyCode }
        : EMPTY,
    )
  }, [isOpen, country])

  const set = (k: keyof CreateCountryPayload, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const canSubmit =
    form.name.trim() !== '' &&
    form.isoCode.trim().length === 2 &&
    form.currencyCode.trim().length === 3 &&
    !isSaving

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar país' : 'Nuevo país'}>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Nombre *</label>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Colombia" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">ISO *</label>
            <input
              className={`${inputCls} uppercase`}
              value={form.isoCode}
              maxLength={2}
              onChange={(e) => set('isoCode', e.target.value.toUpperCase())}
              placeholder="CO"
            />
            <p className="text-xs text-slate-500">2 letras, único</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Moneda *</label>
            <input
              className={`${inputCls} uppercase`}
              value={form.currencyCode}
              maxLength={3}
              onChange={(e) => set('currencyCode', e.target.value.toUpperCase())}
              placeholder="COP"
            />
            <p className="text-xs text-slate-500">ISO 4217, 3 letras</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isSaving}>Cancelar</Button>
          <Button className="flex-1" onClick={() => onSubmit(form)} disabled={!canSubmit}>
            {isSaving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear país'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
