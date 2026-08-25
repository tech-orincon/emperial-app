import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCart } from '../../../context/CartContext'
import { createOrder } from '../../../services/orders.service'
import { createPaymentIntent } from '../../../services/payments.service'

export type PaymentState = 'idle' | 'processing' | 'success' | 'failed'

export interface CheckoutFormData {
  characterName: string
  realm: string
  region: string
  faction: string
  notes: string
}

const INITIAL_FORM: CheckoutFormData = {
  characterName: '',
  realm: '',
  region: 'North America (US)',
  faction: '',
  notes: '',
}

export function useCheckout() {
  const navigate = useNavigate()
  const { items, clearCart } = useCart()
  const [paymentState, setPaymentState] = useState<PaymentState>('idle')
  const [countdown, setCountdown] = useState(10)
  const [orderLabel, setOrderLabel] = useState('')
  const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM)

  /** Stripe Elements trabaja en unidad mínima: USD → centavos */
  const amountMinorUnits = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + Math.round(i.totalPrice * i.quantity * 100),
        0,
      ),
    [items],
  )

  useEffect(() => {
    if (paymentState !== 'success') return
    if (countdown === 0) {
      navigate('/account/orders')
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [paymentState, countdown, navigate])

  /**
   * Crea una orden por ítem del carrito y una única intención de pago que las
   * cubre todas. Se llama al confirmar, no al montar: así abandonar el checkout
   * no deja órdenes PENDING colgadas en el historial del usuario.
   */
  const preparePayment = async (): Promise<{ clientSecret: string; orderIds: number[] }> => {
    const orders = await Promise.all(
      items.map((item) =>
        createOrder({
          serviceId: item.serviceId,
          packageId: item.packageId,
          addonIds: item.addonIds,
        }),
      ),
    )
    const orderIds = orders.map((o) => o.id)
    const intent = await createPaymentIntent({ orderIds })
    return { clientSecret: intent.clientSecret, orderIds }
  }

  const completeSuccess = (orderIds: number[]) => {
    clearCart()
    setOrderLabel(orderIds.map((id) => `#${id}`).join(', '))
    setPaymentState('success')
    toast.success('Payment confirmed!', { id: 'payment' })
  }

  const handleRetry = () => {
    setPaymentState('idle')
    setCountdown(10)
    toast.dismiss()
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return {
    items,
    amountMinorUnits,
    paymentState,
    setPaymentState,
    countdown,
    orderLabel,
    formData,
    updateFormData,
    preparePayment,
    completeSuccess,
    handleRetry,
  }
}
