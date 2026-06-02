import Link from "next/link";

const arrivals = [
  {
    id: "titanium-chunker",
    title: 'Titanium Chunker 7.5"',
    subtitle: "Matte titanium finish · Wide-tooth blade",
    image: "/assets/titanium-chunker.png",
    price: "Request Quote",
  },
  {
    id: "swivel-detailer",
    title: "Swivel Thumb Detailer",
    subtitle: "360° swivel ring · Precision detail work",
    image: "/assets/swivel-detailer.png",
    price: "Request Quote",
  },
  {
    id: "double-swivel",
    title: 'Japanese Double Swivel 6.5"',
    subtitle: "VG10 steel · Rose gold tension dial",
    image: "/assets/double-swivel.png",
    price: "Request Quote",
  },
];

export default function NewArrivals() {
  return (
    <section className="w-full py-28" style={{ background: "linear-gradient(180deg, #050814 0%, #080f24 100%)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Section Header ── */}
        <div className="text-center mb-16">
          <p className="text-[#D4AF37] text-xs font-black tracking-[0.5em] uppercase mb-4">
            Fresh from the Forge
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-wider uppercase">
            New{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
              Arrivals
            </span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-light mt-4 tracking-wide">
            The Latest Masterpieces from Our Sialkot Forge
          </p>
          {/* Gold underline */}
          <div className="mx-auto mt-6 w-20 h-[2px] rounded-full" style={{ background: "linear-gradient(to right, transparent, #D4AF37, transparent)" }} />
        </div>

        {/* ── 3-Column Card Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {arrivals.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:border-yellow-500/30 hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)]"
            >
              {/* NEW badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[9px] font-black px-2.5 py-1 rounded-full tracking-widest uppercase shadow-lg">
                  New
                </span>
              </div>

              {/* Product image with hover zoom */}
              <div className="overflow-hidden bg-[#080f24] h-64 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                  style={{ filter: "drop-shadow(0 10px 30px rgba(212,175,55,0.15))" }}
                />
              </div>

              {/* Card body */}
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div>
                  <h3 className="text-white text-lg font-semibold tracking-wide mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs tracking-wide font-light">{item.subtitle}</p>
                </div>

                {/* Thin gold divider */}
                <div className="w-full h-[1px] bg-white/5" />

                {/* CTA */}
                <Link
                  href={`/product/${item.id}`}
                  className="mt-auto group/btn flex items-center justify-between text-yellow-400 text-sm font-semibold tracking-wide hover:text-yellow-300 transition-colors duration-200"
                >
                  <span>View Details</span>
                  <span className="flex items-center gap-1 transition-transform duration-300 group-hover/btn:translate-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View all CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/new-arrivals"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-yellow-500/40 text-yellow-400 text-sm font-bold uppercase tracking-widest hover:bg-yellow-500/10 hover:border-yellow-500 transition-all duration-300"
          >
            Explore Full Collection
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
