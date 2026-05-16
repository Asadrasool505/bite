"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const slides = [
  {
    title: "Straight Precision Shear",
    subtitle: "For flawless finishing lines",
    badge: "Finishing",
    image: "/assets/shear-straight.png",
    features: ["Perfectly straight blades", "Razor-honed micro-edge", "Mirror-polished J2 steel"],
  },
  {
    title: "Curved Grooming Shear",
    subtitle: "Engineered for smooth contours",
    badge: "Contouring",
    image: "/assets/shear-curved.png",
    features: ["Banana-curved blade profile", "Ergonomic offset handle", "Adjustable gold tension dial"],
  },
  {
    title: "Thinning / Blending Shear",
    subtitle: "Perfect blending and bulk removal",
    badge: "Texturizing",
    image: "/assets/shear-thinning.png",
    features: ["30-tooth serrated blade", "40% thinning ratio", "Zero-line blending"],
  },
];

// Label layout:
// Blade tips   → top ~16% of image, centered → label LEFT
// Gold dial    → top ~50% of image, centered → label RIGHT
// Finger rings → top ~72% of image, centered → label LEFT
const POINTERS = [
  {
    label: "Micron Precision Edge",
    sub: "Razor-honed cutting surface",
    dotTop: "16%",
    dotLeft: "50%",
    side: "left" as const,
  },
  {
    label: "Precision J2 Steel + Gold Dial",
    sub: "Adjustable tension pivot",
    dotTop: "50%",
    dotLeft: "50%",
    side: "right" as const,
  },
  {
    label: "Ergonomic Offset Handles",
    sub: "Reduces wrist fatigue 60%",
    dotTop: "74%",
    dotLeft: "50%",
    side: "left" as const,
  },
];

