import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export interface CartItem {
  serviceId: number
  serviceTitle: string
  imageUrl?: string | null
  packageId: number
  packageName: string
  packagePrice: string
  addonIds: number[]
  addonDetails: { id: number; name: string; price: string }[]
  discountPct?: number | null
  totalPrice: number
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (serviceId: number, packageId: number) => void
  updateQuantity: (serviceId: number, packageId: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'cart'

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
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
      const idx = prev.findIndex((i) => i.serviceId === item.serviceId && i.packageId === item.packageId)
      if (idx !== -1) {
        const next = [...prev]
        next[idx] = item
        return next
      }
      return [...prev, item]
    })
  }

  const removeItem = (serviceId: number, packageId: number) => {
    setItems((prev) => prev.filter((i) => !(i.serviceId === serviceId && i.packageId === packageId)))
  }

  const updateQuantity = (serviceId: number, packageId: number, quantity: number) => {
    if (quantity <= 0) { removeItem(serviceId, packageId); return }
    setItems((prev) =>
      prev.map((i) => (i.serviceId === serviceId && i.packageId === packageId ? { ...i, quantity } : i))
    )
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
