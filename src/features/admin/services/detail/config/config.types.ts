import type { ConfigControl, PriceKind } from '../../../../../types/service-config.types'

export const CONTROLS: { value: ConfigControl; label: string; hint: string }[] = [
  { value: 'BUTTONS', label: 'Botones', hint: 'Excluyente: exactamente una' },
  { value: 'DROPDOWN', label: 'Desplegable', hint: 'Excluyente: exactamente una' },
  { value: 'SWITCH', label: 'Interruptor', hint: 'Opcional: ninguna o una' },
]

export const PRICE_KINDS: { value: PriceKind; label: string; hint: string }[] = [
  { value: 'ABSOLUTE', label: 'Fija el precio', hint: 'Sustituye la base (ej. 114.99)' },
  { value: 'PERCENT', label: 'Porcentaje', hint: 'Puntos sobre la base (30 = +30%)' },
  { value: 'FIXED', label: 'Suma fija', hint: 'Se añade al final (ej. 10.00)' },
]

/** Cómo se lee el importe según el tipo, para no confundir 30 con $30 */
export function formatAmount(kind: PriceKind, amount: string): string {
  const n = parseFloat(amount)
  if (Number.isNaN(n)) return amount
  if (kind === 'PERCENT') return `${n > 0 ? '+' : ''}${n}%`
  if (kind === 'FIXED') return `${n >= 0 ? '+' : '−'}$${Math.abs(n).toFixed(2)}`
  return `$${n.toFixed(2)}`
}

export function formatDelivery(minutes: number | null): string | null {
  if (minutes === null) return null
  if (minutes < 60) return `${minutes} min`
  if (minutes < 1440) return `${Math.round((minutes / 60) * 10) / 10} h`
  return `${Math.round((minutes / 1440) * 10) / 10} días`
}
