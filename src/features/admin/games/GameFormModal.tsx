import { useEffect, useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import type { AdminGame, CreateGamePayload } from '../../../types/admin.types'

interface Props {
  isOpen: boolean
  /** null = alta; un juego = edición */
  game: AdminGame | null
  isSaving: boolean
  onClose: () => void
  onSubmit: (payload: CreateGamePayload) => void
}

const EMPTY: CreateGamePayload = { name: '', slug: '', imageUrl: '', icon: '', tags: [] }

const inputCls =
  'w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'

/** Genera un slug legible desde el nombre, sólo al crear. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function GameFormModal({ isOpen, game, isSaving, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CreateGamePayload>(EMPTY)
  const isEdit = game !== null

  useEffect(() => {
    if (!isOpen) return
    setForm(
      game
        ? {
            name: game.name,
            slug: game.slug,
            imageUrl: game.imageUrl ?? '',
            icon: game.icon ?? '',
            tags: game.tags,
          }
        : EMPTY,
    )
  }, [isOpen, game])

  const set = (k: keyof CreateGamePayload, v: string | string[]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const canSubmit = form.name.trim() !== '' && form.slug.trim() !== '' && !isSaving

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar juego' : 'Nuevo juego'} size="lg">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Nombre *</label>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => {
              set('name', e.target.value)
              if (!isEdit) set('slug', slugify(e.target.value))
            }}
            placeholder="World of Warcraft"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Slug *</label>
          <input
            className={inputCls}
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder="world-of-warcraft"
          />
          <p className="text-xs text-slate-500">Debe ser único. Se usa en la URL del catálogo.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Imagen (URL)</label>
            <input className={inputCls} value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-slate-400">Icono</label>
            <input
              className={inputCls}
              value={form.icon}
              onChange={(e) => set('icon', e.target.value)}
              placeholder="Sword"
            />
            <p className="text-xs text-slate-500">Nombre de icono de Lucide, en PascalCase.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-400">Tags</label>
          <input
            className={inputCls}
            value={(form.tags ?? []).join(', ')}
            onChange={(e) =>
              set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))
            }
            placeholder="mmorpg, popular"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={() => onSubmit(form)} disabled={!canSubmit}>
            {isSaving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear juego'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
