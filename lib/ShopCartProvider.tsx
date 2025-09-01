import React, { type ReactNode } from 'react'
import { CartProvider } from './cartContext'

export type ShopCartProviderProps = {
  children: ReactNode
}

// Thin wrapper around the existing CartProvider so imports of ShopCartProvider work.
export function ShopCartProvider({ children }: ShopCartProviderProps) {
  return <CartProvider>{children}</CartProvider>
}

export default ShopCartProvider
