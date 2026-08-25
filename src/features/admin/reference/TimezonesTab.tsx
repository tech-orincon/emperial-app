import { useCallback, useState } from 'react'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { ResourceTable, type Column } from '../components/ResourceTable'
import { StatusBadge } from '../components/StatusBadge'
import { TimezoneFormModal } from './TimezoneFormModal'
import { useAdminResource } from '../hooks/useAdminCatalog'
import {
  createTimezone,
  deactivateTimezone,
  getAdminTimezones,
  updateTimezone,
} from '../../../services/admin.service'
import type { AdminTimezone, CreateTimezonePayload } from '../../../types/admin.types'

export function TimezonesTab() {
  const [editing, setEditing] = useState<AdminTimezone | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetcher = useCallback(() => getAdminTimezones(), [])
  const { rows, isLoading, error, isSaving, reload, run } = useAdminResource<AdminTimezone>({ fetcher })

  const handleSubmit = async (p: CreateTimezonePayload) => {
    const ok = editing
      ? await run(() => updateTimezone(editing.id, p), 'Zona actualizada', 'No se pudo actualizar')
      : await run(() => createTimezone(p), 'Zona creada', 'No se pudo crear')
    if (ok) setIsFormOpen(false)
  }

  const columns: Column<AdminTimezone>[] = [
    {
      header: 'Zona',
      render: (t) => (
        <div>
          <div className="font-medium text-white">{t.label}</div>
          <div className="text-xs text-slate-500 font-mono">{t.name}</div>
        </div>
      ),
    },
    { header: 'Offset', className: 'w-24', render: (t) => <span className="text-slate-300 font-mono text-xs">{t.utcOffset}</span> },
    { header: 'Región', className: 'w-32', render: (t) => <span className="text-slate-400 text-sm">{t.region}</span> },
    { header: 'Estado', className: 'w-28', render: (t) => <StatusBadge isActive={t.isActive} deletedAt={null} /> },
    {
      header: 'Acciones',
      className: 'w-24',
      render: (t) => (
        <div className="flex items-center gap-1">
          <button onClick={() => { setEditing(t); setIsFormOpen(true) }} title="Editar"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white">
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => run(
              () => (t.isActive ? deactivateTimezone(t.id) : updateTimezone(t.id, { isActive: true })),
              t.isActive ? 'Zona desactivada' : 'Zona activada',
              'No se pudo cambiar el estado',
            )}
            title={t.isActive ? 'Desactivar' : 'Activar'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
          >
            {t.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* La tabla no tiene deletedAt: aquí sólo se activa y desactiva */}
        <p className="text-xs text-slate-500">
          Las zonas no se borran, sólo se desactivan — los perfiles guardan el nombre como texto.
        </p>
        <Button onClick={() => { setEditing(null); setIsFormOpen(true) }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nueva zona
        </Button>
      </div>
      <ResourceTable
        rows={rows} columns={columns} rowKey={(t) => t.id}
        isLoading={isLoading} error={error} onRetry={reload}
        emptyMessage="No hay zonas horarias."
        rowClassName={(t) => (t.isActive ? '' : 'opacity-50')}
      />
      <TimezoneFormModal
        isOpen={isFormOpen} timezone={editing} isSaving={isSaving}
        onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit}
      />
    </div>
  )
}
