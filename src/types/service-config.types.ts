// ─── Configurador de servicios ────────────────────────────────────────────────
//
// Espejo de service-config.{request,response}.dto.ts.
// Un servicio sin grupos se sigue vendiendo por paquetes: `groups` vacío.

export type ConfigControl = 'BUTTONS' | 'DROPDOWN' | 'SWITCH' | 'RANGE' | 'FROM_TO'

/** Punto de una escala; `stepPrice` es el coste de saltar al siguiente */
export interface ScalePoint {
  value: number
  /** null en RANGE, donde se muestra el número */
  label: string | null
  /** Columna del selector: "Bronze" agrupa Bronze IV..I */
  tier: string | null
  iconUrl: string | null
  stepPrice: string
  stepMinutes: number | null
}

/** Tramo elegido en un grupo RANGE o FROM_TO */
export interface RangeSelection {
  groupId: number
  from: number
  to: number
}
export type PriceKind = 'ABSOLUTE' | 'PERCENT' | 'FIXED'

export interface ConfigOption {
  id: number
  label: string
  badge: string | null
  priceKind: PriceKind
  /** ABSOLUTE y FIXED en dinero; PERCENT en puntos (30 = +30%) */
  priceAmount: string
  deliveryMinutes: number | null
  isDefault: boolean
  isEnabled: boolean
  displayOrder: number
}

export interface ConfigGroup {
  id: number
  label: string
  control: ConfigControl
  isRequired: boolean
  displayOrder: number
  /** null = siempre visible */
  visibleWhenOptionId: number | null
  /** Sólo RANGE y FROM_TO: cómo se nombra la unidad */
  scaleUnit: string | null
  options: ConfigOption[]
  /** Vacío salvo en RANGE y FROM_TO */
  scalePoints: ScalePoint[]
}

export interface QuoteLine {
  /** null en las líneas que vienen de una escala */
  optionId: number | null
  groupId?: number
  groupLabel: string
  label: string
  kind: PriceKind
  /** El valor de la regla tal cual: 30 para +30% */
  ruleAmount: string
  /** Lo que aporta al total. Un ABSOLUTE sustituido aporta 0. */
  amount: string
}

export interface Quote {
  basePrice: string
  lines: QuoteLine[]
  subtotal: string
  total: string
  deliveryMinutes: number | null
  visibleGroupIds: number[]
}

export interface ServiceConfig {
  serviceId: number
  basePrice: string
  groups: ConfigGroup[]
  defaultSelection: number[]
  /** Tramo inicial de cada grupo de escala: el completo */
  defaultRanges: RangeSelection[]
  defaultQuote: Quote
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateConfigGroupPayload {
  label: string
  control: ConfigControl
  scaleUnit?: string | null
  isRequired?: boolean
  displayOrder?: number
  visibleWhenOptionId?: number | null
}

export type UpdateConfigGroupPayload = Partial<CreateConfigGroupPayload>

export interface ScalePointInput {
  value: number
  label?: string | null
  tier?: string | null
  iconUrl?: string | null
  /** Coste de saltar al siguiente punto; el último vale 0 */
  stepPrice: number
  stepMinutes?: number | null
}

export interface ConfigOptionInput {
  label: string
  badge?: string | null
  priceKind: PriceKind
  priceAmount: number
  deliveryMinutes?: number | null
  isDefault?: boolean
  isEnabled?: boolean
  displayOrder?: number
}
