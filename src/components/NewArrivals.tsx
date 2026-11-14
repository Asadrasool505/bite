import Link from "next/link";

const arrivals = [
  {
    id: "BITE-PET-519",
    slug: "bite-instruments-gold-titanium-chunker-thinning-shear-professional-440c-steel-pet-blending-s",
    title: "Gold Titanium Chunker",
    subtitle: "Red Gemstone Dial",
    image: "https://zdtrffkmpfyqdpjmudbf.supabase.co/storage/v1/object/public/product-images/thinning-shears/bite-instruments-gold-titanium-chunker-thinning-shear-professional-440c-steel-pet-blending-s/main.webp",
    price: "$31.95 USD",
    description: "Wide-tooth 440C Japanese steel chunker with gold titanium PVD coating and a ruby gemstone tension dial for rapid bulk removal and plush teddy-bear finishes.",
    badge: "New Arrival",
  },
  {
    id: "BITE-PET-534",
    slug: "bite-instruments-black-titanium-2-piece-pet-grooming-shear-set-curved-chunker",
    title: "Black Titanium 2-Piece Set",
    subtitle: "Curved & Chunker Duo",
    image: "https://zdtrffkmpfyqdpjmudbf.supabase.co/storage/v1/object/public/product-images/double-sets/bite-instruments-black-titanium-2-piece-pet-grooming-shear-set-curved-chunker/main.webp",
    price: "$49.50 USD",
    description: "Matched matte black titanium curved contours shear and wide-tooth chunker with gold accents and a custom red quilted leatherette zipper case.",
    badge: "Pro Duo",
  },
  {
    id: "BITE-PET-536",
    slug: "bite-instruments-gold-titanium-2-piece-pet-grooming-shear-set-straight-chunker-scissors-kit",
    title: "Gold Titanium 2-Piece Set",
    subtitle: "Straight & Chunker Kit",
    image: "https://zdtrffkmpfyqdpjmudbf.supabase.co/storage/v1/object/public/product-images/double-sets/bite-instruments-gold-titanium-2-piece-pet-grooming-shear-set-straight-chunker-scissors-kit/main.webp",
    price: "$49.95 USD",
    description: "Luxury gold titanium straight finishing shear paired with a high-volume chunker blender and ruby gemstone dials in a protective zipper pouch.",
    badge: "Limited Edition",
  },
];

export default function NewArrivals() {
  return (
    <section className="w-full py-28" style={{ background: "#F4F5F7" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Section Header ── */}
        <div className="text-center mb-16">
          <p className="text-[#D4AF37] text-xs font-black tracking-[0.5em] uppercase mb-4">
            Fresh from the Forge
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-wider uppercase">
            New{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
              Arrivals
            </span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg font-light mt-4 tracking-wide">
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
              className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-lg"
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[9px] font-black px-2.5 py-1 rounded-full tracking-widest uppercase shadow-lg">
                  {item.badge}
                </span>
              </div>

              {/* Product image with hover zoom */}
              <Link href={`/product/${item.slug}`} className="overflow-hidden bg-white h-64 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                  style={{ filter: "drop-shadow(0 10px 30px rgba(212,175,55,0.15))" }}
                  loading="lazy"
                />
              </Link>

              {/* Card body */}
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-slate-900 text-lg font-semibold tracking-wide mb-1">{item.title}</h3>
                    <p className="text-amber-600 text-xs tracking-wide font-semibold uppercase">{item.subtitle}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-800 whitespace-nowrap bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    {item.price}
                  </span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed font-light line-clamp-3">
                  {item.description}
                </p>

                {/* Thin gold divider */}
                <div className="w-full h-[1px] bg-slate-100 mt-auto" />

                {/* CTA */}
                <Link
                  href={`/product/${item.slug}`}
                  className="group/btn flex items-center justify-between text-amber-600 text-sm font-semibold tracking-wide hover:text-amber-500 transition-colors duration-200"
                >
                  <span>View Details</span>
                  <span className="flex items-center gap-1 transition-transform duration-300 group-hover/btn:translate-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-amber-500/40 text-amber-600 text-sm font-bold uppercase tracking-widest hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300"
          >
            Explore Full Collection
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}