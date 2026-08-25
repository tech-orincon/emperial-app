import { useCallback, useState } from 'react'
import { Toaster } from 'sonner'
import { Plus, Pencil, Eye, EyeOff, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { AdminLayout } from '../components/AdminLayout'
import { ResourceTable, type Column } from '../components/ResourceTable'
import { StatusBadge } from '../components/StatusBadge'
import { GameFilter } from '../components/GameFilter'
import { CategoryFormModal, type CategoryFormValues } from './CategoryFormModal'
import { useAdminResource } from '../hooks/useAdminCatalog'
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from '../../../services/admin.service'
import type { AdminCategory } from '../../../types/admin.types'

export function AdminCategoriesPage() {
  const [gameId, setGameId] = useState<number | null>(null)
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetcher = useCallback(() => getAdminCategories(gameId ?? undefined), [gameId])
  const { rows, isLoading, error, isSaving, reload, run } = useAdminResource<AdminCategory>({ fetcher })

  const handleSubmit = async (v: CategoryFormValues) => {
    const { gameId: targetGameId } = v
    if (!editing && targetGameId === null) return

    const ok = editing
      ? await run(
          () => updateCategory(editing.id, {
            name: v.name, slug: v.slug, description: v.description,
            icon: v.icon, imageUrl: v.imageUrl || undefined,
          }),
          'Categoría actualizada', 'No se pudo actualizar',
        )
      : await run(
          () => createCategory({
            gameId: targetGameId as number, name: v.name, slug: v.slug,
            description: v.description, icon: v.icon, imageUrl: v.imageUrl || undefined,
          }),
          'Categoría creada', 'No se pudo crear',
        )
    if (ok) setIsFormOpen(false)
  }

  const handleDelete = (c: AdminCategory) => {
    const hijos = c.servicesCount + c.providerSkillsCount
    const aviso = hijos > 0
      ? `"${c.name}" todavía tiene ${c.servicesCount} servicio(s) y ${c.providerSkillsCount} skill(s) de provider. El borrado será rechazado.\n\n¿Intentar de todas formas?`
      : `¿Borrar "${c.name}"? Es un borrado lógico.`
    if (window.confirm(aviso)) {
      run(() => deleteCategory(c.id), 'Categoría borrada', 'No se pudo borrar')
    }
  }

  const columns: Column<AdminCategory>[] = [
    {
      header: 'Categoría',
      render: (c) => (
        <div>
          <div className="font-medium text-white">{c.name}</div>
          <div className="text-xs text-slate-500 font-mono">{c.slug}</div>
        </div>
      ),
    },
    { header: 'Juego', className: 'w-40', render: (c) => <span className="text-slate-300 text-sm">{c.game.name}</span> },
    { header: 'Estado', className: 'w-28', render: (c) => <StatusBadge isActive={c.isActive} deletedAt={c.deletedAt} /> },
    {
      header: 'Contenido',
      className: 'w-36',
      render: (c) => (
        <span className="text-slate-400 text-xs">{c.servicesCount} serv · {c.providerSkillsCount} skills</span>
      ),
    },
    {
      header: 'Acciones',
      className: 'w-32',
      render: (c) => (
        <div className="flex items-center gap-1">
          <button onClick={() => { setEditing(c); setIsFormOpen(true) }} title="Editar"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => run(
              () => updateCategory(c.id, { isActive: !c.isActive }),
              c.isActive ? 'Categoría desactivada' : 'Categoría activada',
              'No se pudo cambiar el estado',
            )}
            title={c.isActive ? 'Desactivar' : 'Activar'}
            disabled={c.deletedAt !== null}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
          >
            {c.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button onClick={() => handleDelete(c)} title="Borrar" disabled={c.deletedAt !== null}
            className="p-1.5 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-30">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout
      title="Categorías"
      description="Agrupan los servicios dentro de cada juego."
      actions={
        <div className="flex items-center gap-3">
          <GameFilter value={gameId} onChange={setGameId} />
          <Button onClick={() => { setEditing(null); setIsFormOpen(true) }} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nueva categoría
          </Button>
        </div>
      }
    >
      <Toaster theme="dark" position="top-right" richColors />
      <ResourceTable
        rows={rows}
        columns={columns}
        rowKey={(c) => c.id}
        isLoading={isLoading}
        error={error}
        onRetry={reload}
        emptyMessage="No hay categorías para este filtro."
        rowClassName={(c) => (c.deletedAt ? 'opacity-40' : '')}
      />
      <CategoryFormModal
        isOpen={isFormOpen}
        category={editing}
        isSaving={isSaving}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  )
}
