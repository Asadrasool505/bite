"use client";

import { useApp } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface FavoritesDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function FavoritesDrawer({ open, onClose }: FavoritesDrawerProps) {
  const { favorites, toggleFavorite, t } = useApp();
  const { addToCart } = useCart();

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
        className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-[#0A1128] dark:bg-[#0A1128] light:bg-slate-50 border-l border-white/10 dark:border-white/10 light:border-slate-200 shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 dark:border-white/10 light:border-slate-200 flex-shrink-0">
          <div>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 text-xl font-extrabold uppercase tracking-widest">
              {t("favorites")}
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">{favorites.length} {t("items_count")}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 dark:border-white/10 light:border-slate-200 text-gray-400 hover:text-white dark:hover:text-white light:hover:text-slate-800 transition-all"
            aria-label="Close favorites"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Wishlist Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
              <svg className="w-16 h-16 text-white/10 dark:text-white/10 light:text-slate-200" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
              </svg>
              <p className="text-gray-500 text-sm font-light">{t("empty_wishlist")}</p>
            </div>
          ) : (
            favorites.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-sm">
                
                {/* Image */}
                <Link href={`/product/${item.id}`} onClick={onClose} className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#080f24] flex items-center justify-center border border-white/10">
                  <img
                    src={(item.images && item.images[0]) || item.image || "/assets/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-contain p-1.5"
                  />
                </Link>

                {/* Info & Action to Quote */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${item.id}`} onClick={onClose} className="text-white dark:text-white light:text-slate-800 text-sm font-semibold leading-snug truncate block hover:text-yellow-500 transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-yellow-400 text-xs font-bold mt-1">${(item.price || 0).toFixed(2)}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      addToCart(item);
                      // Proactively alert/close drawer or let user continue shopping
                    }}
                    className="w-fit text-left text-[10px] uppercase font-bold tracking-wider text-yellow-500 hover:text-yellow-400 mt-2 transition-colors"
                  >
                    {t("add_to_quote")} →
                  </button>
                </div>

                {/* Remove heart */}
                <div className="flex flex-col items-end justify-start flex-shrink-0">
                  <button
                    onClick={() => toggleFavorite(item)}
                    className="text-red-500 hover:text-red-400 transition-colors p-1"
                    aria-label="Remove from wishlist"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-6 border-t border-white/10 dark:border-white/10 light:border-slate-200 space-y-4 bg-[#050814]/80 dark:bg-[#050814]/80 light:bg-slate-100">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] text-center transition-all duration-200"
          >
            {t("continue_browsing")}
          </button>
        </div>
      </div>
    </>
  );
}
