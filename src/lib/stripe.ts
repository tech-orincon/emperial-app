import { loadStripe, type Stripe } from '@stripe/stripe-js'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

/**
 * loadStripe se llama una sola vez por carga de página; devolver la misma
 * promesa evita recrear el objeto Stripe en cada render.
 * null si falta la key — la UI lo trata como error de configuración.
 *
 * developerTools.assistant: apaga el widget flotante que Stripe.js inyecta en
 * sandbox. Sólo aparece con claves de test (nunca en live), pero se solapa con
 * nuestro botón de chat mientras desarrollamos.
 */
export const stripePromise: Promise<Stripe | null> | null = publishableKey
  ? loadStripe(publishableKey, {
      developerTools: { assistant: { enabled: false } },
    })
  : null
