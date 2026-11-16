"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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
  addToCart: (product: any, options?: { silent?: boolean }) => void;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const cartRef = useRef<CartItem[]>([]);
  const [addedPopupItem, setAddedPopupItem] = useState<CartItem | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('bite_instruments_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        cartRef.current = parsed;
        setCart(parsed);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    cartRef.current = cart;
    localStorage.setItem('bite_instruments_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, options?: { silent?: boolean }) => {
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

    const prev = cartRef.current;
    const existing = prev.find((item) => item.id === product.id);
    let targetItem: CartItem;
    let nextCart: CartItem[];

    if (existing) {
      const newQty = existing.quantity + 1;
      targetItem = {
        ...existing,
        quantity: newQty,
        price: getTieredPrice(existing, newQty),
      };
      nextCart = prev.map((item) => (item.id === product.id ? targetItem : item));
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

      targetItem = {
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
      targetItem.price = getTieredPrice(targetItem, initialQty);
      nextCart = [...prev, targetItem];
    }

    cartRef.current = nextCart;
    setCart(nextCart);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bite_instruments_cart', JSON.stringify(nextCart));
      } catch (e) {
        console.error('Failed to persist cart', e);
      }
    }

    if (!options?.silent) {
      setAddedPopupItem(targetItem);
    }
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
  const totalCartUnits = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}

      {/* Added to Quote / Cart Confirmation Popup Modal */}
      {addedPopupItem && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setAddedPopupItem(null)}
        >
          <div
            className="bg-white border border-amber-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setAddedPopupItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
              aria-label="Close confirmation popup"
            >
              &times;
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Added to Your Quote Cart!</h3>
                <p className="text-[11px] font-medium text-amber-600">
                  Direct Factory Made Since 2015 · Custom OEM Branding Available
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shrink-0">
                <img
                  src={addedPopupItem.image}
                  alt={addedPopupItem.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                  {addedPopupItem.name}
                </p>
                <div className="flex items-center justify-between gap-2 mt-1.5 text-xs">
                  <span className="text-slate-600 font-medium">Qty in Cart: {addedPopupItem.quantity}</span>
                  <span className="text-amber-600 font-extrabold">${addedPopupItem.price.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs bg-amber-50 border border-amber-200/70 rounded-xl px-4 py-3 mb-5">
              <span className="text-slate-700 font-semibold">Cart ({totalCartUnits} unit{totalCartUnits !== 1 ? 's' : ''})</span>
              <span className="text-slate-900 font-extrabold">Estimated Quote Total: ${cartTotal.toFixed(2)} USD</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAddedPopupItem(null)}
                className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs text-slate-700 border border-slate-300 hover:border-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
              <Link
                href="/checkout"
                onClick={() => setAddedPopupItem(null)}
                className="w-full py-3 rounded-xl font-black uppercase tracking-wider text-xs text-slate-950 bg-amber-500 hover:bg-amber-600 text-center transition-all shadow-sm"
              >
                View &amp; Confirm Order
              </Link>
            </div>
          </div>
        </div>
      )}
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
