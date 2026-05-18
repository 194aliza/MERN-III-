"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = { productId: number; qty: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (productId: number, qty: number) => void;
  removeFromCart: (productId: number) => void;
  setInitialCart: (items: CartItem[]) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (productId: number, qty: number) => {
    setCart(prev => {
      const exists = prev.find(i => i.productId === productId);
      if (exists) return prev.map(i => i.productId === productId ? {...i, qty: i.qty + qty} : i);
      return [...prev, { productId, qty }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const setInitialCart = (items: CartItem[]) => setCart(items);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, setInitialCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};