import { useState } from 'react'
import { Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { SectionCard } from './SectionCard'
import { OptionFormModal } from './OptionFormModal'
import {
  createServiceOption,
  deleteServiceOption,
  updateServiceOption,
} from '../../../../services/admin-service-detail.service'
import type {
  AdminServiceOption,
  CreateServiceOptionPayload,
  ServiceOptionType,
} from '../../../../types/admin-service-detail.types'

interface Props {
  serviceId: number
  type: ServiceOptionType
  options: AdminServiceOption[]
  mutate: (action: () => Promise<void>, ok: string, err: string) => Promise<boolean>
}

const COPY = {
  PACKAGE: {
    title: 'Paquetes',
    hint: 'Sin al menos uno el servicio no se puede comprar: el precio y el botón salen de aquí.',
    add: 'Nuevo paquete',
    empty: 'Este servicio no tiene paquetes, así que el detalle muestra $0.00 y "Buy Now" deshabilitado.',
  },
  ADDON: {
    title: 'Add-ons',
    hint: 'Extras opcionales que el cliente suma al paquete.',
    add: 'Nuevo add-on',
    empty: 'Sin add-ons. La sección no se muestra en el detalle público.',
  },
} as const

export function OptionsSection({ serviceId, type, options, mutate }: Props) {
  const [editing, setEditing] = useState<AdminServiceOption | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const copy = COPY[type]

  const handleSubmit = (payload: CreateServiceOptionPayload) =>
    editing
      ? mutate(
          () => updateServiceOption(editing.id, payload),
          `${copy.title.slice(0, -1)} actualizado`,
          'No se pudo actualizar',
        )
      : mutate(
          () => createServiceOption(serviceId, payload),
          `${copy.title.slice(0, -1)} creado`,
          'No se pudo crear',
        )

  const handleDelete = (option: AdminServiceOption) => {
    if (!confirm(`¿Eliminar "${option.name}"? Se conserva en las órdenes ya creadas.`)) return
    mutate(() => deleteServiceOption(option.id), 'Eliminado', 'No se pudo eliminar')
  }

  return (
    <SectionCard
      title={`${copy.title} (${options.length})`}
      hint={copy.hint}
      actions={
        <Button
          size="sm"
          onClick={() => {
            setEditing(null)
            setIsOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-1" /> {copy.add}
        </Button>
      }
    >
      {options.length === 0 ? (
        <p className="text-sm text-slate-400 py-2">{copy.empty}</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {options.map((option) => (
            <li key={option.id} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium flex items-center gap-2">
                  {option.name}
                  {option.isPopular && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400" /> Popular
                    </span>
                  )}
                </p>
                {option.description && (
                  <p className="text-xs text-slate-400 mt-0.5">{option.description}</p>
                )}
                {option.features.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1">
                    {option.features.map((f) => f.text).join(' · ')}
                  </p>
                )}
              </div>
              <span className="shrink-0 font-semibold text-amber-400">
                ${parseFloat(option.price).toFixed(2)}
              </span>
              <div className="shrink-0 flex gap-1">
                <button
                  onClick={() => {
                    setEditing(option)
                    setIsOpen(true)
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                  aria-label="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(option)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                  aria-label="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <OptionFormModal
        isOpen={isOpen}
        type={type}
        option={editing}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </SectionCard>
  )
}
