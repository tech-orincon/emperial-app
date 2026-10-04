import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'
import { buildLineKey } from '../../../context/cart.utils'
import type { ServiceDetail } from '../../../types/catalog.types'
import type { Quote, RangeSelection } from '../../../types/service-config.types'

/**
 * Las dos vías de compra de un servicio. El precio que se guarda aquí es sólo
 * para pintar el carrito: el que se cobra lo recalcula el backend al crear la
 * orden, desde el packageId o desde la selección.
 */
export function useAddToCart(service: ServiceDetail | null | undefined) {
  const { addItem } = useCart()
  const navigate = useNavigate()

  const buyPackage = (packageId: number | null, addonIds: number[]) => {
    if (!service) return
    const pkg = service.packages.find((p) => p.id === packageId) ?? service.packages[0]
    if (!pkg) return

    const discountMultiplier = service.activeOffer?.discountPct
      ? 1 - service.activeOffer.discountPct / 100
      : 1
    const addonsTotal = addonIds.reduce((sum, addonId) => {
      const addon = service.addons.find((a) => a.id === addonId)
      return sum + (addon ? parseFloat(addon.price) * discountMultiplier : 0)
    }, 0)

    addItem({
      lineKey: buildLineKey(service.id, pkg.id),
      serviceId: service.id,
      serviceTitle: service.title,
      imageUrl: service.imageUrl,
      packageId: pkg.id,
      packageName: pkg.name,
      packagePrice: pkg.price,
      addonIds,
      addonDetails: addonIds.flatMap((addonId) => {
        const a = service.addons.find((x) => x.id === addonId)
        return a ? [{ id: a.id, name: a.name, price: a.price }] : []
      }),
      discountPct: service.activeOffer?.discountPct ?? null,
      totalPrice: parseFloat(pkg.price) * discountMultiplier + addonsTotal,
      quantity: 1,
    })
    navigate('/checkout')
  }

  const buyConfigured = (
    selection: number[],
    ranges: RangeSelection[],
    quote: Quote | null,
  ) => {
    if (!service || !quote) return
    addItem({
      lineKey: buildLineKey(service.id, null, selection, ranges),
      serviceId: service.id,
      serviceTitle: service.title,
      imageUrl: service.imageUrl,
      packageId: null,
      packageName: quote.lines.map((l) => l.label).join(' · ') || 'Configuración',
      packagePrice: quote.total,
      addonIds: [],
      addonDetails: [],
      selection,
      ranges,
      configLines: quote.lines
        .filter((l) => parseFloat(l.amount) !== 0)
        .map((l) => ({ label: l.label, amount: l.amount })),
      discountPct: service.activeOffer?.discountPct ?? null,
      totalPrice: parseFloat(quote.total),
      quantity: 1,
    })
    navigate('/checkout')
  }

  return { buyPackage, buyConfigured }
}
