// cart-context.tsx
import React, { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  title: string;
  image?: string;
  sku?: string;
  size?: string;
  price: number; // cents or dollars, just be consistent
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number; // sum of price*qty
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([
    { id: "kelp-1g", title: "Liquid Kelp 1 gal", image: "", sku: "KELP-1G", size: "1g", price: 4999, qty: 1 },
    { id: "neutralizer-1g", title: "Dog Urine Neutralizer 1 gal", image: "", sku: "NEUT-1G", size: "1g", price: 3999, qty: 1 },
  ]);

  const addItem = (item: CartItem) =>
    setItems(prev => {
      const idx = prev.findIndex(x => x.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + item.qty };
        return copy;
      }
      return [...prev, item];
    });

  const removeItem = (id: string) =>
    setItems(prev => prev.filter(x => x.id !== id));

  const updateQty = (id: string, qty: number) =>
    setItems(prev => prev.map(x => (x.id === id ? { ...x, qty } : x)));

  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, x) => sum + x.price * x.qty, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({ items, addItem, removeItem, updateQty, clear, total }),
    [items, total]
  );

  // ✅ RETURN THE PROVIDER!
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Convenience hook
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ...same state & value as above
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

