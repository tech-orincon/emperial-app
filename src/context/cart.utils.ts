/**
 * Identidad de una línea del carrito. No basta con serviceId: el mismo servicio
 * puede añadirse dos veces con configuraciones distintas, y una línea del
 * configurador no tiene packageId.
 */
export function buildLineKey(
  serviceId: number,
  packageId: number | null,
  selection: number[] = [],
  ranges: { groupId: number; from: number; to: number }[] = [],
): string {
  const sel = [...selection].sort((a, b) => a - b).join('.')
  // El tramo forma parte de la identidad: 36→90 y 1→90 son compras distintas
  const rng = [...ranges]
    .sort((a, b) => a.groupId - b.groupId)
    .map((r) => `${r.groupId}-${r.from}-${r.to}`)
    .join('.')
  return `${serviceId}:${packageId ?? 'cfg'}:${sel}:${rng}`
}
