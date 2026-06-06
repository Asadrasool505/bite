import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet Grooming Kits | Wholesale Factory-Direct Bundles – Bite Instruments",
  description:
    "Order factory-direct complete grooming sets and professional pet salon kit packages wholesale from Bite Instruments, Sialkot. Ergonomic tools, bulk pricing, OEM branding available.",
};

const kits = [
  {
    id: "kit-starter",
    name: "Starter Grooming Kit",
    subtitle: "8-Tool Entry-Level Commercial Package",
    tools: [
      "5.5\" Straight Scissors",
      "5.0\" Blender/Thinner",
      "Stainless Steel Detangling Comb",
      "Slicker Brush",
      "Nail Clippers (Scissor Style)",
      "Ear Cleaning Forceps",
      "Hound Mitt",
      "Premium Roll Case",
    ],
    price: "From $89 / unit",
    minOrder: "MOQ: 50 sets",
    badge: "New Salons",
    badgeColor: "bg-emerald-500 text-white",
    accent: "border-emerald-400",
  },
  {
    id: "kit-professional",
    name: "Professional Grooming Kit",
    subtitle: "14-Tool Full-Service Salon Package",
    tools: [
      "6.5\" Curved Scissors",
      "5.5\" Straight Scissors",
      "5.0\" Blender/Thinner Scissors",
      "4.5\" Detail/Face Scissors",
      "Coarse + Fine Dual-Density Comb",
      "De-matting Rake",
      "Slicker Brush",
      "Rubber Curry Brush",
      "Nail Clippers (Guillotine)",
      "Ear Cleaning Forceps",
      "Stainless Scissors Sheath (×4)",
      "Scissor Tension Adjustment Key",
      "Silicone Finger Inserts (×4 pairs)",
      "Hardshell Branded Carry Case",
    ],
    price: "From $189 / unit",
    minOrder: "MOQ: 30 sets",
    badge: "Best Seller",
    badgeColor: "bg-amber-500 text-slate-900",
    accent: "border-amber-400",
  },
  {
    id: "kit-master",
    name: "Master Salon Kit",
    subtitle: "20+ Tool Flagship Configuration",
    tools: [
      "7.0\" Large Breed Straight Scissors",
      "6.5\" Curved Scissors",
      "6.0\" Straight Scissors",
      "5.5\" Straight Scissors",
      "5.0\" Blender",
      "4.5\" Detail/Face Scissors",
      "4.5\" Curved Detail Scissors",
      "Coarse + Fine + Medium Combs (set of 3)",
      "De-matting Rake",
      "Undercoat Rake",
      "Professional Slicker Brush",
      "Boar Bristle Finish Brush",
      "Nail Clippers + Nail File",
      "Ear Cleaning Forceps + Cotton Pads",
      "Scissor Tension Kit",
      "Silicone Finger Inserts (×7 pairs)",
      "Blade Sheath Set (×7)",
      "Grooming Apron",
      "Barbicide Tablet Set",
      "Premium Aluminum Grooming Trolley Case",
    ],
    price: "From $349 / unit",
    minOrder: "MOQ: 15 sets",
    badge: "Premium",
    badgeColor: "bg-slate-900 text-amber-400",
    accent: "border-slate-400",
  },
];

export default function PetGroomingKitsPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Page Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-black tracking-[0.4em] text-amber-600 uppercase mb-3">
            🎁 Factory-Direct Bundles
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-slate-900 font-black tracking-wide mb-6">
            Pet Grooming{" "}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Kits
            </span>
          </h1>
          <p className="text-slate-600 text-base font-light max-w-2xl mx-auto leading-relaxed">
            Complete, ergonomically curated grooming tool packages for commercial salons, distributors, and wholesale buyers. All kits sourced factory-direct from our Sialkot manufacturing facility with OEM branding available.
          </p>
        </div>

        {/* Kit Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {kits.map((kit) => (
            <div
              key={kit.id}
              className={`bg-white border-t-4 ${kit.accent} border-x border-b border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}
            >
              <div className="p-8 flex-1">
                {/* Badge */}
                <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${kit.badgeColor} mb-4`}>
                  {kit.badge}
                </span>

                {/* Name */}
                <h2 className="text-2xl font-serif font-black text-slate-900 mb-1">{kit.name}</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-6">{kit.subtitle}</p>

                {/* Tool List */}
                <ul className="space-y-2 mb-8">
                  {kit.tools.map((tool, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-light">
                      <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing Footer */}
              <div className="border-t border-slate-100 p-6 bg-slate-50">
                <p className="text-xl font-black text-slate-900 mb-1">{kit.price}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-4">{kit.minOrder}</p>
                <Link
                  href="/checkout"
                  className="block w-full text-center py-3.5 rounded-xl bg-amber-500 text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-amber-600 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* OEM Branding CTA */}
        <div className="bg-slate-900 rounded-3xl p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          <div>
            <p className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase mb-4">🔧 OEM / Private Label</p>
            <h3 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4 leading-tight">
              Brand Your Kits with Your Logo
            </h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              All Bite Instruments grooming kits support custom laser engraving, branded carry cases, and private label packaging. Minimum OEM order quantities start at 100 sets. Concept-to-delivery in 3–5 weeks.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl">🎨</span>
              <div>
                <p className="text-white text-sm font-bold">Custom Laser Engraving</p>
                <p className="text-slate-400 text-xs font-light">Your brand on every blade</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl">📦</span>
              <div>
                <p className="text-white text-sm font-bold">Branded Packaging</p>
                <p className="text-xs text-slate-400 font-light">Custom box design included</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="text-center py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 font-black uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all"
            >
              Discuss OEM Requirements
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