export default function ExplodedView3D() {
  const [active, setActive] = useState(0);
  // animState: 'idle' | 'exit' | 'enter'
  const [animState, setAnimState] = useState<"idle" | "exit" | "enter">("idle");
  const nextIdx = useRef(0);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === active || animState !== "idle") return;
      nextIdx.current = idx;
      // Step 1: exit current
      setAnimState("exit");
      setTimeout(() => {
        setActive(idx);
        // Step 2: enter new
        setAnimState("enter");
        setTimeout(() => setAnimState("idle"), 500);
      }, 350);
    },
    [active, animState]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((active + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [active, goTo]);

  const slide = slides[active];

  return (
    <section
      className="relative w-full overflow-hidden py-24"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #0d1f4a 0%, #080f2a 45%, #050814 100%)",
      }}
    >
      <style>{`
        @keyframes float-shear {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }
        .shear-float { animation: float-shear 4s ease-in-out infinite; }

        @keyframes ripple-gold {
          0%   { box-shadow: 0 0 0 0 rgba(212,175,55,0.7); }
          70%  { box-shadow: 0 0 0 8px rgba(212,175,55,0); }
          100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); }
        }
        .gold-ripple { animation: ripple-gold 2s ease-out infinite; }

        /* Slide exit: scale down + fade + drift up */
        @keyframes slide-exit {
          0%   { opacity: 1;   transform: scale(1)    translateY(0px); }
          100% { opacity: 0;   transform: scale(0.88) translateY(-30px); }
        }
        /* Slide enter: rise from below + scale up with overshoot bounce */
        @keyframes slide-enter {
          0%   { opacity: 0;   transform: scale(0.88) translateY(40px); }
          65%  { opacity: 1;   transform: scale(1.03) translateY(-6px); }
          100% { opacity: 1;   transform: scale(1)    translateY(0px); }
        }
        .anim-exit  { animation: slide-exit  0.35s cubic-bezier(0.4,0,1,1)    forwards; }
        .anim-enter { animation: slide-enter 0.5s  cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <p className="text-[14vw] font-black uppercase tracking-tighter whitespace-nowrap"
           style={{ color: "rgba(212,175,55,0.04)" }}>
          Perfection
        </p>
      </div>

      {/* Subtle spotlight glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center">

        {/* ── Section header ── */}
        <div className="text-center mb-14">
          <p className="text-[#D4AF37] text-xs font-bold tracking-[0.5em] uppercase mb-4">
            Masterpiece Engineering
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-wider">
            Anatomy of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
              Perfection
            </span>
          </h2>
        </div>

        {/* ══════════════════════════════════════
            CAROUSEL STAGE — everything centered
        ══════════════════════════════════════ */}
        <div
          className={`w-full flex flex-col items-center gap-8 ${
            animState === "exit" ? "anim-exit" : animState === "enter" ? "anim-enter" : ""
          }`}
        >

          {/* Image + absolute-pinned pointer dots */}
          <div className="shear-float relative w-full max-w-[280px] md:max-w-xs">

            <img
              src={slide.image}
              alt={slide.title}
              key={slide.image}
              className="w-full object-contain block"
              style={{
                maxHeight: 460,
                filter:
                  "drop-shadow(0 40px 80px rgba(212,175,55,0.22)) drop-shadow(0 0 50px rgba(0,0,0,0.65))",
              }}
            />

            {/* ── Pointer dots pinned onto the image ── */}
            {POINTERS.map((p) => (
              <div
                key={p.label}
                className="absolute"
                style={{ top: p.dotTop, left: p.dotLeft, transform: "translate(-50%, -50%)" }}
              >
                {/* Pulsing gold dot */}
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 gold-ripple relative z-10 cursor-pointer" />

                {/* Label card extending left or right */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 whitespace-nowrap"
                  style={p.side === "left" ? { right: "calc(100% + 8px)" } : { left: "calc(100% + 8px)" }}
                >
                  {/* Connector line */}
                  {p.side === "right" && (
                    <div className="w-10 h-[1px] bg-gradient-to-r from-yellow-500 to-yellow-500/30 flex-shrink-0" />
                  )}

                  {/* Glassmorphism label */}
                  <div
                    className="bg-black/30 backdrop-blur-xl border border-yellow-500/25 rounded-xl px-3 py-2 shadow-xl"
                    style={{ textAlign: p.side === "left" ? "right" : "left" }}
                  >
                    <p className="text-[#D4AF37] text-[8px] font-black tracking-[0.3em] uppercase mb-0.5">
                      {p.sub}
                    </p>
                    <p className="text-white text-xs font-semibold leading-tight">{p.label}</p>
                  </div>

                  {/* Connector line — left side */}
                  {p.side === "left" && (
                    <div className="w-10 h-[1px] bg-gradient-to-l from-yellow-500 to-yellow-500/30 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Dynamic info card ── */}
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl px-6 py-5 shadow-2xl text-center">
              {/* Badge */}
              <span className="inline-block px-3 py-1 rounded-full text-[9px] font-black tracking-[0.35em] uppercase bg-gradient-to-r from-yellow-400 to-yellow-600 text-[#0A1128] mb-3">
                {slide.badge}
              </span>
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-1 tracking-wide">
                {slide.title}
              </h3>
              {/* Subtitle */}
              <p className="text-gray-300 text-sm font-light tracking-wide mb-4">
                {slide.subtitle}
              </p>
              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                {slide.features.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-yellow-500/20 text-gray-200 text-[11px] font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse flex-shrink-0" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Pagination dots ── */}
          <div className="flex items-center gap-3 mt-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="rounded-full transition-all duration-300 focus:outline-none"
                style={{
                  width: idx === active ? 28 : 10,
                  height: 10,
                  background:
                    idx === active
                      ? "linear-gradient(to right, #fef08a, #D4AF37)"
                      : "rgba(255,255,255,0.2)",
                  boxShadow:
                    idx === active ? "0 0 10px rgba(212,175,55,0.7)" : "none",
                }}
              />
            ))}
          </div>

        </div>

        {/* ── Mobile label pills (shown when md labels are hidden) ── */}
        <div className="flex md:hidden flex-wrap gap-2 mt-8 justify-center">
          {POINTERS.map((p) => (
            <div
              key={p.label}
              className="flex items-center gap-2 bg-white/5 border border-yellow-500/20 px-3 py-2 rounded-full backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse flex-shrink-0" />
              <span className="text-white text-[10px] font-semibold">{p.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
