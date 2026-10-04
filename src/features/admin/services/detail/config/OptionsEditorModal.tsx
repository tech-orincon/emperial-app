import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Modal } from '../../../../../components/ui/Modal'
import { Button } from '../../../../../components/ui/Button'
import { OptionRow, type OptionDraft } from './OptionRow'
import type { ConfigGroup, ConfigOptionInput } from '../../../../../types/service-config.types'

interface Props {
  isOpen: boolean
  group: ConfigGroup | null
  onClose: () => void
  onSubmit: (items: ConfigOptionInput[]) => Promise<boolean>
}

type Draft = OptionDraft

const EMPTY: Draft = {
  label: '',
  badge: '',
  priceKind: 'FIXED',
  priceAmount: '0',
  deliveryMinutes: '',
  isDefault: false,
  isEnabled: true,
}

export function OptionsEditorModal({ isOpen, group, onClose, onSubmit }: Props) {
  const [items, setItems] = useState<Draft[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isOpen || !group) return
    setItems(
      group.options.map((o) => ({
        label: o.label,
        badge: o.badge ?? '',
        priceKind: o.priceKind,
        priceAmount: o.priceAmount,
        deliveryMinutes: o.deliveryMinutes != null ? String(o.deliveryMinutes) : '',
        isDefault: o.isDefault,
        isEnabled: o.isEnabled,
      })),
    )
    setIsSaving(false)
  }, [isOpen, group])

  const patch = (i: number, k: keyof Draft, v: Draft[keyof Draft]) =>
    setItems((prev) =>
      prev.map((it, j) => {
        if (j !== i) {
          // Sólo una puede ser la por defecto en un grupo excluyente
          return k === 'isDefault' && v === true && group?.control !== 'SWITCH'
            ? { ...it, isDefault: false }
            : it
        }
        return { ...it, [k]: v }
      }),
    )

  const valid = items.every((it) => it.label.trim() && !Number.isNaN(parseFloat(it.priceAmount)))

  const handleSubmit = async () => {
    if (!valid) return
    setIsSaving(true)
    const ok = await onSubmit(
      items.map((it, i) => ({
        label: it.label.trim(),
        badge: it.badge.trim() || null,
        priceKind: it.priceKind,
        priceAmount: parseFloat(it.priceAmount),
        deliveryMinutes: it.deliveryMinutes ? parseInt(it.deliveryMinutes, 10) : null,
        isDefault: it.isDefault,
        isEnabled: it.isEnabled,
        displayOrder: i,
      })),
    )
    setIsSaving(false)
    if (ok) onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={`Opciones de "${group?.label ?? ''}"`}
      footer={
        <div className="flex justify-between gap-3">
          <Button variant="secondary" onClick={() => setItems((p) => [...p, { ...EMPTY }])}>
            <Plus className="w-4 h-4 mr-1" /> Añadir opción
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!valid || isSaving}>
              {isSaving ? 'Guardando…' : 'Guardar'}
            </Button>
          </div>
        </div>
      }
    >
      <p className="text-xs text-slate-500 mb-3">
        Reemplazo total: lo que quede aquí es exactamente lo que se guarda.
      </p>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400 py-3">
          Sin opciones. Un grupo vacío no se muestra al cliente.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((it, i) => (
            <OptionRow
              key={i}
              draft={it}
              onPatch={(k, v) => patch(i, k, v)}
              onRemove={() => setItems((prev) => prev.filter((_, j) => j !== i))}
            />
          ))}
        </div>
      )}
    </Modal>
  )
}
