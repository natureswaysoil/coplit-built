import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  title: string;
  image: string;
  sku: string;
  size: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  updateQty: (sku: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.sku === item.sku);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + item.qty };
        return copy;
      }
      return [...prev, item];
    });
  };

  const removeItem = (sku: string) => {
    setItems(prev => prev.filter(i => i.sku !== sku));
  };

  const updateQty = (sku: string, qty: number) => {
    setItems(prev => prev.map(i => (i.sku === sku ? { ...i, qty } : i)));
  };

  const clearCart = () => setItems([]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clearCart }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
