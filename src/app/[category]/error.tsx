"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Database connection error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full bg-[#F4F5F7] flex flex-col items-center justify-center px-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-lg text-center flex flex-col items-center shadow-sm">
        <svg className="w-16 h-16 text-amber-500 mb-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h2 className="text-2xl font-serif text-slate-900 font-bold tracking-widest mb-4">Connection Disrupted</h2>
        <p className="text-slate-900 text-sm font-light leading-relaxed mb-8">
          We encountered an issue retrieving the catalog from our database. This is usually a temporary network error or an unconfigured database connection.
        </p>
        <button
          onClick={() => reset()}
          className="px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] text-slate-950 bg-amber-500 hover:bg-amber-600 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
