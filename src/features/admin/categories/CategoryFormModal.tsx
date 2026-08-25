import { useEffect, useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { GameFilter } from '../components/GameFilter'
import type { AdminCategory } from '../../../types/admin.types'

export interface CategoryFormValues {
  gameId: number | null
  name: string
  slug: string
  description: string
  icon: string
  imageUrl: string
}

interface Props {
  isOpen: boolean
  category: AdminCategory | null
  isSaving: boolean
  onClose: () => void
  onSubmit: (values: CategoryFormValues) => void
}

const EMPTY: CategoryFormValues = {
  gameId: null, name: '', slug: '', description: '', icon: '', imageUrl: '',
}

const inputCls =
  'w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'

function slugify(v: string): string {
  return v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function CategoryFormModal({ isOpen, category, isSaving, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CategoryFormValues>(EMPTY)
  const isEdit = category !== null

  useEffect(() => {
    if (!isOpen) return
    setForm(
      category
        ? {
            gameId: category.game.id,
            name: category.name,
            slug: category.slug,
            description: category.description ?? '',
            icon: category.icon ?? '',
            imageUrl: category.imageUrl ?? '',
          }
        : EMPTY,
    )
  }, [isOpen, category])

  const set = (k: keyof CategoryFormValues, v: string | number | null) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  // El juego sólo se elige al crear: moverla después dejaría sus servicios en otro juego.
  const canSubmit =
    form.name.trim() !== '' && form.slug.trim() !== '' && (isEdit || form.gameId !== null) && !isSaving

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar categoría' : 'Nueva categoría'} size="lg">
      <div className="space-y-4">
        {!isEdit && (
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Juego *</label>
            <GameFilter value={form.gameId} onChange={(id) => set('gameId', id)} label="" />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Nombre *</label>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => {
              set('name', e.target.value)
              if (!isEdit) set('slug', slugify(e.target.value))
            }}
            placeholder="Raid Boosting"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Slug *</label>
          <input className={inputCls} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
          <p className="text-xs text-slate-500">Único a nivel global, no sólo dentro del juego.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Descripción</label>
          <textarea
            className={`${inputCls} h-20 resize-none`}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Icono</label>
            <input className={inputCls} value={form.icon} onChange={(e) => set('icon', e.target.value)} placeholder="Sword" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Imagen (URL)</label>
            <input className={inputCls} value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isSaving}>Cancelar</Button>
          <Button className="flex-1" onClick={() => onSubmit(form)} disabled={!canSubmit}>
            {isSaving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
