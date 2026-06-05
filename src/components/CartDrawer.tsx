"use client";

import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { formatPrice } = useApp();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-45 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-slate-900 text-xl font-bold uppercase tracking-widest">
              Your Quote
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all cursor-pointer"
            aria-label="Close cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Items ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
              <svg className="w-16 h-16 text-slate-200" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/>
              </svg>
              <p className="text-slate-500 text-sm font-light">Your quote is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                {/* Product thumbnail */}
                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-slate-200 p-1.5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm font-semibold leading-snug truncate">{item.name}</p>
                  
                  {/* Qty selector */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-amber-500 hover:text-amber-600 transition-all text-sm font-bold cursor-pointer"
                    >
                      −
                    </button>
                    <span className="text-slate-950 text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-amber-500 hover:text-amber-600 transition-all text-sm font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <p className="text-amber-600 text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {cart.length > 0 && (
          <div className="flex-shrink-0 px-6 py-6 border-t border-slate-200 space-y-4 bg-slate-50">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-sm font-medium">Estimated Total</span>
              <span className="text-slate-900 text-lg font-extrabold">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-slate-500 text-xs text-center">Export quotes are finalized after shipping review</p>

            {/* Checkout button */}
            <Link 
              href="/checkout"
              onClick={onClose}
              className="w-full flex items-center justify-center py-4 rounded-xl font-black uppercase tracking-widest text-sm bg-amber-500 text-slate-950 hover:bg-amber-600 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center"
            >
              Finalize Quote
            </Link>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-slate-500 text-xs uppercase tracking-widest font-medium hover:text-slate-800 transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
