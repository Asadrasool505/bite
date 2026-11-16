"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "bite_factory_welcome_seen";

export default function FactoryWelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      if (!seen) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage access errors in restricted environments
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage write errors
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[95] bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white border border-amber-500/35 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />

        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
          aria-label="Close welcome popup"
        >
          &times;
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          🏭 DIRECT MANUFACTURER · EST. 2015
        </div>

        <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-slate-900 leading-tight mb-3">
          Direct Factory Made Since 2015 &amp; Custom Branding
        </h2>

        <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-5">
          Welcome to <strong>BITE Instruments</strong> — a direct Sialkot manufacturing factory crafting professional Japanese 440C pet grooming shears since 2015. Reach out to us for Custom Private Label Branding (laser logo engraving, custom colors &amp; packaging) and factory-direct wholesale pricing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-[11px] font-bold text-slate-800">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
            ✓ Direct Factory Since 2015
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
            ✓ Custom Logo &amp; Packaging (MOQ 10 Kits / 20 Pcs)
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
            ✓ Wholesale Tier Discounts (5% &amp; 10% Off)
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/custom-branding"
            onClick={handleClose}
            className="flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-wider text-xs text-slate-950 bg-amber-500 hover:bg-amber-600 text-center transition-all shadow-sm"
          >
            Custom Branding / Reach Out
          </Link>
          <Link
            href="/contact"
            onClick={handleClose}
            className="flex-1 py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs text-amber-700 border border-amber-500/50 hover:bg-amber-50 text-center transition-all"
          >
            Contact Factory
          </Link>
          <button
            type="button"
            onClick={handleClose}
            className="py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    </div>
  );
}

