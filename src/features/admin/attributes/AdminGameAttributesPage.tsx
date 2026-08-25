import { useCallback, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import { ArrowLeft, Pencil, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import { ResourceTable, type Column } from '../components/ResourceTable'
import { StatusBadge } from '../components/StatusBadge'
import { AttributeFormModal } from './AttributeFormModal'
import { useAdminResource } from '../hooks/useAdminCatalog'
import {
  deactivateGameAttribute,
  getAdminGameAttributes,
  updateGameAttribute,
} from '../../../services/admin.service'
import type {
  AdminGameAttribute,
  UpdateGameAttributePayload,
} from '../../../types/admin.types'

/** Los campos dinámicos del Paso 2 del onboarding, por juego. */
export function AdminGameAttributesPage() {
  const { gameId } = useParams()
  const id = Number(gameId)
  const [editing, setEditing] = useState<AdminGameAttribute | null>(null)

  const fetcher = useCallback(() => getAdminGameAttributes(id), [id])
  const { rows, isLoading, error, isSaving, reload, run } =
    useAdminResource<AdminGameAttribute>({ fetcher })

  const handleSubmit = async (payload: UpdateGameAttributePayload) => {
    if (!editing) return
    const ok = await run(
      async () => {
        const { providersAffected } = await updateGameAttribute(editing.id, payload)
        // El backend nos dice a cuántos providers afecta; conviene saberlo
        // cuando se tocan las opciones de un SELECT.
        if (providersAffected > 0) {
          toast.warning(
            `${providersAffected} provider(s) ya tienen datos en "${editing.key}". Revisa que sus valores sigan siendo válidos.`,
            { duration: 8000 },
          )
        }
      },
      'Campo actualizado',
      'No se pudo actualizar',
    )
    if (ok) setEditing(null)
  }

  const columns: Column<AdminGameAttribute>[] = [
    {
      header: 'Campo',
      render: (a) => (
        <div>
          <div className="font-medium text-white">{a.label}</div>
          <div className="text-xs text-slate-500 font-mono">{a.key}</div>
        </div>
      ),
    },
    {
      header: 'Tipo',
      className: 'w-32',
      render: (a) => (
        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-xs font-mono">
          {a.inputType}
        </span>
      ),
    },
    {
      header: 'Opciones',
      render: (a) =>
        a.options.length === 0 ? (
          <span className="text-slate-600 text-xs">—</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {a.options.map((o) => (
              <span key={o.id} className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 text-xs" title={o.value}>
                {o.label}
              </span>
            ))}
          </div>
        ),
    },
    {
      header: 'Obligatorio',
      className: 'w-24',
      render: (a) => (
        <span className={a.isRequired ? 'text-amber-400 text-xs' : 'text-slate-600 text-xs'}>
          {a.isRequired ? 'Sí' : 'No'}
        </span>
      ),
    },
    { header: 'Estado', className: 'w-28', render: (a) => <StatusBadge isActive={a.isActive} deletedAt={null} /> },
    {
      header: 'Acciones',
      className: 'w-24',
      render: (a) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setEditing(a)} title="Editar"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white">
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => run(
              () => (a.isActive
                ? deactivateGameAttribute(a.id)
                : updateGameAttribute(a.id, { isActive: true }).then(() => undefined)),
              a.isActive ? 'Campo desactivado' : 'Campo activado',
              'No se pudo cambiar el estado',
            )}
            title={a.isActive ? 'Quitar del formulario' : 'Añadir al formulario'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
          >
            {a.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout
      title="Campos del onboarding"
      description="Lo que se le pregunta al booster en el Paso 2, según el juego que elija."
      actions={
        <Link to="/admin/games" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Volver a juegos
        </Link>
      }
    >
      <Toaster theme="dark" position="top-right" richColors />

      <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-800/50 border border-white/5 mb-4">
        <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400">
          La <span className="font-mono text-slate-300">key</span> y el tipo son inmutables: indexan
          los datos que los boosters ya guardaron. Sólo se pueden crear campos nuevos por API.
        </p>
      </div>

      <ResourceTable
        rows={rows}
        columns={columns}
        rowKey={(a) => a.id}
        isLoading={isLoading}
        error={error}
        onRetry={reload}
        emptyMessage="Este juego no tiene campos configurados."
        rowClassName={(a) => (a.isActive ? '' : 'opacity-50')}
      />

      <AttributeFormModal
        attribute={editing}
        isSaving={isSaving}
        onClose={() => setEditing(null)}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  )
}
