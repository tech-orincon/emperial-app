import { useState } from 'react'
import { Eye, Plus } from 'lucide-react'
import { Button } from '../../../../../components/ui/Button'
import { SectionCard } from '../SectionCard'
import { GroupFormModal } from './GroupFormModal'
import { OptionsEditorModal } from './OptionsEditorModal'
import { ScaleEditorModal } from './ScaleEditorModal'
import { isScaleControl } from './config.types'
import { QuotePreview } from './QuotePreview'
import { GroupCard } from './GroupCard'
import {
  createConfigGroup,
  deleteConfigGroup,
  replaceConfigOptions,
  replaceScalePoints,
  updateConfigGroup,
} from '../../../../../services/service-config.service'
import type {
  ConfigGroup,
  ConfigOptionInput,
  CreateConfigGroupPayload,
  ScalePointInput,
} from '../../../../../types/service-config.types'

interface Props {
  serviceId: number
  groups: ConfigGroup[]
  mutate: (action: () => Promise<void>, ok: string, err: string) => Promise<boolean>
}

export function ConfigSection({ serviceId, groups, mutate }: Props) {
  const [editingGroup, setEditingGroup] = useState<ConfigGroup | null>(null)
  const [groupOpen, setGroupOpen] = useState(false)
  const [optionsFor, setOptionsFor] = useState<ConfigGroup | null>(null)
  const [scaleFor, setScaleFor] = useState<ConfigGroup | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [revision, setRevision] = useState(0)

  const bump = (ok: boolean) => {
    if (ok) setRevision((r) => r + 1)
    return ok
  }

  const submitGroup = (payload: CreateConfigGroupPayload) =>
    (editingGroup
      ? mutate(
          () => updateConfigGroup(editingGroup.id, payload),
          'Grupo actualizado',
          'No se pudo actualizar',
        )
      : mutate(
          () => createConfigGroup(serviceId, payload),
          'Grupo creado',
          'No se pudo crear el grupo',
        )
    ).then(bump)

  const submitOptions = async (items: ConfigOptionInput[]) => {
    const group = optionsFor
    if (!group) return false
    return mutate(
      () => replaceConfigOptions(group.id, items),
      'Opciones guardadas',
      'No se pudieron guardar',
    ).then(bump)
  }

  const submitScale = async (items: ScalePointInput[]) => {
    const group = scaleFor
    if (!group) return false
    return mutate(
      () => replaceScalePoints(group.id, items),
      'Escala guardada',
      'No se pudo guardar la escala',
    ).then(bump)
  }

  const handleDelete = (group: ConfigGroup) => {
    if (!confirm(`¿Eliminar el grupo "${group.label}" y sus opciones?`)) return
    mutate(() => deleteConfigGroup(group.id), 'Grupo eliminado', 'No se pudo eliminar').then(bump)
  }

  const labelOfTrigger = (id: number | null) => {
    if (id === null) return null
    for (const g of groups) {
      const o = g.options.find((x) => x.id === id)
      if (o) return `${g.label}: ${o.label}`
    }
    return `opción ${id}`
  }

  return (
    <SectionCard
      title={`Configurador (${groups.length})`}
      hint="Grupos de opciones que recalculan el precio. Si está vacío, el servicio se vende por paquetes."
      actions={
        <div className="flex gap-2">
          {groups.length > 0 && (
            <Button size="sm" variant="secondary" onClick={() => setShowPreview((v) => !v)}>
              <Eye className="w-4 h-4 mr-1" /> {showPreview ? 'Ocultar' : 'Previsualizar'}
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => {
              setEditingGroup(null)
              setGroupOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> Nuevo grupo
          </Button>
        </div>
      }
    >
      {groups.length === 0 ? (
        <p className="text-sm text-slate-400 py-2">
          Sin grupos. Añade uno para que el cliente pueda configurar el servicio y el precio
          se recalcule solo.
        </p>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              triggerLabel={labelOfTrigger(group.visibleWhenOptionId)}
              onEditOptions={() =>
                isScaleControl(group.control) ? setScaleFor(group) : setOptionsFor(group)
              }
              onEdit={() => {
                setEditingGroup(group)
                setGroupOpen(true)
              }}
              onDelete={() => handleDelete(group)}
            />
          ))}
        </div>
      )}

      {showPreview && (
        <div className="mt-4">
          <QuotePreview serviceId={serviceId} groups={groups} revision={revision} />
        </div>
      )}

      <GroupFormModal
        isOpen={groupOpen}
        group={editingGroup}
        allGroups={groups}
        onClose={() => setGroupOpen(false)}
        onSubmit={submitGroup}
      />
      <OptionsEditorModal
        isOpen={optionsFor !== null}
        group={optionsFor}
        onClose={() => setOptionsFor(null)}
        onSubmit={submitOptions}
      />
      <ScaleEditorModal
        isOpen={scaleFor !== null}
        group={scaleFor}
        onClose={() => setScaleFor(null)}
        onSubmit={submitScale}
      />
    </SectionCard>
  )
}
