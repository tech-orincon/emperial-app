import { PaymentElement } from '@stripe/react-stripe-js'
import { Lock, AlertCircle } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'

interface Props {
  error: string | null
}

/**
 * Los datos de tarjeta viven dentro del iframe de Stripe: nunca tocan el estado
 * de React ni viajan a nuestro backend.
 */
export function StripePaymentForm({ error }: Props) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-emperial-500/20 flex items-center justify-center text-emperial-400 font-bold">
          2
        </div>
        <h2 className="text-xl font-bold text-white">Payment Method</h2>
      </div>

      <div className="p-4 rounded-lg border border-emperial-500/30 bg-emperial-500/5 mb-6">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-emperial-500" />
          <span className="text-sm text-slate-300">
            Card details are handled directly by Stripe and never reach our servers.
          </span>
        </div>
      </div>

      <PaymentElement options={{ layout: 'tabs' }} />

      {error && (
        <div className="mt-4 flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </GlassCard>
  )
}
