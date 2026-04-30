import { ShieldCheck, ShoppingCart, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useCart } from '../../../context/CartContext'
import type { PaymentState } from '../hooks/useCheckout'

interface Props {
  paymentState: PaymentState
  onPay: () => void
}

export function OrderSummary({ paymentState, onPay }: Props) {
  const { items, removeItem } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <GlassCard className="p-6 sticky top-24 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto mb-3">
          <ShoppingCart className="w-6 h-6 text-slate-500" />
        </div>
        <p className="text-slate-400 font-medium mb-1">Your cart is empty</p>
        <p className="text-sm text-slate-600 mb-4">Add a service before checking out.</p>
        <Button variant="secondary" className="w-full" onClick={() => navigate('/catalog')}>
          Browse Services
        </Button>
      </GlassCard>
    )
  }

  const grandTotal = items.reduce((sum, i) => sum + i.totalPrice * i.quantity, 0)

  return (
    <GlassCard className="p-6 sticky top-24">
      <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={`${item.serviceId}-${item.packageId}`} className="pb-4 border-b border-white/10 last:border-0">
            <div className="flex items-start gap-3">
              {item.imageUrl
                ? <img src={item.imageUrl} alt={item.serviceTitle} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                : <div className="w-14 h-14 rounded-lg bg-slate-800 shrink-0" />
              }
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm leading-tight truncate">{item.serviceTitle}</h4>
                <p className="text-slate-400 text-xs mt-0.5">{item.packageName} Package</p>
              </div>
              <button
                onClick={() => removeItem(item.serviceId, item.packageId)}
                className="text-slate-600 hover:text-red-400 transition-colors shrink-0 ml-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">{item.packageName}</span>
                <span className="text-white">
                  {item.discountPct
                    ? <><span className="line-through text-slate-500 mr-1">${item.packagePrice}</span>${(parseFloat(item.packagePrice) * (1 - item.discountPct / 100)).toFixed(2)}</>
                    : `$${item.packagePrice}`
                  }
                </span>
              </div>
              {item.addonDetails.map((addon) => (
                <div key={addon.id} className="flex justify-between">
                  <span className="text-slate-400 truncate mr-2">+ {addon.name}</span>
                  <span className="text-white shrink-0">${addon.price}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium pt-1">
                <span className="text-slate-300">Subtotal</span>
                <span className="text-white">${(item.totalPrice * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-white/10 flex justify-between font-bold mb-6">
        <span className="text-white">Total</span>
        <span className="text-emperial-400 text-xl">${grandTotal.toFixed(2)}</span>
      </div>

      <Button className="w-full" size="lg" onClick={onPay} disabled={paymentState !== 'idle'}>
        {paymentState === 'idle' ? 'Pay Now' : 'Processing...'}
      </Button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-3 h-3" />
        100% Money-back Guarantee
      </div>
    </GlassCard>
  )
}
