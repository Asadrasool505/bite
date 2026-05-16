"use client";

import { useEffect, useRef } from "react";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  /* Auto-focus input when opened */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  /* Escape key closes overlay */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const suggestions = [
    "Straight Precision Shear",
    "Curved Grooming Shear",
    "Titanium Chunker 7.5\"",
    "Thinning Blending Shear",
    "Swivel Thumb Detailer",
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-300 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{ background: "rgba(10,17,40,0.94)", backdropFilter: "blur(20px)" }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center rounded-full border border-white/15 text-gray-400 hover:text-white hover:border-white/40 transition-all duration-200 group"
        aria-label="Close search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <div className="w-full max-w-3xl px-6 flex flex-col gap-8">
        {/* Label */}
        <p className="text-[#D4AF37] text-xs font-black tracking-[0.5em] uppercase text-center">
          Search Collection
        </p>

        {/* Search input */}
        <div className="relative flex items-center gap-4">
          <svg
            className="w-7 h-7 text-yellow-500 flex-shrink-0"
            fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search masterpieces..."
            className="flex-1 bg-transparent border-b-2 border-yellow-500/60 text-white text-3xl md:text-5xl font-light outline-none placeholder-gray-600 pb-3 focus:border-yellow-400 transition-colors duration-300"
            style={{ caretColor: "#D4AF37" }}
          />
        </div>

        {/* Suggestions */}
        <div className="flex flex-col gap-0">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">Popular Searches</p>
          {suggestions.map((s, i) => (
            <button
              key={s}
              className="flex items-center gap-3 py-3.5 border-b border-white/5 text-left group hover:pl-2 transition-all duration-200"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <svg className="w-3.5 h-3.5 text-yellow-500/40 group-hover:text-yellow-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
              <span className="text-gray-400 group-hover:text-white text-base font-light transition-colors">{s}</span>
              <svg className="w-3.5 h-3.5 text-gray-700 group-hover:text-yellow-500 ml-auto transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
          ))}
        </div>

        <p className="text-gray-700 text-xs text-center font-light tracking-widest">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 text-[10px] font-mono">ESC</kbd> to close
        </p>
      </div>
    </div>
  );
}
