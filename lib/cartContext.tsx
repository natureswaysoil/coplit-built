// lib/cartContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  id: string
  title: string
  image: string
  sku: string
  size?: string
  price: number   // dollars (e.g., 29.99), NOT cents
  qty: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQty: (sku: string, qty: number) => void
  removeItem: (sku: string) => void
  clearCart: () => void
  subtotal: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Hydrate from localStorage on client
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('cart') : null
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem('cart', JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const i = prev.findIndex(x => x.sku === item.sku && x.size === item.size)
      if (i >= 0) {
        const copy = prev.slice()
        copy[i] = { ...copy[i], qty: copy[i].qty + item.qty }
        return copy
      }
      return [...prev, item]
    })
  }

  const updateQty = (sku: string, qty: number) => {
    setItems(prev =>
      prev.map(it => (it.sku === sku ? { ...it, qty: Math.max(1, Math.floor(qty || 1)) } : it))
    )
  }

  const removeItem = (sku: string) => setItems(prev => prev.filter(it => it.sku !== sku))
  const clearCart = () => setItems([])

  const subtotal = useMemo(
    () => Number(items.reduce((s, it) => s + it.price * it.qty, 0).toFixed(2)),
    [items]
  )

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

