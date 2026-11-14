"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  price_tier_1?: number;
  price_tier_2?: number;
  price_tier_3?: number;
  bulk_pricing?: {
    qty_1_to_9?: number;
    qty_10_to_49?: number;
    qty_50_plus?: number;
  };
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
  const basePrice = Number(item.bulk_pricing?.qty_1_to_9 ?? item.price_tier_1 ?? item.price ?? 0);

  const t1 = Number(
    item.bulk_pricing?.qty_1_to_9 ??
      (item.price_tier_1 !== undefined && item.price_tier_1 !== null ? item.price_tier_1 : basePrice)
  );
  const t2 = Number(
    item.bulk_pricing?.qty_10_to_49 ??
      (item.price_tier_2 !== undefined && item.price_tier_2 !== null
        ? item.price_tier_2
        : Math.round(t1 * 0.95 * 100) / 100)
  );
  const t3 = Number(
    item.bulk_pricing?.qty_50_plus ??
      (item.price_tier_3 !== undefined && item.price_tier_3 !== null
        ? item.price_tier_3
        : Math.round(t1 * 0.90 * 100) / 100)
  );

  if (qty >= 50) return t3;
  if (qty >= 10) return t2;
  return t1;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
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
    const dynamicPrice = Number(
      product?.bulk_pricing?.qty_1_to_9 ??
        (product?.price_tier_1 !== undefined && product?.price_tier_1 !== null
          ? product.price_tier_1
          : product?.price || 25.0)
    );
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "AddToCart", {
        content_name: product?.name || product?.title || "BITE Instruments Product",
        value: dynamicPrice,
        currency: "USD",
      });
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let nextCart: CartItem[];

      if (existing) {
        const newQty = existing.quantity + 1;
        nextCart = prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: newQty,
                price: getTieredPrice(item, newQty),
              }
            : item
        );
      } else {
        const initialQty = 1;
        const t1 = Number(
          product.bulk_pricing?.qty_1_to_9 ??
            (product.price_tier_1 !== undefined && product.price_tier_1 !== null
              ? product.price_tier_1
              : product.price || 25.0)
        );
        const t2 =
          product.bulk_pricing?.qty_10_to_49 !== undefined
            ? Number(product.bulk_pricing.qty_10_to_49)
            : product.price_tier_2 !== undefined && product.price_tier_2 !== null
            ? Number(product.price_tier_2)
            : undefined;
        const t3 =
          product.bulk_pricing?.qty_50_plus !== undefined
            ? Number(product.bulk_pricing.qty_50_plus)
            : product.price_tier_3 !== undefined && product.price_tier_3 !== null
            ? Number(product.price_tier_3)
            : undefined;

        const initialItem: CartItem = {
          id: product.id,
          name: product.name || product.title,
          price_tier_1: t1,
          price_tier_2: t2,
          price_tier_3: t3,
          bulk_pricing: product.bulk_pricing,
          price: t1, // Baseline starting price is tier 1
          image:
            (Array.isArray(product.images) && product.images[0]) ||
            product.image ||
            product.image_url ||
            '/assets/placeholder.png',
          quantity: initialQty,
        };

        // Calculate dynamic price based on initial qty
        initialItem.price = getTieredPrice(initialItem, initialQty);
        nextCart = [...prev, initialItem];
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('bite_instruments_cart', JSON.stringify(nextCart));
        } catch (e) {
          console.error('Failed to persist cart', e);
        }
      }

      return nextCart;
    });

    router.push('/checkout');
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
