import { loadStripe, type Stripe } from '@stripe/stripe-js'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

/**
 * loadStripe se llama una sola vez por carga de página; devolver la misma
 * promesa evita recrear el objeto Stripe en cada render.
 * null si falta la key — la UI lo trata como error de configuración.
 */
export const stripePromise: Promise<Stripe | null> | null = publishableKey
  ? loadStripe(publishableKey)
  : null
