"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function HomeOEMTeaser() {
  const { t } = useApp();

  return (
    <section className="w-full py-24 bg-[#F4F5F7] relative overflow-hidden flex items-center justify-center">
      {/* Dynamic ambient spotlight background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-yellow-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Modern luxury split-row border container */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="relative rounded-3xl p-8 md:p-16 bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md group hover:border-amber-500/30 transition-all duration-700">

          {/* Inner animated decorative border */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] ease-out pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Massive Bold Typography */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8">
              <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 text-[10px] font-black uppercase tracking-[0.25em] shadow-inner animate-pulse">
                👑 OEM PREMIER SERVICES
              </span>

              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-serif text-slate-900 font-extrabold tracking-tight leading-none uppercase">
                  {t("oem_teaser_title")}
                </h2>
                <p className="text-lg md:text-xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 uppercase tracking-widest">
                  {t("oem_teaser_subtitle")}
                </p>
              </div>

              <p className="text-slate-600 text-sm md:text-base font-light leading-relaxed max-w-lg">
                Upload your company logo, choose premium finishes (matte black, rose gold, titanium), and visual-align your branding in real-time. Craft your custom private label grooming instruments today.
              </p>

              <div>
                <style>{`
                  @keyframes pulse-gold-glow {
                    0%   { box-shadow: 0 0 0 0 rgba(250,204,21,0.5); transform: scale(1); }
                    50%  { box-shadow: 0 0 20px 8px rgba(250,204,21,0.25); transform: scale(1.02); }
                    100% { box-shadow: 0 0 0 0 rgba(250,204,21,0); transform: scale(1); }
                  }
                  .btn-pulse-glow {
                    animation: pulse-gold-glow 2s infinite ease-in-out;
                  }
                `}</style>
                <Link
                  href="/custom-branding"
                  className="btn-pulse-glow inline-flex items-center justify-center px-10 py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-xs text-slate-950 bg-amber-500 hover:bg-amber-600 transition-all cursor-pointer transform hover:-translate-y-0.5 shadow-md"
                >
                  {t("oem_teaser_btn")}
                </Link>
              </div>
            </div>

            {/* Right Column: High-end Sleek Mockup Graphic */}
            <div className="lg:col-span-5 relative w-full aspect-square bg-slate-50 border border-slate-200 rounded-3xl flex items-center justify-center p-8 overflow-hidden group/graphic">
              {/* Inner radar scan lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-15 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent translate-y-0 group-hover/graphic:translate-y-[400px] transition-all duration-[3000ms] ease-in-out infinite" />

              {/* Dynamic Sleek Dark Scissor Mockup */}
              <img
                src="/assets/clean-shear.png"
                alt="Custom Branding Teaser Scissor"
                className="w-full h-full object-contain filter brightness-[0.25] contrast-[1.3] saturate-0 group-hover/graphic:scale-105 group-hover/graphic:brightness-[0.4] transition-all duration-700 pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] rotate-12"
              />

              {/* Simulated floating gold laser-engraving mark */}
              <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover/graphic:opacity-80 group-hover/graphic:scale-110 transition-all duration-700 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 text-[10px] font-black uppercase tracking-[0.4em] py-1 px-3 border border-yellow-500/30 rounded-md backdrop-blur-sm shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                YOUR LOGO
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}