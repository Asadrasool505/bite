"use client";

import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading, signOut } = useApp();
  const router = useRouter();
  const [quotes, setQuotes] = useState<any[]>([]);

  // Redirect if not loaded and no user
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Load B2B quotes history
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedQuotes = localStorage.getItem("b2b_quotes");
      if (savedQuotes) {
        try {
          setQuotes(JSON.parse(savedQuotes));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 tracking-widest uppercase text-xs">Authenticating B2B Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050814]">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Page Header */}
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-yellow-500 text-xs font-black uppercase tracking-[0.25em] block mb-2">B2B Distributor Portal</span>
            <h1 className="text-3xl md:text-5xl font-serif text-white tracking-wide">
              Welcome, {user.user_metadata?.full_name || "Valued Buyer"}
            </h1>
          </div>
          <button
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer w-fit"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Column 1: B2B Profile Card */}
          <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 bg-yellow-500 text-[#0A1128] text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
              Verified Partner
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center text-2xl font-bold text-[#0A1128]">
                {(user.user_metadata?.full_name || "U").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-white">
                  {user.user_metadata?.full_name || "B2B Representative"}
                </p>
                <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest">
                  {user.user_metadata?.company_name || "Wholesale Distributor"}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6 flex-grow">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Business Email</p>
                <p className="text-sm text-gray-200 mt-1 font-sans">{user.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">WhatsApp / Contact</p>
                <p className="text-sm text-gray-200 mt-1 font-sans">{user.user_metadata?.whatsapp || "Not provided"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Corporate Status</p>
                <p className="text-xs text-green-400 font-bold uppercase tracking-wider mt-1 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-lg w-fit">
                  Active B2B Importer
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                href="/[category]"
                as="/pet-shears-thinners"
                className="w-full py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs text-center text-[#0A1128] bg-yellow-500 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all block"
              >
                Browse Catalog
              </Link>
            </div>
          </div>

          {/* Column 2 & 3: B2B Quotes History */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-serif text-white tracking-wide mb-6">
              Wholesale Quote & Ordering History
            </h2>

            {quotes.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-sm text-gray-400 font-light mb-2">No wholesale quotes submitted yet.</p>
                <p className="text-xs text-gray-500">Items added to your quote cart will show up here once submitted.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {quotes.map((quote: any, idx: number) => (
                  <div key={idx} className="border border-white/10 bg-[#0A1128]/50 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 mb-4 gap-4">
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Quote ID</p>
                        <p className="text-sm font-sans font-bold text-white mt-0.5">{quote.id || `QT-${Math.floor(1000 + Math.random() * 9000)}`}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left sm:text-right">Date Requested</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(quote.date || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Requested Line Items</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-300">
                          <thead>
                            <tr className="border-b border-white/5 text-[9px] uppercase tracking-wider text-gray-500">
                              <th className="py-2">Item Name</th>
                              <th className="py-2 text-center">Qty</th>
                              <th className="py-2 text-right">Est. Unit Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quote.items?.map((item: any, iIdx: number) => (
                              <tr key={iIdx} className="border-b border-white/5 last:border-0">
                                <td className="py-2 max-w-[200px] truncate">{item.name || item.title}</td>
                                <td className="py-2 text-center font-bold text-yellow-400">{item.quantity}</td>
                                <td className="py-2 text-right">${(item.price || 25.00).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-white/5 pt-4 flex items-center justify-between">
                      <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                        Pending Factory Review
                      </span>
                      <p className="text-xs text-gray-400 font-light">
                        Email notification dispatched to BITE HQ.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
