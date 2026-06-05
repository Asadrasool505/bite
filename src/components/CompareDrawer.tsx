"use client";

import { useApp } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";

interface CompareDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CompareDrawer({ open, onClose }: CompareDrawerProps) {
  const { compareList, removeFromCompare, clearCompare, t } = useApp();
  const { addToCart } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-[#F4F5F7]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white/95 dark:bg-white/95 light:bg-white border border-yellow-500/20 rounded-3xl p-6 md:p-8 max-w-6xl w-full h-[90vh] md:h-auto max-h-[90vh] shadow-2xl relative flex flex-col animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-yellow-500 transition-colors"
          aria-label="Close comparison"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6 flex-shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 font-extrabold uppercase tracking-widest">
              {t("compare")} Instruments
            </h2>
            <p className="text-gray-400 text-xs mt-1">Compare technical specifications side-by-side</p>
          </div>
          {compareList.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors border border-red-500/20 px-4 py-2 rounded-full hover:bg-red-500/5"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Comparison Table / Matrix */}
        <div className="flex-1 overflow-x-auto overflow-y-auto pb-4">
          {compareList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center py-20">
              <svg className="w-16 h-16 text-white/10 dark:text-white/10 light:text-slate-200" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"/>
              </svg>
              <p className="text-gray-500 text-sm font-light">No instruments selected for comparison. Add instruments from their cards or description pages.</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-200 light:border-slate-200">
                  <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500 w-[180px]">Specifications</th>
                  {compareList.map((item) => (
                    <th key={item.id} className="py-4 px-4 w-[220px]">
                      <div className="flex flex-col items-center text-center gap-3 relative group">
                        
                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute -top-1 -right-1 p-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 hover:text-red-200 transition-colors shadow-lg"
                          aria-label="Remove item"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-200">
                          <img
                            src={(item.images && item.images[0]) || item.image || "/assets/placeholder.png"}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-sm font-bold text-white dark:text-white light:text-slate-800 line-clamp-1 block">{item.name}</span>
                        <span className="text-yellow-400 text-xs font-bold">${(item.price || 0).toFixed(2)}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 dark:divide-white/5 light:divide-slate-100 text-xs md:text-sm font-light text-gray-300 dark:text-gray-300 light:text-slate-600">
                
                {/* Category */}
                <tr>
                  <td className="py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500">Category</td>
                  {compareList.map((item) => (
                    <td key={item.id} className="py-4 px-4 font-semibold text-gray-200 dark:text-gray-200 light:text-slate-800 capitalize">
                      {item.category?.replace(/-/g, " ") || "Grooming Shears"}
                    </td>
                  ))}
                </tr>

                {/* Material */}
                <tr>
                  <td className="py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500">Steel Material</td>
                  {compareList.map((item) => (
                    <td key={item.id} className="py-4 px-4">
                      {item.technical_specifications?.material || "Premium Japanese SUS440C Alloy"}
                    </td>
                  ))}
                </tr>

                {/* Handle Type */}
                <tr>
                  <td className="py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500">Handle Design</td>
                  {compareList.map((item) => (
                    <td key={item.id} className="py-4 px-4">
                      {item.technical_specifications?.handle || "Ergonomic Offset / Sculpted"}
                    </td>
                  ))}
                </tr>

                {/* Edge Type */}
                <tr>
                  <td className="py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500">Blade Edge</td>
                  {compareList.map((item) => (
                    <td key={item.id} className="py-4 px-4">
                      {item.technical_specifications?.edge || "Semi-Convex Honed"}
                    </td>
                  ))}
                </tr>

                {/* Sizes */}
                <tr>
                  <td className="py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500">Available Sizes</td>
                  {compareList.map((item) => (
                    <td key={item.id} className="py-4 px-4">
                      {item.technical_specifications?.sizes?.join(', ') || '6.5", 7.0", 7.5"'}
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr className="border-t border-slate-200">
                  <td className="py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500">Quick Actions</td>
                  {compareList.map((item) => (
                    <td key={item.id} className="py-4 px-4">
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full text-center py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all"
                      >
                        {t("add_to_quote")}
                      </button>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}