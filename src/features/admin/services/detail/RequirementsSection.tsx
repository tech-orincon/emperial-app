import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { SectionCard } from './SectionCard'
import { replaceServiceRequirements } from '../../../../services/admin.service'
import { inputCls } from '../service-form.types'
import type { AdminRequirement } from '../../../../types/admin-service-detail.types'
import type { RequirementItem } from '../../../../types/admin.types'

interface Props {
  serviceId: number
  requirements: AdminRequirement[]
  mutate: (action: () => Promise<void>, ok: string, err: string) => Promise<boolean>
}

type Draft = { title: string; description: string }

const toDrafts = (list: AdminRequirement[]): Draft[] =>
  list.map((r) => ({ title: r.title, description: r.description }))

export function RequirementsSection({ serviceId, requirements, mutate }: Props) {
  const [items, setItems] = useState<Draft[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setItems(toDrafts(requirements))
  }, [requirements])

  const isDirty = JSON.stringify(items) !== JSON.stringify(toDrafts(requirements))

  const patch = (i: number, field: keyof Draft, value: string) =>
    setItems((prev) => prev.map((it, j) => (j === i ? { ...it, [field]: value } : it)))

  const handleSave = async () => {
    setIsSaving(true)
    const payload: RequirementItem[] = items
      .map((it, i) => ({
        title: it.title.trim(),
        description: it.description.trim(),
        displayOrder: i,
      }))
      .filter((it) => it.title.length > 0 && it.description.length > 0)
    await mutate(
      () => replaceServiceRequirements(serviceId, payload),
      'Requisitos guardados',
      'No se pudieron guardar los requisitos',
    )
    setIsSaving(false)
  }

  return (
    <SectionCard
      title={`Requisitos (${requirements.length})`}
      hint="Reemplazo total. Título y descripción son obligatorios: las filas incompletas se descartan."
      actions={
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setItems((p) => [...p, { title: '', description: '' }])}
          >
            <Plus className="w-4 h-4 mr-1" /> Añadir
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!isDirty || isSaving}>
            {isSaving ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      }
    >
      {items.length === 0 ? (
        <p className="text-sm text-slate-400 py-2">
          Sin requisitos. La pestaña “Requirements” del detalle queda vacía.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1 grid sm:grid-cols-3 gap-2">
                <input
                  className={inputCls}
                  value={it.title}
                  onChange={(e) => patch(i, 'title', e.target.value)}
                  placeholder="Account access"
                />
                <input
                  className={`${inputCls} sm:col-span-2`}
                  value={it.description}
                  onChange={(e) => patch(i, 'description', e.target.value)}
                  placeholder="Se necesitan credenciales durante el boost"
                />
              </div>
              <button
                onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
                className="shrink-0 w-10 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center"
                aria-label="Quitar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}
