import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Plus, Pencil, Eye, EyeOff, Trash2, SlidersHorizontal } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { AdminLayout } from '../components/AdminLayout'
import { ResourceTable, type Column } from '../components/ResourceTable'
import { StatusBadge } from '../components/StatusBadge'
import { GameFormModal } from './GameFormModal'
import { useAdminGames } from '../hooks/useAdminGames'
import type { AdminGame, CreateGamePayload } from '../../../types/admin.types'

export function AdminGamesPage() {
  const { games, isLoading, error, isSaving, reload, create, update, toggleActive, remove } =
    useAdminGames()
  const [editing, setEditing] = useState<AdminGame | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const openCreate = () => { setEditing(null); setIsFormOpen(true) }
  const openEdit = (g: AdminGame) => { setEditing(g); setIsFormOpen(true) }

  const handleSubmit = async (payload: CreateGamePayload) => {
    const ok = editing ? await update(editing.id, payload) : await create(payload)
    if (ok) setIsFormOpen(false)
  }

  const handleDelete = (g: AdminGame) => {
    // El backend rechaza el borrado si cuelgan hijos y devuelve el detalle;
    // avisamos antes para no gastar el viaje.
    const hijos = g.categoriesCount + g.servicesCount + g.providersCount
    const aviso = hijos > 0
      ? `"${g.name}" todavía tiene ${g.categoriesCount} categoría(s), ${g.servicesCount} servicio(s) y ${g.providersCount} provider(s). El borrado será rechazado.\n\n¿Intentar de todas formas?`
      : `¿Borrar "${g.name}"? Es un borrado lógico y se puede revertir en base de datos.`
    if (window.confirm(aviso)) remove(g.id)
  }

  const columns: Column<AdminGame>[] = [
    {
      header: 'Juego',
      render: (g) => (
        <div>
          <div className="font-medium text-white">{g.name}</div>
          <div className="text-xs text-slate-500 font-mono">{g.slug}</div>
        </div>
      ),
    },
    {
      header: 'Estado',
      className: 'w-28',
      render: (g) => <StatusBadge isActive={g.isActive} deletedAt={g.deletedAt} />,
    },
    {
      header: 'Contenido',
      className: 'w-44',
      render: (g) => (
        <span className="text-slate-400 text-xs">
          {g.categoriesCount} cat · {g.servicesCount} serv · {g.providersCount} prov
        </span>
      ),
    },
    {
      header: 'Tags',
      render: (g) =>
        g.tags.length === 0 ? (
          <span className="text-slate-600 text-xs">—</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {g.tags.map((t) => (
              <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 text-xs">
                {t}
              </span>
            ))}
          </div>
        ),
    },
    {
      header: 'Acciones',
      className: 'w-40',
      render: (g) => (
        <div className="flex items-center gap-1">
          <Link
            to={`/admin/games/${g.id}/attributes`}
            title="Campos del onboarding"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Link>
          <button
            onClick={() => openEdit(g)}
            title="Editar"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleActive(g)}
            title={g.isActive ? 'Desactivar' : 'Activar'}
            disabled={g.deletedAt !== null}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {g.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => handleDelete(g)}
            title="Borrar"
            disabled={g.deletedAt !== null}
            className="p-1.5 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout
      title="Juegos"
      description="Añade juegos al catálogo, ocúltalos del storefront o retíralos."
      actions={
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo juego
        </Button>
      }
    >
      <Toaster theme="dark" position="top-right" richColors />

      <ResourceTable
        rows={games}
        columns={columns}
        rowKey={(g) => g.id}
        isLoading={isLoading}
        error={error}
        onRetry={reload}
        emptyMessage="No hay juegos todavía."
        rowClassName={(g) => (g.deletedAt ? 'opacity-40' : '')}
      />

      <GameFormModal
        isOpen={isFormOpen}
        game={editing}
        isSaving={isSaving}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  )
}
