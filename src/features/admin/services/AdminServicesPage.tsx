import { useCallback, useState } from 'react'
import { Toaster } from 'sonner'
import { Pencil, Eye, EyeOff, Trash2, Star, Zap } from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import { ResourceTable, type Column } from '../components/ResourceTable'
import { StatusBadge } from '../components/StatusBadge'
import { GameFilter } from '../components/GameFilter'
import { ServiceFormModal } from './ServiceFormModal'
import { useAdminResource } from '../hooks/useAdminCatalog'
import {
  deleteService,
  getAdminServices,
  updateService,
} from '../../../services/admin.service'
import type { AdminService, UpdateServicePayload } from '../../../types/admin.types'

export function AdminServicesPage() {
  const [gameId, setGameId] = useState<number | null>(null)
  const [editing, setEditing] = useState<AdminService | null>(null)

  const fetcher = useCallback(
    () => getAdminServices(gameId ? { gameId } : undefined),
    [gameId],
  )
  const { rows, isLoading, error, isSaving, reload, run } = useAdminResource<AdminService>({ fetcher })

  const handleSubmit = async (payload: UpdateServicePayload) => {
    if (!editing) return
    const ok = await run(
      () => updateService(editing.id, payload),
      'Servicio actualizado',
      'No se pudo actualizar',
    )
    if (ok) setEditing(null)
  }

  const handleDelete = (s: AdminService) => {
    const aviso = s.ordersCount > 0
      ? `"${s.title}" tiene ${s.ordersCount} orden(es) en su historial. Si alguna sigue abierta, el borrado será rechazado.\n\n¿Intentar de todas formas?`
      : `¿Borrar "${s.title}"? Es un borrado lógico.`
    if (window.confirm(aviso)) {
      run(() => deleteService(s.id), 'Servicio borrado', 'No se pudo borrar')
    }
  }

  const columns: Column<AdminService>[] = [
    {
      header: 'Servicio',
      render: (s) => (
        <div className="max-w-xs">
          <div className="font-medium text-white flex items-center gap-1.5">
            <span className="truncate">{s.title}</span>
            {s.isBestSeller && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
            {s.isInstant && <Zap className="w-3 h-3 text-emerald-400 shrink-0" />}
          </div>
          <div className="text-xs text-slate-500">{s.game.name} · {s.category.name}</div>
        </div>
      ),
    },
    {
      header: 'Precio',
      className: 'w-24',
      render: (s) => <span className="text-white font-medium">${s.basePrice}</span>,
    },
    { header: 'Estado', className: 'w-28', render: (s) => <StatusBadge isActive={s.isActive} deletedAt={s.deletedAt} /> },
    {
      header: 'Contenido',
      className: 'w-40',
      render: (s) => (
        <span className="text-slate-400 text-xs">
          {s.optionsCount} opc · {s.offersCount} ofertas · {s.ordersCount} órdenes
        </span>
      ),
    },
    {
      header: 'Acciones',
      className: 'w-32',
      render: (s) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setEditing(s)} title="Editar"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => run(
              () => updateService(s.id, { isActive: !s.isActive }),
              s.isActive ? 'Servicio desactivado' : 'Servicio activado',
              'No se pudo cambiar el estado',
            )}
            title={s.isActive ? 'Desactivar' : 'Activar'}
            disabled={s.deletedAt !== null}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
          >
            {s.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button onClick={() => handleDelete(s)} title="Borrar" disabled={s.deletedAt !== null}
            className="p-1.5 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-30">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout
      title="Servicios"
      description="Lo que compran los clientes. El alta se hace hoy por API; aquí se edita y se retira."
      actions={<GameFilter value={gameId} onChange={setGameId} />}
    >
      <Toaster theme="dark" position="top-right" richColors />
      <ResourceTable
        rows={rows}
        columns={columns}
        rowKey={(s) => s.id}
        isLoading={isLoading}
        error={error}
        onRetry={reload}
        emptyMessage="No hay servicios para este filtro."
        rowClassName={(s) => (s.deletedAt ? 'opacity-40' : '')}
      />
      <ServiceFormModal
        service={editing}
        isSaving={isSaving}
        onClose={() => setEditing(null)}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  )
}
