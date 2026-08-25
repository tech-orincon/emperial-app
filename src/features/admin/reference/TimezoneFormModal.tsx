import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import type { AdminTimezone, CreateTimezonePayload } from '../../../types/admin.types'

interface Props {
  isOpen: boolean
  timezone: AdminTimezone | null
  isSaving: boolean
  onClose: () => void
  onSubmit: (payload: CreateTimezonePayload) => void
}

const EMPTY: CreateTimezonePayload = { name: '', label: '', utcOffset: '', region: '' }
const inputCls =
  'w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'

export function TimezoneFormModal({ isOpen, timezone, isSaving, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CreateTimezonePayload>(EMPTY)
  const isEdit = timezone !== null

  useEffect(() => {
    if (!isOpen) return
    setForm(
      timezone
        ? { name: timezone.name, label: timezone.label, utcOffset: timezone.utcOffset, region: timezone.region }
        : EMPTY,
    )
  }, [isOpen, timezone])

  const set = (k: keyof CreateTimezonePayload, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const canSubmit = Object.values(form).every((v) => v.trim() !== '') && !isSaving

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar zona horaria' : 'Nueva zona horaria'}>
      <div className="space-y-4">
        {isEdit && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300">
              El nombre se guarda como texto en el perfil de cada provider, no por referencia.
              Si alguno la usa, el backend rechazará el renombrado. La etiqueta sí es segura.
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Nombre IANA *</label>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="America/Bogota" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Etiqueta *</label>
          <input className={inputCls} value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="COT (UTC-5)" />
          <p className="text-xs text-slate-500">Es lo que ve el booster en el formulario.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Offset UTC *</label>
            <input className={inputCls} value={form.utcOffset} onChange={(e) => set('utcOffset', e.target.value)} placeholder="-05:00" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Región *</label>
            <input className={inputCls} value={form.region} onChange={(e) => set('region', e.target.value)} placeholder="America" />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isSaving}>Cancelar</Button>
          <Button className="flex-1" onClick={() => onSubmit(form)} disabled={!canSubmit}>
            {isSaving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear zona'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
