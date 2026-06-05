"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const slides = [
  {
    title: "Convex Razor Edge Technology",
    subtitle: "Precision-sculpted razor blades",
    badge: "Edge Geometry",
    image: "/assets/imperial-rose-convex.png",
    features: ["Tolerance of ±0.005mm", "Clean effortless sweeps", "Frictionless slicing action"],
    tagline: "01. EDGE GEOMETRY",
    description: "Precision-sculpted convex blades ground to a tolerance of ±0.005mm for a clean, effortless slicing action."
  },
  {
    title: "Precision Pivot System",
    subtitle: "Tension click-dial integration",
    badge: "Pivot Assembly",
    image: "/assets/precision-apex-curved.png",
    features: ["Ball-bearing tension click-plate", "Zero play blade calibration", "Smooth contact sweep"],
    tagline: "02. PIVOT ASSEMBLY",
    description: "Ball-bearing tension click-plate dial assembly ensures click-by-click calibration and eliminates blade play."
  },
  {
    title: "Symmetric Offset Ergonomics",
    subtitle: "Anatomical offset finger loops",
    badge: "Ergonomics",
    image: "/assets/straight-rose-gold-ergo.png",
    features: ["Wrist strain reduced 60%", "Natural thumb alignment", "Lower muscle load pressure"],
    tagline: "03. ERGONOMICS",
    description: "Sculpted offset rings align with natural hand structure to lower thumb fatigue and pressure by 60%."
  },
  {
    title: "Cryo-Tempered Japanese Steel",
    subtitle: "Ice-tempered J2 alloy core",
    badge: "Material Metallurgy",
    image: "/assets/straight-elite-j2.png",
    features: ["Rockwell hardness HRC 60±2", "Exceptional edge retention", "Corrosion resistance coating"],
    tagline: "04. MATERIAL METALLURGY",
    description: "Premium J2 stainless steel subjected to deep sub-zero tempering for a Rockwell hardness rating of HRC 60±2."
  },
];

const POINTERS = [
  {
    label: "Micron Precision Edge",
    sub: "Razor-honed cutting surface",
    dotTop: "16%",
    dotLeft: "50%",
  },
  {
    label: "Precision J2 Steel + Gold Dial",
    sub: "Adjustable tension pivot",
    dotTop: "50%",
    dotLeft: "50%",
  },
  {
    label: "Ergonomic Offset Handles",
    sub: "Reduces wrist fatigue 60%",
    dotTop: "74%",
    dotLeft: "50%",
  },
];

