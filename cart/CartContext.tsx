// cart/CartContext.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

export type CartItem = {
  id: string;
  title: string;
  image: string;
  sku: string;
  size: string;
  price: number; // cents
  qty: number;
};

export type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  updateQty: (sku: string, qty: number) => void;
  clearCart: () => void;
};

// Use undefined (not null) so the hook can type-narrow safely
const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: PropsWithChildren<{}>): JSX.Element {
  const [items, setItems] = useState<CartItem[]>([
    { id: "kelp-1g", title: "Liquid Kelp 1 gal", image: "", sku: "KELP-1G", size: "1g", price: 4999, qty: 1 },
    { id: "neutralizer-1g", title: "Dog Urine Neutralizer 1 gal", image: "", sku: "NEUT-1G", size: "1g", price: 3999, qty: 1 },
  ]);

  const addItem = (item: CartItem) =>
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.sku === item.sku);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + item.qty };
        return copy;
      }
      return [...prev, item];
    });

  const removeItem = (sku: string) =>
    setItems((prev) => prev.filter((p) => p.sku !== sku));

  const updateQty = (sku: string, qty: number) =>
    setItems((prev) => {
      const copy = [...prev];
      const i = copy.findIndex((p) => p.sku === sku);
      if (i >= 0) copy[i] = { ...copy[i], qty: Math.max(0, qty) };
      return copy.filter((p) => p.qty > 0);
    });

  const clearCart = () => setItems([]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clearCart }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}


