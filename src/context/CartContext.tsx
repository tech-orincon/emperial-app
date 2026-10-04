import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export interface CartItem {
  /**
   * Identidad de la línea. No basta con serviceId: el mismo servicio puede ir
   * dos veces con configuraciones distintas, y con configurador no hay packageId.
   */
  lineKey: string
  serviceId: number
  serviceTitle: string
  imageUrl?: string | null
  /** null cuando la línea viene del configurador */
  packageId: number | null
  packageName: string
  packagePrice: string
  addonIds: number[]
  addonDetails: { id: number; name: string; price: string }[]
  /** Opciones del configurador; vacío si se compró por paquete */
  selection?: number[]
  /** Tramos de los grupos de escala */
  ranges?: { groupId: number; from: number; to: number }[]
  configLines?: { label: string; amount: string }[]
  discountPct?: number | null
  totalPrice: number
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (lineKey: string) => void
  updateQuantity: (lineKey: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'cart'

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    // Los carritos guardados antes de lineKey no se pueden identificar: se
    // descartan en vez de dejar líneas que no se puedan borrar.
    return (JSON.parse(raw) as CartItem[]).filter((i) => typeof i.lineKey === 'string')
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.lineKey === item.lineKey)
      if (idx !== -1) {
        const next = [...prev]
        next[idx] = item
        return next
      }
      return [...prev, item]
    })
  }

  const removeItem = (lineKey: string) => {
    setItems((prev) => prev.filter((i) => i.lineKey !== lineKey))
  }

  const updateQuantity = (lineKey: string, quantity: number) => {
    if (quantity <= 0) { removeItem(lineKey); return }
    setItems((prev) => prev.map((i) => (i.lineKey === lineKey ? { ...i, quantity } : i)))
  }

  const clearCart = () => setItems([])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
