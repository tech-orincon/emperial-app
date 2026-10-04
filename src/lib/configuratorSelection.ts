import type { ConfigGroup } from '../types/service-config.types'

/**
 * Espejo en cliente de `quote.engine.ts`. No calcula precios — eso es siempre
 * del servidor — sólo mantiene la selección en un estado que el backend acepte.
 */

function ownerMap(groups: ConfigGroup[]): Map<number, ConfigGroup> {
  const m = new Map<number, ConfigGroup>()
  groups.forEach((g) => g.options.forEach((o) => m.set(o.id, g)))
  return m
}

/** Grupos activos dada una selección; en cascada, con corte por si hay ciclo */
export function visibleGroups(groups: ConfigGroup[], selected: number[]): ConfigGroup[] {
  const live = new Set(selected)
  const owner = ownerMap(groups)
  const visible = new Set<number>()

  for (let pass = 0; pass <= groups.length; pass++) {
    let changed = false
    for (const g of groups) {
      if (visible.has(g.id)) continue
      const trigger = g.visibleWhenOptionId
      const ok =
        trigger === null ||
        (live.has(trigger) && visible.has(owner.get(trigger)?.id ?? -1))
      if (ok) {
        visible.add(g.id)
        changed = true
      }
    }
    if (!changed) break
  }
  return groups.filter((g) => visible.has(g.id))
}

/** Quita las opciones de grupos que ya no están activos */
export function pruneSelection(groups: ConfigGroup[], selected: number[]): number[] {
  const owner = ownerMap(groups)
  let current = selected
  for (let pass = 0; pass <= groups.length; pass++) {
    const live = new Set(current)
    const next = current.filter((id) => {
      const trigger = owner.get(id)?.visibleWhenOptionId
      return trigger == null || live.has(trigger)
    })
    if (next.length === current.length) return next
    current = next
  }
  return current
}

/**
 * Rellena los grupos obligatorios que acaban de hacerse visibles. Sin esto,
 * elegir el disparador de un grupo obligatorio deja la selección incompleta
 * y el backend la rechaza con "<grupo> is required".
 */
export function fillDefaults(groups: ConfigGroup[], selected: number[]): number[] {
  const picked = [...selected]
  for (let pass = 0; pass <= groups.length; pass++) {
    const before = picked.length
    for (const g of visibleGroups(groups, picked)) {
      if (g.control === 'SWITCH' || !g.isRequired) continue
      if (g.options.some((o) => picked.includes(o.id))) continue
      const def =
        g.options.find((o) => o.isDefault && o.isEnabled) ?? g.options.find((o) => o.isEnabled)
      if (def) picked.push(def.id)
    }
    if (picked.length === before) break
  }
  return picked
}

/** Aplica una elección y deja la selección en un estado válido */
export function applyPick(
  groups: ConfigGroup[],
  selected: number[],
  group: ConfigGroup,
  optionId: number,
): number[] {
  const groupIds = new Set(group.options.map((o) => o.id))
  const next =
    group.control === 'SWITCH'
      ? selected.includes(optionId)
        ? selected.filter((id) => id !== optionId)
        : [...selected, optionId]
      : [...selected.filter((id) => !groupIds.has(id)), optionId]

  return fillDefaults(groups, pruneSelection(groups, next))
}
