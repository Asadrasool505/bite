import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Bite Instruments | Manufacturer of Premium Pet Shears",
  description: "Learn about Bite Instruments' Sialkot heritage and manufacturing excellence. Supplying high-quality Japanese steel grooming shears, combs, and clippers to salons globally."
};

/* ── Reusable section label ── */
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-amber-600 text-xs font-black tracking-[0.5em] uppercase mb-4">
      {children}
    </p>
  );
}

/* ── Gold underline rule ── */
function GoldRule() {
  return (
    <div
      className="w-16 h-[2px] rounded-full mt-6"
      style={{ background: "linear-gradient(to right, #D97706, rgba(217,119,6,0.2))" }}
    />
  );
}

const pillars = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.091z" />
      </svg>
    ),
    title: "Micron Precision",
    body: "Every blade is ground to a tolerance of ±0.005mm. Our master sharpeners use traditional water-wheel honing combined with digital laser measurement to achieve an edge so fine it performs flawlessly on the finest coat textures.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: "Multi-Stage Quality",
    body: "Each instrument passes through 11 rigorous checkpoints before shipping — from raw steel hardness testing (HRC 58-62) to final surface polish inspection. Only instruments that achieve a perfect score carry the Bite name.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: "Heritage Innovation",
    body: "We marry 300 years of Sialkot hand-forging tradition with cutting-edge Japanese VG10 and J2 steel metallurgy. The result: instruments that feel ancient in heritage yet perform with modern surgical precision.",
  },
];

const stats = [
  { value: "300+", label: "Years of Sialkot Craftsmanship" },
  { value: "48", label: "Countries Served" },
  { value: "11", label: "Quality Checkpoints" },
  { value: "10K+", label: "Professional Groomers Equipped" },
];

