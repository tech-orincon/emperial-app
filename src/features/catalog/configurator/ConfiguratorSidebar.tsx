import { Clock, Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { GlassCard } from '../../../components/ui/GlassCard'
import { ConfigGroupControl } from './ConfigGroupControl'
import { ScaleControl } from './ScaleControl'
import type { ConfigGroup, Quote, RangeSelection } from '../../../types/service-config.types'

interface Props {
  groups: ConfigGroup[]
  selected: number[]
  ranges: RangeSelection[]
  quote: Quote | null
  isQuoting: boolean
  error: string | null
  onPick: (group: ConfigGroup, optionId: number) => void
  onRange: (next: RangeSelection) => void
  onBuyNow: () => void
}

function formatDelivery(minutes: number | null): string | null {
  if (minutes === null) return null
  if (minutes < 60) return `${minutes} min`
  if (minutes < 1440) return `${Math.round((minutes / 60) * 10) / 10} h`
  return `${Math.round(minutes / 1440)} días`
}

export function ConfiguratorSidebar({
  groups,
  selected,
  ranges,
  quote,
  isQuoting,
  error,
  onPick,
  onRange,
  onBuyNow,
}: Props) {
  const delivery = formatDelivery(quote?.deliveryMinutes ?? null)

  return (
    <GlassCard className="p-6 sticky top-24">
      <h3 className="text-lg font-bold text-white mb-6">Configure Order</h3>

      <div className="space-y-5 mb-6">
        {groups.map((group) =>
          group.control === 'RANGE' || group.control === 'FROM_TO' ? (
            <ScaleControl
              key={group.id}
              group={group}
              range={ranges.find((r) => r.groupId === group.id)}
              onChange={onRange}
            />
          ) : (
            <ConfigGroupControl
              key={group.id}
              group={group}
              selected={selected}
              onPick={onPick}
            />
          ),
        )}
      </div>

      {quote && quote.lines.length > 0 && (
        <div className="mb-4 space-y-1 text-xs">
          {quote.lines
            .filter((l) => parseFloat(l.amount) !== 0)
            .map((l) => (
              <div
                key={l.optionId ?? `g${l.groupId}`}
                className="flex justify-between text-slate-500"
              >
                <span className="truncate mr-2">{l.label}</span>
                <span className="shrink-0">${l.amount}</span>
              </div>
            ))}
        </div>
      )}

      <div className="border-t border-white/10 pt-6">
        {error && <p className="text-xs text-amber-400 mb-3">{error}</p>}

        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Total Price</span>
          <span className="text-3xl font-bold text-white flex items-center gap-2">
            {isQuoting && <Loader2 className="w-4 h-4 animate-spin text-slate-500" />}
            ${quote?.total ?? '—'}
          </span>
        </div>

        {delivery && (
          <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-5">
            <Clock className="w-3 h-3" /> Entrega estimada: {delivery}
          </p>
        )}

        <Button
          className="w-full"
          size="lg"
          onClick={onBuyNow}
          disabled={!quote || isQuoting || error !== null}
        >
          Buy Now
        </Button>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
          <ShieldCheck className="w-3 h-3" />
          Secure Payment &amp; Money-back Guarantee
        </div>
      </div>
    </GlassCard>
  )
}
