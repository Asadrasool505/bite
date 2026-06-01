"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  price_tier_1?: number;
  price_tier_2?: number;
  price_tier_3?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to dynamically resolve unit price based on wholesale volume tiers
const getTieredPrice = (item: any, qty: number): number => {
  const basePrice = Number(item.price_tier_1 || item.price || 0);
  
  const t1 = item.price_tier_1 !== undefined && item.price_tier_1 !== null ? Number(item.price_tier_1) : basePrice;
  const t2 = item.price_tier_2 !== undefined && item.price_tier_2 !== null ? Number(item.price_tier_2) : t1 * 0.85;
  const t3 = item.price_tier_3 !== undefined && item.price_tier_3 !== null ? Number(item.price_tier_3) : t1 * 0.70;
  
  if (qty >= 31) return t3;
  if (qty >= 11) return t2;
  return t1;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('bite_instruments_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem('bite_instruments_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const newQty = existing.quantity + 1;
        return prev.map((item) =>
          item.id === product.id 
            ? { 
                ...item, 
                quantity: newQty,
                price: getTieredPrice(item, newQty)
              } 
            : item
        );
      }
      
      const initialQty = 1;
      const t1 = product.price_tier_1 !== undefined && product.price_tier_1 !== null ? Number(product.price_tier_1) : Number(product.price || 25.00);
      const t2 = product.price_tier_2 !== undefined && product.price_tier_2 !== null ? Number(product.price_tier_2) : undefined;
      const t3 = product.price_tier_3 !== undefined && product.price_tier_3 !== null ? Number(product.price_tier_3) : undefined;
      
      const initialItem = {
        id: product.id,
        name: product.name || product.title,
        price_tier_1: t1,
        price_tier_2: t2,
        price_tier_3: t3,
        price: t1, // Baseline starting price is tier 1
        image: (product.images && product.images[0]) || product.image || '/assets/placeholder.png',
        quantity: initialQty,
      };
      
      // Calculate dynamic price based on initial qty
      initialItem.price = getTieredPrice(initialItem, initialQty);
      
      return [...prev, initialItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => 
        item.id === id 
          ? { 
              ...item, 
              quantity,
              price: getTieredPrice(item, quantity)
            } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
