const testimonials = [
  {
    stars: 5,
    quote:
      "The balance and edge retention on these shears have completely transformed our salon workflow. True craftsmanship that you can feel from the first cut.",
    name: "Sarah J.",
    title: "Lead Groomer",
    location: "New York, USA",
    initials: "SJ",
  },
  {
    stars: 5,
    quote:
      "I've tried scissors from Germany, Japan, and Korea. Bite Instruments from Sialkot outperformed them all. The offset handles alone saved my wrist after a decade of injury.",
    name: "David M.",
    title: "Salon Owner",
    location: "London, UK",
    initials: "DM",
  },
  {
    stars: 5,
    quote:
      "Our entire grooming team switched to Bite. The consistency across every pair — weight, edge, finish — is extraordinary. Wholesale pricing sealed the deal.",
    name: "Camille R.",
    title: "Head Stylist & Trainer",
    location: "Paris, France",
    initials: "CR",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mb-5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      className="w-full py-28"
      style={{ background: "linear-gradient(180deg, #080f24 0%, #0A1128 50%, #050814 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Section Header ── */}
        <div className="text-center mb-16">
          <p className="text-[#D4AF37] text-xs font-black tracking-[0.5em] uppercase mb-4">
            Client Voices
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-wider uppercase leading-tight">
            Trusted by Master{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
              Groomers
            </span>{" "}
            Worldwide
          </h2>
          <div className="mx-auto mt-6 w-20 h-[2px] rounded-full" style={{ background: "linear-gradient(to right, transparent, #D4AF37, transparent)" }} />
        </div>

        {/* ── 3-Column Review Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative flex flex-col bg-black/20 rounded-2xl p-8 border-t-2 border-yellow-500 hover:bg-black/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              {/* Large decorative quote mark */}
              <span
                className="absolute top-5 right-6 text-7xl font-serif leading-none text-yellow-500/10 select-none pointer-events-none"
                aria-hidden
              >
                "
              </span>

              <Stars count={t.stars} />

              {/* Review text */}
              <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed italic flex-1 mb-8">
                "{t.quote}"
              </p>

              {/* Thin divider */}
              <div className="w-full h-[1px] bg-white/5 mb-6" />

              {/* Author */}
              <div className="flex items-center gap-4">
                {/* Avatar initial */}
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black text-[#0A1128] flex-shrink-0 bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-lg">
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-bold tracking-wide">{t.name}</p>
                  <p className="text-gray-500 text-xs font-light tracking-wide">
                    {t.title} · {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust stats bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "10K+", label: "Professional Groomers" },
            { value: "48",   label: "Countries Served" },
            { value: "25+",  label: "Years of Craftsmanship" },
            { value: "4.9★", label: "Average Rating" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
                {stat.value}
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-light">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
