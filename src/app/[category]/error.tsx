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
    <div className="min-h-[70vh] w-full bg-[#050814] flex flex-col items-center justify-center px-6">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 max-w-lg text-center flex flex-col items-center">
        <svg className="w-16 h-16 text-yellow-500/50 mb-6" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h2 className="text-2xl font-serif text-white tracking-widest mb-4">Connection Disrupted</h2>
        <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">
          We encountered an issue retrieving the catalog from our database. This is usually a temporary network error or an unconfigured database connection.
        </p>
        <button
          onClick={() => reset()}
          className="px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