const regions = [
  { flag: "🇺🇸", region: "North America", detail: "USA & Canada" },
  { flag: "🇬🇧", region: "United Kingdom", detail: "England, Scotland, Wales" },
  { flag: "🇩🇪", region: "Europe", detail: "Germany, France, Netherlands & more" },
  { flag: "🇦🇺", region: "Asia Pacific", detail: "Australia & New Zealand" },
  { flag: "🇸🇦", region: "Middle East", detail: "UAE, Saudi Arabia & Gulf" },
  { flag: "🇵🇰", region: "Pakistan", detail: "Manufactured in Sialkot" },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-[#F4F5F7]">

      {/* ══════════════════════════════════════
          1. HERO — Cinematic (dark overlay allowed per brand spec)
      ══════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <img
          src="/assets/about-hero.png"
          alt="Sialkot forge — Bite Instruments craftsmen at work"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark cinematic overlay — allowed only on hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90 z-0" />
        <div className="absolute inset-0 bg-black/40 backdrop-brightness-75 z-0" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-white text-xs font-black tracking-[0.5em] uppercase mb-4">Est. Sialkot · Pakistan</p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-yellow-600 leading-tight tracking-wide uppercase mb-6">
            Crafting Masterpieces<br className="hidden md:block" /> in Sialkot
          </h1>
          <p className="text-white/90 text-lg md:text-2xl font-light tracking-wide max-w-2xl mx-auto">
            A legacy of precision and passion for master groomers worldwide.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STAT STRIP — Ash-White
      ══════════════════════════════════════ */}
      <div className="w-full py-12 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-extrabold text-amber-600 mb-1">
                {s.value}
              </p>
              <p className="text-slate-900 text-xs uppercase tracking-widest font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          2. PHILOSOPHY — Ash-White
      ══════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F4F5F7]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Craftsman image */}
          <div className="relative group">
            <div className="rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-slate-200">
              <img
                src="/assets/about-craftsman.png"
                alt="Bite Instruments craftsman hand-finishing grooming shears"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ maxHeight: 560 }}
              />
            </div>
            {/* Floating gold badge */}
            <div className="absolute -bottom-5 -right-5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl px-5 py-4 shadow-2xl text-slate-950">
              <p className="text-2xl font-extrabold leading-none">J2</p>
              <p className="text-[9px] font-black uppercase tracking-widest mt-0.5">Japanese Steel</p>
            </div>
          </div>

          {/* Right — Text */}
          <div className="flex flex-col gap-6">
            <SectionEyebrow>Our Philosophy</SectionEyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 uppercase tracking-wide leading-tight">
              The Bite Instruments{" "}
              <span className="text-amber-600">Standard</span>
            </h2>
            <GoldRule />

            <p className="text-slate-900 text-base md:text-lg font-light leading-relaxed">
              We don&apos;t just make tools — we forge <em className="text-amber-600 font-semibold not-italic">extensions of a groomer&apos;s hand</em>. Every Bite Instruments shear is a collaboration between centuries of Sialkot metalwork knowledge and the uncompromising expectations of today&apos;s elite grooming professionals.
            </p>
            <p className="text-slate-900 text-base font-light leading-relaxed">
              Our commitment to Japanese J2 Steel ensures each blade achieves a Rockwell hardness of HRC 60±2, delivering edge retention that outlasts competitors by 3–5x. Combined with our obsessive ergonomic offset handle design, every pair is balanced to within 0.1 grams of perfect equilibrium.
            </p>
            <p className="text-slate-900 text-base font-light leading-relaxed">
              Hand-finished by craftsmen who have inherited their skill from generations of Sialkot artisans — every surface, every curve, every edge is touched, tested, and signed off by human eyes and hands before it reaches yours.
            </p>

            <div className="flex flex-col gap-3 mt-4">
              {["Japanese J2 & VG10 Steel exclusively", "11-stage quality inspection protocol", "Ergonomic offset handles — 60% less wrist fatigue", "Lifetime warranty on all instruments"].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <p className="text-slate-900 text-sm font-light">{point}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          3. MANUFACTURING — 3 Pillars (Ash-White)
      ══════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionEyebrow>Manufacturing Excellence</SectionEyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 uppercase tracking-wider">
              Three Pillars of{" "}
              <span className="text-amber-600">Mastery</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                className="group relative bg-[#F4F5F7] border border-slate-200 rounded-2xl p-8 hover:border-amber-500/50 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(245,158,11,0.1)]"
              >
                {/* Pillar number */}
                <span className="absolute top-6 right-6 text-6xl font-black text-slate-900/5 select-none pointer-events-none leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 mb-6">
                  {p.icon}
                </div>

                <h3 className="text-slate-900 text-xl font-bold tracking-wide mb-3">{p.title}</h3>
                <GoldRule />
                <p className="text-slate-900 text-sm font-light leading-relaxed mt-5">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. GLOBAL REACH & MISSION (Ash-White)
      ══════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#F4F5F7]">
        <div className="max-w-7xl mx-auto">

          {/* Mission statement pull quote */}
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <SectionEyebrow>Our Mission</SectionEyebrow>
            <blockquote className="text-3xl md:text-4xl font-light text-slate-900 leading-relaxed italic tracking-wide">
              &quot;To empower grooming professionals globally with the world&apos;s most{" "}
              <span className="text-amber-600 not-italic font-bold">
                reliable and elegant instruments
              </span>
              .&quot;
            </blockquote>
            <div
              className="mx-auto mt-8 w-24 h-[2px] rounded-full"
              style={{ background: "linear-gradient(to right, transparent, #D97706, transparent)" }}
            />
          </div>

          {/* Intro paragraph */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-slate-900 text-base md:text-lg font-light leading-relaxed">
              From our forge in Sialkot, Punjab, our instruments travel to grooming professionals across six continents. We are proud to be the trusted partner of independent salons, luxury pet spas, and elite grooming competition champions worldwide.
            </p>
          </div>

          {/* Region grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {regions.map((r) => (
              <div
                key={r.region}
                className="flex flex-col items-center gap-2 bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                <span className="text-4xl">{r.flag}</span>
                <p className="text-slate-900 text-xs font-bold tracking-wide">{r.region}</p>
                <p className="text-slate-600 text-[10px] font-light">{r.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. CTA — Ash-White with amber accents
      ══════════════════════════════════════ */}
      <section className="relative py-28 px-6 overflow-hidden bg-white border-t border-slate-100">
        {/* Subtle amber glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)", filter: "blur(40px)" }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <SectionEyebrow>Take the Next Step</SectionEyebrow>
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 uppercase tracking-wider mb-6 leading-tight">
            Ready to Upgrade Your{" "}
            <span className="text-amber-600">Salon&apos;s Performance?</span>
          </h2>
          <p className="text-slate-900 text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl mx-auto">
            Connect with our wholesale team to discuss exclusive distributor pricing, custom instrument packages, and white-label opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/contact"
              className="px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm text-slate-950 bg-amber-500 hover:bg-amber-600 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:-translate-y-1 transition-all duration-300"
            >
              Contact Us
            </Link>
            <Link
              href="/"
              className="px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm text-amber-600 border border-amber-500/50 hover:bg-amber-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              View Collection
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}