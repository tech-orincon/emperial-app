import { useEffect, useState } from 'react'
import { Modal } from '../../../../../components/ui/Modal'
import { Button } from '../../../../../components/ui/Button'
import { inputCls } from '../../service-form.types'
import { CONTROLS, isScaleControl } from './config.types'
import type {
  ConfigControl,
  ConfigGroup,
  CreateConfigGroupPayload,
} from '../../../../../types/service-config.types'

interface Props {
  isOpen: boolean
  /** null = alta */
  group: ConfigGroup | null
  /** Para elegir el disparador de visibilidad; excluye al propio grupo */
  allGroups: ConfigGroup[]
  onClose: () => void
  onSubmit: (payload: CreateConfigGroupPayload) => Promise<boolean>
}

export function GroupFormModal({ isOpen, group, allGroups, onClose, onSubmit }: Props) {
  const [label, setLabel] = useState('')
  const [control, setControl] = useState<ConfigControl>('BUTTONS')
  const [isRequired, setIsRequired] = useState(true)
  const [displayOrder, setDisplayOrder] = useState('0')
  const [trigger, setTrigger] = useState<string>('')
  const [scaleUnit, setScaleUnit] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setLabel(group?.label ?? '')
    setControl(group?.control ?? 'BUTTONS')
    setIsRequired(group?.isRequired ?? true)
    setDisplayOrder(String(group?.displayOrder ?? allGroups.length))
    setTrigger(group?.visibleWhenOptionId ? String(group.visibleWhenOptionId) : '')
    setScaleUnit(group?.scaleUnit ?? '')
    setIsSaving(false)
  }, [isOpen, group, allGroups.length])

  // Un grupo no puede depender de sus propias opciones: no se vería nunca
  const triggerCandidates = allGroups.filter((g) => g.id !== group?.id)

  const handleSubmit = async () => {
    if (!label.trim()) return
    setIsSaving(true)
    const ok = await onSubmit({
      label: label.trim(),
      control,
      isRequired,
      displayOrder: parseInt(displayOrder, 10) || 0,
      visibleWhenOptionId: trigger ? Number(trigger) : null,
      scaleUnit: isScaleControl(control) ? scaleUnit.trim() || null : null,
    })
    setIsSaving(false)
    if (ok) onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={group ? 'Editar grupo' : 'Nuevo grupo'}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!label.trim() || isSaving}>
            {isSaving ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Etiqueta *</label>
          <input
            className={inputCls}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Type of gear"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Control</label>
          <div className="grid sm:grid-cols-3 gap-2">
            {CONTROLS.map((c) => (
              <button
                key={c.value}
                onClick={() => setControl(c.value)}
                className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                  control === c.value
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <span className="block font-medium">{c.label}</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">{c.hint}</span>
              </button>
            ))}
          </div>
        </div>

        {isScaleControl(control) && (
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Unidad de la escala</label>
            <input
              className={inputCls}
              value={scaleUnit}
              onChange={(e) => setScaleUnit(e.target.value)}
              placeholder={control === 'FROM_TO' ? 'división' : 'nivel'}
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              Los puntos de la escala se cargan aparte, con el botón de la regla en la tarjeta
              del grupo.
            </p>
          </div>
        )}

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
          <label
            className={`flex items-center gap-2 text-sm pb-2.5 ${
              control === 'SWITCH' ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            <input
              type="checkbox"
              checked={isRequired}
              disabled={control === 'SWITCH'}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            Obligatorio
            {control === 'SWITCH' && (
              <span className="text-[11px]">(un interruptor puede quedar vacío)</span>
            )}
          </label>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Mostrar sólo si…</label>
          <select
            className={inputCls}
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
          >
            <option value="">Siempre visible</option>
            {triggerCandidates.map((g) => (
              <optgroup key={g.id} label={g.label}>
                {g.options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-1.5">
            El grupo aparece sólo cuando esa opción está elegida. Si el grupo padre se
            oculta, este también.
          </p>
        </div>
      </div>
    </Modal>
  )
}
