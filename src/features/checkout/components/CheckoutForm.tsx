import { useState } from 'react'
import { useElements, useStripe } from '@stripe/react-stripe-js'
import { toast } from 'sonner'
import { CharacterDetailsForm } from './CharacterDetailsForm'
import { StripePaymentForm } from './StripePaymentForm'
import { OrderSummary } from './OrderSummary'
import type { useCheckout } from '../hooks/useCheckout'

interface Props {
  checkout: ReturnType<typeof useCheckout>
}

/**
 * Vive dentro de <Elements>, que es donde useStripe/useElements tienen contexto.
 * Orquesta: validar el formulario de Stripe → crear órdenes e intención →
 * confirmar el cobro.
 */
export function CheckoutForm({ checkout }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const { paymentState, setPaymentState, preparePayment, completeSuccess } = checkout

  const handlePay = async () => {
    if (!stripe || !elements || paymentState !== 'idle') return

    setError(null)
    setPaymentState('processing')
    toast.loading('Processing your payment...', { id: 'payment' })

    // 1. Stripe valida sus propios campos antes de que creemos nada
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Please check your payment details.')
      setPaymentState('idle')
      toast.dismiss('payment')
      return
    }

    // 2. Órdenes + intención. Si esto falla es un fallo nuestro, no del pago.
    let clientSecret: string
    let orderIds: number[]
    try {
      const prepared = await preparePayment()
      clientSecret = prepared.clientSecret
      orderIds = prepared.orderIds
    } catch {
      setPaymentState('failed')
      toast.error('We could not create your order. Please try again.', { id: 'payment' })
      return
    }

    // 3. Confirmación. redirect 'if_required': la tarjeta suele resolverse sin salir.
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: `${window.location.origin}/account/orders` },
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Your payment could not be completed.')
      setPaymentState('idle')
      toast.dismiss('payment')
      return
    }

    // El webhook es quien mueve la orden a QUEUED; aquí sólo reflejamos el cobro.
    completeSuccess(orderIds)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <CharacterDetailsForm formData={checkout.formData} onUpdate={checkout.updateFormData} />
        <StripePaymentForm error={error} />
      </div>

      <div className="space-y-6">
        <OrderSummary paymentState={paymentState} onPay={handlePay} />
      </div>
    </div>
  )
}
