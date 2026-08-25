import { useCallback, useState } from 'react'
import { Plus, Pencil, Eye, EyeOff, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { ResourceTable, type Column } from '../components/ResourceTable'
import { StatusBadge } from '../components/StatusBadge'
import { CountryFormModal } from './CountryFormModal'
import { useAdminResource } from '../hooks/useAdminCatalog'
import {
  createCountry,
  deleteCountry,
  getAdminCountries,
  updateCountry,
} from '../../../services/admin.service'
import type { AdminCountry, CreateCountryPayload } from '../../../types/admin.types'

export function CountriesTab() {
  const [editing, setEditing] = useState<AdminCountry | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetcher = useCallback(() => getAdminCountries(), [])
  const { rows, isLoading, error, isSaving, reload, run } = useAdminResource<AdminCountry>({ fetcher })

  const handleSubmit = async (p: CreateCountryPayload) => {
    const ok = editing
      ? await run(() => updateCountry(editing.id, p), 'País actualizado', 'No se pudo actualizar')
      : await run(() => createCountry(p), 'País creado', 'No se pudo crear')
    if (ok) setIsFormOpen(false)
  }

  const handleDelete = (c: AdminCountry) => {
    const refs = c.usersCount + c.providersCount
    const aviso = refs > 0
      ? `"${c.name}" lo referencian ${c.usersCount} usuario(s) y ${c.providersCount} provider(s). El borrado será rechazado — usa "desactivar" para quitarlo del onboarding.\n\n¿Intentar de todas formas?`
      : `¿Borrar "${c.name}"? Es un borrado lógico.`
    if (window.confirm(aviso)) run(() => deleteCountry(c.id), 'País borrado', 'No se pudo borrar')
  }

  const columns: Column<AdminCountry>[] = [
    {
      header: 'País',
      render: (c) => (
        <div>
          <div className="font-medium text-white">{c.name}</div>
          <div className="text-xs text-slate-500 font-mono">{c.isoCode} · {c.currencyCode}</div>
        </div>
      ),
    },
    {
      header: 'Estado',
      className: 'w-28',
      render: (c) => <StatusBadge isActive={c.status === 'ACTIVE'} deletedAt={c.deletedAt} />,
    },
    {
      header: 'En uso',
      className: 'w-36',
      render: (c) => (
        <span className="text-slate-400 text-xs">{c.usersCount} users · {c.providersCount} prov</span>
      ),
    },
    {
      header: 'Acciones',
      className: 'w-32',
      render: (c) => (
        <div className="flex items-center gap-1">
          <button onClick={() => { setEditing(c); setIsFormOpen(true) }} title="Editar"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white">
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => run(
              () => updateCountry(c.id, { status: c.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' }),
              c.status === 'ACTIVE' ? 'País desactivado' : 'País activado',
              'No se pudo cambiar el estado',
            )}
            title={c.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
            disabled={c.deletedAt !== null}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
          >
            {c.status === 'ACTIVE' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button onClick={() => handleDelete(c)} title="Borrar" disabled={c.deletedAt !== null}
            className="p-1.5 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 disabled:opacity-30">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setIsFormOpen(true) }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo país
        </Button>
      </div>
      <ResourceTable
        rows={rows} columns={columns} rowKey={(c) => c.id}
        isLoading={isLoading} error={error} onRetry={reload}
        emptyMessage="No hay países."
        rowClassName={(c) => (c.deletedAt ? 'opacity-40' : '')}
      />
      <CountryFormModal
        isOpen={isFormOpen} country={editing} isSaving={isSaving}
        onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit}
      />
    </div>
  )
}
