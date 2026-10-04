import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, ExternalLink } from 'lucide-react'
import { AdminLayout } from '../../components/AdminLayout'
import { ErrorState } from '../../../../components/ui/ErrorState'
import { Skeleton } from '../../../../components/ui/Skeleton'
import { useAdminServiceDetail } from './useAdminServiceDetail'
import { OptionsSection } from './OptionsSection'
import { FeaturesSection } from './FeaturesSection'
import { RequirementsSection } from './RequirementsSection'
import { OffersSection } from './OffersSection'
import { ConfigSection } from './config/ConfigSection'

export function AdminServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const serviceId = Number(id)
  const { detail, isLoading, error, reload, mutate } = useAdminServiceDetail(serviceId)

  if (isLoading) {
    return (
      <AdminLayout title="Servicio">
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </AdminLayout>
    )
  }

  if (error || !detail) {
    return (
      <AdminLayout title="Servicio">
        <ErrorState variant="notFound" description={error ?? undefined} onRetry={reload} />
      </AdminLayout>
    )
  }

  // Con configurador el precio ya no sale de los paquetes
  const hasNoPackages = detail.packages.length === 0 && detail.configGroups.length === 0

  return (
    <AdminLayout
      title={detail.title}
      description={`${detail.game.name} · ${detail.category.name}`}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/admin/services"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" /> Servicios
          </Link>
          <Link
            to={`/service/${detail.id}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
          >
            Ver en el sitio <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      }
    >
      <div className="space-y-4 max-w-4xl">
        {hasNoPackages && (
          <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-300 font-medium">Este servicio todavía no se puede comprar</p>
              <p className="text-amber-200/70 mt-0.5">
                Sin paquetes el detalle muestra $0.00 y el botón “Buy Now” sale deshabilitado.
                Añade al menos uno para publicarlo.
              </p>
            </div>
          </div>
        )}

        <ConfigSection serviceId={detail.id} groups={detail.configGroups} mutate={mutate} />
        <OptionsSection serviceId={detail.id} type="PACKAGE" options={detail.packages} mutate={mutate} />
        <OptionsSection serviceId={detail.id} type="ADDON" options={detail.addons} mutate={mutate} />
        <FeaturesSection serviceId={detail.id} features={detail.features} mutate={mutate} />
        <RequirementsSection serviceId={detail.id} requirements={detail.requirements} mutate={mutate} />
        <OffersSection serviceId={detail.id} offers={detail.offers} mutate={mutate} />
      </div>
    </AdminLayout>
  )
}
