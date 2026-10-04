import type { ScalePointInput } from '../../../../../types/service-config.types'

/**
 * Generadores de escalas. Teclear 30 puntos a mano es inviable, y el error
 * típico —olvidar que el último salto vale 0— rompería el precio del tramo
 * completo, así que se impone aquí.
 */

export interface TierSpec {
  /** "Bronze": agrupa sus divisiones en una columna del selector */
  name: string
  /** Coste de cada salto dentro de esta liga */
  stepPrice: number
  stepMinutes?: number | null
  /** Cuántas divisiones (4 = IV, III, II, I). 1 = la liga va suelta */
  divisions: number
}

export const DEFAULT_TIERS: TierSpec[] = [
  { name: 'Iron', stepPrice: 6, stepMinutes: 180, divisions: 4 },
  { name: 'Bronze', stepPrice: 7, stepMinutes: 200, divisions: 4 },
  { name: 'Silver', stepPrice: 9, stepMinutes: 240, divisions: 4 },
  { name: 'Gold', stepPrice: 12, stepMinutes: 300, divisions: 4 },
  { name: 'Platinum', stepPrice: 17, stepMinutes: 420, divisions: 4 },
  { name: 'Emerald', stepPrice: 24, stepMinutes: 600, divisions: 4 },
  { name: 'Diamond', stepPrice: 38, stepMinutes: 900, divisions: 4 },
  { name: 'Master', stepPrice: 120, stepMinutes: 2880, divisions: 1 },
  { name: 'Grandmaster', stepPrice: 0, stepMinutes: null, divisions: 1 },
]

const ROMAN = ['IV', 'III', 'II', 'I']

/** Las divisiones van de la más baja a la más alta: IV → I */
function divisionLabel(tier: string, index: number, total: number): string {
  if (total === 1) return tier
  const roman = ROMAN[ROMAN.length - total + index] ?? String(total - index)
  return `${tier} ${roman}`
}

export function buildTierLadder(tiers: TierSpec[], iconBase = '/ranks'): ScalePointInput[] {
  const points: ScalePointInput[] = []
  let value = 0

  for (const tier of tiers) {
    for (let i = 0; i < tier.divisions; i++) {
      points.push({
        value: value++,
        label: divisionLabel(tier.name, i, tier.divisions),
        tier: tier.name,
        iconUrl: `${iconBase}/${tier.name.toLowerCase()}.svg`,
        stepPrice: tier.stepPrice,
        stepMinutes: tier.stepMinutes ?? null,
      })
    }
  }

  // El último punto no tiene salto después: cobrarlo inflaría el tramo completo
  if (points.length > 0) {
    const last = points[points.length - 1]
    last.stepPrice = 0
    last.stepMinutes = null
  }
  return points
}

/** Escala numérica (niveles) con tarifa por tramos */
export function buildNumericScale(
  from: number,
  to: number,
  brackets: { upTo: number; stepPrice: number; stepMinutes?: number | null }[],
): ScalePointInput[] {
  const points: ScalePointInput[] = []
  for (let v = from; v <= to; v++) {
    const bracket = brackets.find((b) => v < b.upTo) ?? brackets[brackets.length - 1]
    points.push({
      value: v,
      label: null,
      tier: null,
      iconUrl: null,
      stepPrice: v === to ? 0 : bracket.stepPrice,
      stepMinutes: v === to ? null : (bracket.stepMinutes ?? null),
    })
  }
  return points
}

/** Lo que costaría recorrer la escala entera, para enseñarlo antes de guardar */
export function fullSpanPrice(points: ScalePointInput[]): number {
  return Math.round(points.reduce((sum, p) => sum + p.stepPrice, 0) * 100) / 100
}
