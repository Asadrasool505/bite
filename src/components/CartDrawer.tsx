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
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-[#0A1128] border-l border-white/10 shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 text-xl font-extrabold uppercase tracking-widest">
              Your Quote
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all"
            aria-label="Close cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Items ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
              <svg className="w-16 h-16 text-white/10" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/>
              </svg>
              <p className="text-gray-500 text-sm font-light">Your quote is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                {/* Product thumbnail */}
                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#080f24] flex items-center justify-center border border-white/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1.5" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold leading-snug truncate">{item.name}</p>
                  
                  {/* Qty selector */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-gray-300 hover:border-yellow-500 hover:text-yellow-400 transition-all text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="text-white text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-gray-300 hover:border-yellow-500 hover:text-yellow-400 transition-all text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <p className="text-yellow-400 text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
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
          <div className="flex-shrink-0 px-6 py-6 border-t border-white/10 space-y-4" style={{ background: "rgba(5,8,20,0.8)" }}>
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm font-medium">Estimated Total</span>
              <span className="text-white text-lg font-extrabold">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-gray-600 text-xs text-center">Export quotes are finalized after shipping review</p>

            {/* Checkout button */}
            <Link 
              href="/checkout"
              onClick={onClose}
              className="w-full flex items-center justify-center py-4 rounded-xl font-black uppercase tracking-widest text-sm text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Finalize Quote
            </Link>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-gray-500 text-xs uppercase tracking-widest font-medium hover:text-gray-300 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
