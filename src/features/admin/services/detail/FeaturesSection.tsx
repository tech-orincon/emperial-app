import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { SectionCard } from './SectionCard'
import { replaceServiceFeatures } from '../../../../services/admin.service'
import { inputCls } from '../service-form.types'
import type { AdminOptionFeature } from '../../../../types/admin-service-detail.types'

interface Props {
  serviceId: number
  features: AdminOptionFeature[]
  mutate: (action: () => Promise<void>, ok: string, err: string) => Promise<boolean>
}

export function FeaturesSection({ serviceId, features, mutate }: Props) {
  const [items, setItems] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setItems(features.map((f) => f.text))
  }, [features])

  const isDirty = JSON.stringify(items) !== JSON.stringify(features.map((f) => f.text))

  const handleSave = async () => {
    setIsSaving(true)
    await mutate(
      () =>
        replaceServiceFeatures(
          serviceId,
          items
            .map((text, i) => ({ text: text.trim(), displayOrder: i }))
            .filter((f) => f.text.length > 0),
        ),
      'Features guardados',
      'No se pudieron guardar los features',
    )
    setIsSaving(false)
  }

  return (
    <SectionCard
      title={`Features (${features.length})`}
      hint="Se guardan como lista completa: lo que ves aquí es exactamente lo que queda."
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setItems((p) => [...p, ''])}>
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
          Sin features. La pestaña “Overview” del detalle sólo muestra la descripción.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((text, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputCls}
                value={text}
                onChange={(e) =>
                  setItems((prev) => prev.map((t, j) => (j === i ? e.target.value : t)))
                }
                placeholder="Professional booster assigned"
              />
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
