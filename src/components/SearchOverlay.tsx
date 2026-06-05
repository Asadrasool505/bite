"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");

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

  const handleSearchSubmit = (searchVal: string) => {
    if (!searchVal.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(query);
    }
  };

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
      style={{ background: "rgba(248, 250, 252, 0.98)", backdropFilter: "blur(20px)" }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center rounded-full border border-slate-300 text-slate-900 hover:text-amber-600 hover:border-amber-500 transition-all duration-200 group cursor-pointer"
        aria-label="Close search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <div className="w-full max-w-3xl px-6 flex flex-col gap-8">
        {/* Label */}
        <p className="text-amber-600 text-xs font-black tracking-[0.5em] uppercase text-center">
          Search Collection
        </p>

        {/* Search input */}
        <div className="relative flex items-center gap-4">
          <svg
            className="w-7 h-7 text-amber-600 flex-shrink-0"
            fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search masterpieces..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-b-2 border-amber-500/60 text-slate-900 text-3xl md:text-5xl font-light outline-none placeholder-slate-400 pb-3 focus:border-amber-500 transition-colors duration-300"
            style={{ caretColor: "#D4AF37" }}
          />
        </div>

        {/* Suggestions */}
        <div className="flex flex-col gap-0">
          <p className="text-slate-900 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">Popular Searches</p>
          {suggestions.map((s, i) => (
            <button
              key={s}
              onClick={() => handleSearchSubmit(s)}
              className="flex items-center gap-3 py-3.5 border-b border-slate-200 text-left group hover:pl-2 transition-all duration-200 cursor-pointer"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <svg className="w-3.5 h-3.5 text-amber-600/40 group-hover:text-amber-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
              <span className="text-slate-900 group-hover:text-amber-600 text-base font-light transition-colors">{s}</span>
              <svg className="w-3.5 h-3.5 text-slate-900 group-hover:text-amber-600 ml-auto transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
          ))}
        </div>

        <p className="text-slate-900 text-xs text-center font-light tracking-widest">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-900 text-[10px] font-mono">ESC</kbd> to close
        </p>
      </div>
    </div>
  );
}