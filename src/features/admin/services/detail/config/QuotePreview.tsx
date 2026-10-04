import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { getServiceConfig, quoteService } from '../../../../../services/service-config.service'
import { formatAmount, formatDelivery } from './config.types'
import { applyPick, visibleGroups } from '../../../../../lib/configuratorSelection'
import type { ConfigGroup, Quote } from '../../../../../types/service-config.types'

interface Props {
  serviceId: number
  groups: ConfigGroup[]
  /** Cambia cuando el admin guarda algo, para resembrar la selección */
  revision: number
}

function apiMessage(err: unknown): string {
  const m = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data
    ?.message
  return Array.isArray(m) ? m.join(', ') : (m ?? 'No se pudo cotizar')
}

/**
 * Réplica de lo que verá el cliente. El precio lo calcula el backend en cada
 * cambio: es el mismo cálculo que se aplicará al cobrar.
 */
export function QuotePreview({ serviceId, groups, revision }: Props) {
  const [selected, setSelected] = useState<number[]>([])
  const [quote, setQuote] = useState<Quote | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Selección inicial: la que propone el backend
  useEffect(() => {
    let alive = true
    getServiceConfig(serviceId)
      .then((c) => {
        if (!alive) return
        setSelected(c.defaultSelection)
        setQuote(c.defaultQuote)
        setError(null)
      })
      .catch((err) => alive && setError(apiMessage(err)))
    return () => {
      alive = false
    }
  }, [serviceId, revision])

  const recompute = useCallback(
    async (ids: number[]) => {
      setIsLoading(true)
      try {
        setQuote(await quoteService(serviceId, ids))
        setError(null)
      } catch (err) {
        setQuote(null)
        setError(apiMessage(err))
      } finally {
        setIsLoading(false)
      }
    },
    [serviceId],
  )

  const pick = (group: ConfigGroup, optionId: number) => {
    const next = applyPick(groups, selected, group, optionId)
    setSelected(next)
    recompute(next)
  }

  const shown = visibleGroups(groups, selected)

  if (groups.length === 0) return null

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">
        Vista previa del cliente
      </p>

      <div className="space-y-3">
        {shown.map((group) => (
            <div key={group.id}>
              <p className="text-xs text-slate-400 mb-1.5">
                {group.label}
                {group.isRequired && group.control !== 'SWITCH' && (
                  <span className="text-amber-500/70"> *</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.options.map((o) => (
                  <button
                    key={o.id}
                    disabled={!o.isEnabled}
                    onClick={() => pick(group, o.id)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      selected.includes(o.id)
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                        : 'bg-slate-800 border-white/10 text-slate-300 hover:border-white/25'
                    }`}
                  >
                    {o.label}
                    <span className="ml-1.5 text-slate-500">
                      {formatAmount(o.priceKind, o.priceAmount)}
                    </span>
                    {o.badge && <span className="ml-1 text-amber-400">{o.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10">
        {error ? (
          <p className="flex items-start gap-2 text-xs text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" /> {error}
          </p>
        ) : quote ? (
          <>
            <div className="space-y-0.5 mb-2">
              {quote.lines.map((l) => (
                <div key={l.optionId} className="flex justify-between text-[11px]">
                  <span className="text-slate-500">
                    {l.groupLabel}: {l.label}
                  </span>
                  <span className={parseFloat(l.amount) === 0 ? 'text-slate-600' : 'text-slate-400'}>
                    ${l.amount}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Total</span>
              <span className="text-xl font-bold text-amber-400 flex items-center gap-2">
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />}
                ${quote.total}
              </span>
            </div>
            {quote.deliveryMinutes !== null && (
              <p className="text-[11px] text-slate-500 mt-1">
                Entrega: {formatDelivery(quote.deliveryMinutes)}
              </p>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}
