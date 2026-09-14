import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { SectionCard } from './SectionCard'
import { OfferFormModal } from './OfferFormModal'
import {
  createServiceOffer,
  deleteServiceOffer,
  updateServiceOffer,
} from '../../../../services/admin-service-detail.service'
import type { AdminOffer, UpdateServiceOfferPayload } from '../../../../types/admin-service-detail.types'

interface Props {
  serviceId: number
  offers: AdminOffer[]
  mutate: (action: () => Promise<void>, ok: string, err: string) => Promise<boolean>
}

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('es', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'

/** Misma condición que aplica el backend al resolver `activeOffer` */
function isLive(offer: AdminOffer): boolean {
  if (!offer.isActive) return false
  const now = Date.now()
  if (offer.startsAt && new Date(offer.startsAt).getTime() > now) return false
  if (offer.endsAt && new Date(offer.endsAt).getTime() < now) return false
  return true
}

export function OffersSection({ serviceId, offers, mutate }: Props) {
  const [editing, setEditing] = useState<AdminOffer | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (payload: UpdateServiceOfferPayload) => {
    if (editing) {
      return mutate(
        () => updateServiceOffer(editing.id, payload),
        'Oferta actualizada',
        'No se pudo actualizar',
      )
    }
    // el modal ya lo exige; el tipo parcial no puede saberlo
    const { finalPrice, ...rest } = payload
    if (finalPrice === undefined) return false
    return mutate(
      () => createServiceOffer({ serviceId, ...rest, finalPrice }),
      'Oferta creada',
      'No se pudo crear la oferta',
    )
  }

  const handleDelete = (offer: AdminOffer) => {
    if (!confirm('¿Eliminar esta oferta?')) return
    mutate(() => deleteServiceOffer(offer.id), 'Oferta eliminada', 'No se pudo eliminar')
  }

  return (
    <SectionCard
      title={`Ofertas (${offers.length})`}
      hint="Descuento sobre el precio base. Sólo una puede estar vigente a la vez en el detalle público."
      actions={
        <Button size="sm" onClick={() => { setEditing(null); setIsOpen(true) }}>
          <Plus className="w-4 h-4 mr-1" /> Nueva oferta
        </Button>
      }
    >
      {offers.length === 0 ? (
        <p className="text-sm text-slate-400 py-2">Sin ofertas. El servicio se vende a precio de lista.</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {offers.map((offer) => (
            <li key={offer.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <span
                className={`shrink-0 text-[10px] uppercase tracking-wide rounded px-1.5 py-0.5 border ${
                  isLive(offer)
                    ? 'text-green-400 bg-green-500/10 border-green-500/20'
                    : 'text-slate-400 bg-white/5 border-white/10'
                }`}
              >
                {isLive(offer) ? 'Vigente' : offer.isActive ? 'Fuera de fecha' : 'Inactiva'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">
                  {offer.title ?? 'Sin título'}
                  {offer.tag && <span className="text-slate-500 font-normal"> · {offer.tag.replace('_', ' ')}</span>}
                </p>
                <p className="text-xs text-slate-400">
                  {fmtDate(offer.startsAt)} → {fmtDate(offer.endsAt)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-semibold text-amber-400">${parseFloat(offer.finalPrice).toFixed(2)}</p>
                {offer.originalPrice && (
                  <p className="text-xs text-slate-500 line-through">
                    ${parseFloat(offer.originalPrice).toFixed(2)}
                  </p>
                )}
              </div>
              <div className="shrink-0 flex gap-1">
                <button
                  onClick={() => { setEditing(offer); setIsOpen(true) }}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                  aria-label="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(offer)}
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

      <OfferFormModal
        isOpen={isOpen}
        offer={editing}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </SectionCard>
  )
}
