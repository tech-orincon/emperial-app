import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Plus, Pencil, Eye, EyeOff, Trash2, Star, Zap, Layers, AlertTriangle } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { AdminLayout } from '../components/AdminLayout'
import { ResourceTable, type Column } from '../components/ResourceTable'
import { StatusBadge } from '../components/StatusBadge'
import { GameFilter } from '../components/GameFilter'
import { ServiceFormModal } from './ServiceFormModal'
import type { ServiceFormValues } from './service-form.types'
import { useAdminResource } from '../hooks/useAdminCatalog'
import {
  createService,
  deleteService,
  getAdminServices,
  updateService,
} from '../../../services/admin.service'
import type { AdminService } from '../../../types/admin.types'

export function AdminServicesPage() {
  const [gameId, setGameId] = useState<number | null>(null)
  const [editing, setEditing] = useState<AdminService | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetcher = useCallback(
    () => getAdminServices(gameId ? { gameId } : undefined),
    [gameId],
  )
  const { rows, isLoading, error, isSaving, reload, run } = useAdminResource<AdminService>({ fetcher })

  const handleSubmit = async (v: ServiceFormValues) => {
    const basePrice = Number.parseFloat(v.basePrice)
    const common = {
      title: v.title,
      description: v.description,
      imageUrl: v.imageUrl || undefined,
      basePrice,
      deliveryType: v.deliveryType,
      deliveryTime: v.deliveryTime,
      estimatedTime: v.estimatedTime,
      isBestSeller: v.isBestSeller,
      isInstant: v.isInstant,
      isFeatured: v.isFeatured,
    }

    const ok = editing
      ? await run(
          () => updateService(editing.id, common),
          'Servicio actualizado',
          'No se pudo actualizar',
        )
      : v.gameId === null || v.gameCategoryId === null
        ? false
        : await run(
            () => createService({
              ...common,
              gameId: v.gameId as number,
              gameCategoryId: v.gameCategoryId as number,
              isActive: v.isActive,
            }),
            'Servicio creado',
            'No se pudo crear',
          )

    if (ok) { setIsFormOpen(false); setEditing(null) }
  }

  const openCreate = () => { setEditing(null); setIsFormOpen(true) }
  const openEdit = (s: AdminService) => { setEditing(s); setIsFormOpen(true) }

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
      className: 'w-44',
      render: (s) => (
        <div className="text-xs">
          <span className="text-slate-400">
            {s.optionsCount} opc · {s.offersCount} ofertas · {s.ordersCount} órdenes
          </span>
          {s.optionsCount === 0 && (
            <div className="flex items-center gap-1 text-amber-400 mt-0.5">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              Sin paquetes: no se puede comprar
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Acciones',
      className: 'w-40',
      render: (s) => (
        <div className="flex items-center gap-1">
          <Link
            to={`/admin/services/${s.id}`}
            title="Paquetes, add-ons, features, requisitos y ofertas"
            className="p-1.5 rounded hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Layers className="w-4 h-4" />
          </Link>
          <button onClick={() => openEdit(s)} title="Editar"
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
      description="Lo que compran los clientes. Tras crearlo, añade sus paquetes y add-ons."
      actions={
        <div className="flex items-center gap-3">
          <GameFilter value={gameId} onChange={setGameId} />
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo servicio
          </Button>
        </div>
      }
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
        isOpen={isFormOpen}
        service={editing}
        isSaving={isSaving}
        onClose={() => { setIsFormOpen(false); setEditing(null) }}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  )
}