export default function ExplodedView3D() {
  const [active, setActive] = useState(0);
  const [animState, setAnimState] = useState<"idle" | "exit" | "enter">("idle");
  const nextIdx = useRef(0);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === active || animState !== "idle") return;
      nextIdx.current = idx;
      setAnimState("exit");
      setTimeout(() => {
        setActive(idx);
        setAnimState("enter");
        setTimeout(() => setAnimState("idle"), 500);
      }, 350);
    },
    [active, animState]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((active + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [active, goTo]);

  const slide = slides[active];

  return (
    <section className="relative w-full overflow-hidden py-24 bg-[#F8FAFC] border-b border-slate-200">
      <style>{`
        @keyframes float-shear {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        .shear-float { animation: float-shear 4.5s ease-in-out infinite; }

        @keyframes ripple-gold {
          0%   { box-shadow: 0 0 0 0 rgba(245,158,11,0.7); }
          70%  { box-shadow: 0 0 0 8px rgba(245,158,11,0); }
          100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
        }
        .gold-ripple { animation: ripple-gold 2s ease-out infinite; }

        @keyframes slide-exit {
          0%   { opacity: 1;   transform: scale(1)    translateY(0px); }
          100% { opacity: 0;   transform: scale(0.92) translateY(-20px); }
        }
        @keyframes slide-enter {
          0%   { opacity: 0;   transform: scale(0.92) translateY(30px); }
          65%  { opacity: 1;   transform: scale(1.02) translateY(-4px); }
          100% { opacity: 1;   transform: scale(1)    translateY(0px); }
        }
        .anim-exit  { animation: slide-exit  0.35s cubic-bezier(0.4,0,1,1)    forwards; }
        .anim-enter { animation: slide-enter 0.5s  cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

      {/* Blueprint Watermark — decorative faint background text, sits behind all content at z-0 */}
      <div className="blueprint-watermark">
        <p>Blueprint</p>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-amber-600 text-xs font-bold tracking-[0.5em] uppercase mb-3">
            Masterpiece Engineering
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-yellow-600 font-extrabold uppercase tracking-wider">
            Anatomy of Perfection
          </h2>
        </div>

        {/* Responsive Grid Parent */}
        <div className="flex flex-col items-center justify-center md:grid md:grid-cols-3 gap-12 items-stretch relative z-10">

          {/* Left Column: Mechanical Blueprint Callouts */}
          <div className="flex flex-col justify-center gap-8 order-2 md:order-1">

            {/* Card 1: Convex Razor Edge Technology */}
            <div
              onClick={() => goTo(0)}
              className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-left relative overflow-hidden flex flex-col gap-4 group cursor-pointer ${active === 0 ? "border-amber-500 ring-1 ring-amber-500" : "border-slate-200"
                }`}
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
              <div className="w-full h-32 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 p-2">
                <img
                  src={slides[0].image}
                  alt={slides[0].title}
                  className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="text-[9px] font-black tracking-widest text-amber-600 uppercase mb-1 block">{slides[0].tagline}</span>
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">{slides[0].title}</h4>
                <p className="text-xs text-slate-600 font-light leading-relaxed mt-1.5">
                  {slides[0].description}
                </p>
              </div>
            </div>

            {/* Card 2: Precision Pivot System */}
            <div
              onClick={() => goTo(1)}
              className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-left relative overflow-hidden flex flex-col gap-4 group cursor-pointer ${active === 1 ? "border-amber-500 ring-1 ring-amber-500" : "border-slate-200"
                }`}
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-400" />
              <div className="w-full h-32 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 p-2">
                <img
                  src={slides[1].image}
                  alt={slides[1].title}
                  className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase mb-1 block">{slides[1].tagline}</span>
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">{slides[1].title}</h4>
                <p className="text-xs text-slate-600 font-light leading-relaxed mt-1.5">
                  {slides[1].description}
                </p>
              </div>
            </div>

          </div>

          {/* Center Column: Interactive Graphic */}
          <div className="flex flex-col items-center justify-center order-1 md:order-2">
            <div className={`flex flex-col items-center gap-6 ${animState === "exit" ? "anim-exit" : animState === "enter" ? "anim-enter" : ""
              }`}>

              {/* Floating Tool Image with dots */}
              <div className="shear-float relative w-full max-w-[260px] md:max-w-[280px]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  key={slide.image}
                  className="w-full object-contain block drop-shadow-xl"
                  style={{ maxHeight: 420 }}
                />

                {/* Pulsing Dots */}
                {POINTERS.map((p) => (
                  <div
                    key={p.label}
                    className="absolute"
                    style={{ top: p.dotTop, left: p.dotLeft, transform: "translate(-50%, -50%)" }}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500 gold-ripple cursor-pointer relative z-15" />
                  </div>
                ))}
              </div>

              {/* Active Slide Specs details */}
              <div className="text-center max-w-xs px-4 mt-2">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase bg-amber-500 text-slate-950 mb-2">
                  {slide.badge}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mb-1 uppercase tracking-wide leading-tight">{slide.title}</h3>

                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-500 font-light">
                  {slide.features.map((f, i) => (
                    <span key={f} className="flex items-center gap-1">
                      {i > 0 && <span className="text-amber-500 font-bold">•</span>}
                      <span>{f}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Pagination indicators */}
              <div className="flex items-center gap-3 mt-4">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className="rounded-full transition-all duration-300 focus:outline-none"
                    style={{
                      width: idx === active ? 24 : 8,
                      height: 8,
                      backgroundColor: idx === active ? "#f59e0b" : "#cbd5e1",
                    }}
                  />
                ))}
              </div>

            </div>
          </div>

          {/* Right Column: Specifications & Dynamic Summary */}
          <div className="flex flex-col justify-center gap-8 order-3">

            {/* Card 3: Symmetric Offset Ergonomics */}
            <div
              onClick={() => goTo(2)}
              className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-left relative overflow-hidden flex flex-col gap-4 group cursor-pointer ${active === 2 ? "border-amber-500 ring-1 ring-amber-500" : "border-slate-200"
                }`}
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
              <div className="w-full h-32 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 p-2">
                <img
                  src={slides[2].image}
                  alt={slides[2].title}
                  className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="text-[9px] font-black tracking-widest text-amber-600 uppercase mb-1 block">{slides[2].tagline}</span>
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">{slides[2].title}</h4>
                <p className="text-xs text-slate-600 font-light leading-relaxed mt-1.5">
                  {slides[2].description}
                </p>
              </div>
            </div>

            {/* Card 4: Cryo-Tempered Japanese Steel */}
            <div
              onClick={() => goTo(3)}
              className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-left relative overflow-hidden flex flex-col gap-4 group cursor-pointer ${active === 3 ? "border-amber-500 ring-1 ring-amber-500" : "border-slate-200"
                }`}
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-400" />
              <div className="w-full h-32 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 p-2">
                <img
                  src={slides[3].image}
                  alt={slides[3].title}
                  className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase mb-1 block">{slides[3].tagline}</span>
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">{slides[3].title}</h4>
                <p className="text-xs text-slate-600 font-light leading-relaxed mt-1.5">
                  {slides[3].description}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
