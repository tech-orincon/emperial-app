import { useEffect, useState } from 'react'
import { Plus, Wand2 } from 'lucide-react'
import { Modal } from '../../../../../components/ui/Modal'
import { Button } from '../../../../../components/ui/Button'
import { ScalePointRow } from './ScalePointRow'
import { DEFAULT_TIERS, buildNumericScale, buildTierLadder, fullSpanPrice } from './scale-generator'
import type { ConfigGroup, ScalePointInput } from '../../../../../types/service-config.types'

interface Props {
  isOpen: boolean
  group: ConfigGroup | null
  onClose: () => void
  onSubmit: (items: ScalePointInput[]) => Promise<boolean>
}

export function ScaleEditorModal({ isOpen, group, onClose, onSubmit }: Props) {
  const [points, setPoints] = useState<ScalePointInput[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isOpen || !group) return
    setPoints(
      group.scalePoints.map((p) => ({
        value: p.value,
        label: p.label,
        tier: p.tier,
        iconUrl: p.iconUrl,
        stepPrice: parseFloat(p.stepPrice),
        stepMinutes: p.stepMinutes,
      })),
    )
    setIsSaving(false)
  }, [isOpen, group])

  const esLigas = group?.control === 'FROM_TO'

  const generar = () => {
    const generados = esLigas
      ? buildTierLadder(DEFAULT_TIERS)
      : buildNumericScale(1, 90, [
          { upTo: 60, stepPrice: 1.2, stepMinutes: 5 },
          { upTo: 80, stepPrice: 2.4, stepMinutes: 8 },
          { upTo: 999, stepPrice: 4.5, stepMinutes: 14 },
        ])
    setPoints(generados)
  }

  const patch = (i: number, k: keyof ScalePointInput, v: string | number | null) =>
    setPoints((prev) => prev.map((p, j) => (j === i ? { ...p, [k]: v } : p)))

  const valido = points.length === 0 || points.length >= 2
  const duplicados = new Set(points.map((p) => p.value)).size !== points.length

  const guardar = async () => {
    if (!valido || duplicados) return
    setIsSaving(true)
    // El último punto nunca aporta salto, pase lo que pase en la tabla
    const ordenados = [...points].sort((a, b) => a.value - b.value)
    if (ordenados.length > 0) {
      ordenados[ordenados.length - 1] = {
        ...ordenados[ordenados.length - 1],
        stepPrice: 0,
        stepMinutes: null,
      }
    }
    const ok = await onSubmit(ordenados)
    setIsSaving(false)
    if (ok) onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      title={`Escala de "${group?.label ?? ''}"`}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={generar}>
              <Wand2 className="w-4 h-4 mr-1" /> Generar {esLigas ? 'ligas' : 'niveles'}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                setPoints((p) => [
                  ...p,
                  {
                    value: p.length ? Math.max(...p.map((x) => x.value)) + 1 : 0,
                    label: null,
                    tier: null,
                    iconUrl: null,
                    stepPrice: 0,
                    stepMinutes: null,
                  },
                ])
              }
            >
              <Plus className="w-4 h-4 mr-1" /> Punto
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {points.length} puntos · recorrido completo{' '}
              <strong className="text-amber-400">${fullSpanPrice(points).toFixed(2)}</strong>
            </span>
            <Button variant="secondary" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={!valido || duplicados || isSaving}>
              {isSaving ? 'Guardando…' : 'Guardar'}
            </Button>
          </div>
        </div>
      }
    >
      <p className="text-xs text-slate-500 mb-3">
        El precio de ir de A a B es la <strong>suma de los saltos en [A, B)</strong>. El último
        punto vale 0: no hay salto después de él. La <em>columna</em> agrupa puntos en el
        selector — «Bronze» junta sus cuatro divisiones; un punto con columna propia sale solo.
      </p>

      {duplicados && (
        <p className="text-xs text-amber-400 mb-2">Hay posiciones repetidas: deben ser únicas.</p>
      )}
      {points.length === 1 && (
        <p className="text-xs text-amber-400 mb-2">Una escala necesita al menos dos puntos.</p>
      )}

      {points.length === 0 ? (
        <p className="text-sm text-slate-400 py-3">
          Sin escala. Pulsa «Generar» para partir de una estándar y ajústala.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-[3rem_1fr_1fr_5rem_5rem_2.5rem] gap-1.5 mb-1.5 text-[11px] text-slate-500">
            <span className="text-center">Pos</span>
            <span>Etiqueta</span>
            <span>Columna</span>
            <span className="text-right">Salto $</span>
            <span className="text-right">Min</span>
            <span />
          </div>
          <div className="space-y-1.5">
            {points.map((p, i) => (
              <ScalePointRow
                key={i}
                point={p}
                isLast={i === points.length - 1}
                onPatch={(k, v) => patch(i, k, v)}
                onRemove={() => setPoints((prev) => prev.filter((_, j) => j !== i))}
              />
            ))}
          </div>
        </>
      )}
    </Modal>
  )
}
