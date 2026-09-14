import { useEffect, useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { GameFilter } from '../components/GameFilter'
import { CategorySelect } from '../components/CategorySelect'
import { ServiceFormFields } from './ServiceFormFields'
import {
  EMPTY_SERVICE,
  inputCls,
  type ServiceFormValues,
} from './service-form.types'
import type { AdminService } from '../../../types/admin.types'

interface Props {
  isOpen: boolean
  /** null = alta; un servicio = edición */
  service: AdminService | null
  isSaving: boolean
  onClose: () => void
  onSubmit: (values: ServiceFormValues) => void
}

export function ServiceFormModal({ isOpen, service, isSaving, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<ServiceFormValues>(EMPTY_SERVICE)
  const isEdit = service !== null

  useEffect(() => {
    if (!isOpen) return
    setForm(
      service
        ? {
            gameId: service.game.id,
            gameCategoryId: service.category.id,
            title: service.title,
            description: service.description,
            imageUrl: service.imageUrl ?? '',
            basePrice: service.basePrice,
            deliveryType: service.deliveryType,
            deliveryTime: service.deliveryTime ?? '',
            estimatedTime: service.estimatedTime,
            isBestSeller: service.isBestSeller,
            isInstant: service.isInstant,
            isFeatured: service.isFeatured,
            isActive: service.isActive,
          }
        : EMPTY_SERVICE,
    )
  }, [isOpen, service])

  const set = <K extends keyof ServiceFormValues>(key: K, value: ServiceFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // Cambiar de juego invalida la categoría elegida: pertenece al juego anterior
  const setGame = (gameId: number | null) =>
    setForm((prev) => ({ ...prev, gameId, gameCategoryId: null }))

  const price = Number.parseFloat(form.basePrice)
  const priceOk = Number.isFinite(price) && price > 0

  const canSubmit =
    form.title.trim() !== '' &&
    form.description.trim() !== '' &&
    form.deliveryTime.trim() !== '' &&
    form.estimatedTime.trim() !== '' &&
    priceOk &&
    (isEdit || (form.gameId !== null && form.gameCategoryId !== null)) &&
    !isSaving

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar servicio' : 'Nuevo servicio'}
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={() => onSubmit(form)} disabled={!canSubmit}>
            {isSaving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear servicio'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {isEdit ? (
          <p className="text-xs text-slate-500">
            {service.game.name} · {service.category.name} — mover de categoría sólo se
            permite dentro del mismo juego, y aún no está en este formulario.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-slate-400">Juego *</label>
              <GameFilter value={form.gameId} onChange={setGame} label="" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-400">Categoría *</label>
              <CategorySelect
                gameId={form.gameId}
                value={form.gameCategoryId}
                onChange={(id) => set('gameCategoryId', id)}
                className={inputCls}
              />
            </div>
          </div>
        )}

        <ServiceFormFields values={form} onChange={set} showActiveToggle={!isEdit} />

      </div>
    </Modal>
  )
}
