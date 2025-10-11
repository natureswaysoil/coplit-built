'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  title: string;
  image?: string;
  sku?: string;
  size?: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Prefer not to use React.FC — keeps types simpler
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([
    { id: 'kelp-1g', title: 'Liquid Kelp 1 gal', image: '', sku: 'KELP-1G', size: '1g', price: 4999, qty: 1 },
    { id: 'neutralizer-1g', title: 'Dog Urine Neutralizer 1 gal', image: '', sku: 'NEUT-1G', size: '1g', price: 3999, qty: 1 },
  ]);

  const addItem = (item: CartItem) =>
    setItems(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + item.qty };
        return copy;
      }
      return [...prev, item];
    });

  const removeItem = (id: string) => setItems(prev => prev.filter(p => p.id !== id));
  const updateQty = (id: string, qty: number) => setItems(prev => prev.map(p => (p.id === id ? { ...p, qty } : p)));
  const clear = () => setItems([]);

  const total = useMemo(() => items.reduce((s, x) => s + x.price * x.qty, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({ items, addItem, removeItem, updateQty, clear, total }),
    [items, total]
  );

  // ✅ Return JSX so the function's return type is ReactNode
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}


