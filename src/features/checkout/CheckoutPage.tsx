import { Elements } from '@stripe/react-stripe-js'
import type { StripeElementsOptions } from '@stripe/stripe-js'
import { Toaster } from 'sonner'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { ErrorState } from '../../components/ui/ErrorState'
import { stripePromise } from '../../lib/stripe'
import { useCheckout } from './hooks/useCheckout'
import { CheckoutForm } from './components/CheckoutForm'
import { OrderSummary } from './components/OrderSummary'
import { CheckoutSuccessView } from './views/CheckoutSuccessView'
import { CheckoutFailedView } from './views/CheckoutFailedView'
import { ProcessingOverlay } from './components/ProcessingOverlay'

/** Tema oscuro para que el Payment Element no desentone con el resto de la app */
const APPEARANCE: StripeElementsOptions['appearance'] = {
  theme: 'night',
  variables: {
    colorPrimary: '#3b82f6',
    colorBackground: '#1e293b',
    colorText: '#f8fafc',
    borderRadius: '8px',
  },
}

export function CheckoutPage() {
  const checkout = useCheckout()
  const { paymentState, items, amountMinorUnits } = checkout

  if (paymentState === 'success') {
    return (
      <>
        <Toaster theme="dark" position="top-right" richColors />
        <CheckoutSuccessView orderId={checkout.orderLabel} countdown={checkout.countdown} />
      </>
    )
  }

  if (paymentState === 'failed') {
    return (
      <>
        <Toaster theme="dark" position="top-right" richColors />
        <CheckoutFailedView onRetry={checkout.handleRetry} />
      </>
    )
  }

  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: amountMinorUnits,
    currency: 'usd',
    appearance: APPEARANCE,
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Toaster theme="dark" position="top-right" richColors />
      <ProcessingOverlay paymentState={paymentState} />
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

          {items.length === 0 ? (
            // OrderSummary ya resuelve el estado vacío; sin monto no se puede montar Elements
            <div className="max-w-md"><OrderSummary paymentState={paymentState} /></div>
          ) : !stripePromise ? (
            <ErrorState
              title="Payments unavailable"
              description="VITE_STRIPE_PUBLISHABLE_KEY is not configured."
            />
          ) : (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm checkout={checkout} />
            </Elements>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
