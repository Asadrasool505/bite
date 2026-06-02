import Link from "next/link";
import productsData from "../../../products.json";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewArrivalsPage() {
  let filteredProducts: any[] = [];
  const targetIds = ["titanium-chunker", "swivel-detailer", "double-swivel"];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (!error && data && data.length > 0) {
      // Map database columns to local properties for catalog/product card compatibility
      const mapped = data.map((item: any) => {
        // Parse technical specifications or mock them from database fields if missing
        const techSpecs = item.technical_specifications || {
          material: item.steel_type || "Premium Japanese J2 Stainless Steel",
          handle: "Ergonomic Symmetric Offset",
          edge: "Precision Convex Razor Edge",
          sizes: ["7.5\" Inch"]
        };

        return {
          ...item,
          id: item.id,
          name: item.title || item.name,
          price: item.price_tier_1 || item.price || 25.0,
          images: Array.isArray(item.images) 
            ? item.images 
            : (item.image_url ? [item.image_url] : ["/assets/placeholder.png"]),
          category: item.category || "Grooming Shears",
          description: item.description || "",
          price_tier_1: item.price_tier_1,
          price_tier_2: item.price_tier_2,
          price_tier_3: item.price_tier_3,
          technical_specifications: techSpecs
        };
      });

      filteredProducts = mapped.filter((product: any) => targetIds.includes(product.id));
    }
  } catch (err) {
    console.error("Supabase dynamic arrivals fetch failed, using local fallback:", err);
  }

  // Fallback to local json data if empty or fetch failed
  if (filteredProducts.length === 0) {
    filteredProducts = productsData
      .filter((product: any) => targetIds.includes(product.id))
      .map((item: any) => ({
        ...item,
        // Make sure it matches ProductCard interface
        name: item.name,
        price: item.price,
        images: Array.isArray(item.images) ? item.images : ["/assets/placeholder.png"],
        category: item.category || "Grooming Shears",
        description: item.description || ""
      }));
  }

  return (
    <div className="min-h-screen w-full bg-[#050814] pt-28 pb-20 px-6" style={{ background: "linear-gradient(180deg, #050814 0%, #080f24 100%)" }}>
      <div className="max-w-7xl mx-auto">
        
        {/* ── Page Header ── */}
        <div className="text-center mb-16">
          <p className="text-[#D4AF37] text-xs font-black tracking-[0.5em] uppercase mb-4 animate-pulse">
            Premium New Collection
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 uppercase tracking-widest mb-4">
            New Arrivals
          </h1>
          <p className="text-gray-400 text-base md:text-lg font-light mt-4 tracking-wide max-w-2xl mx-auto">
            Explore the latest masterfully crafted, B2B-exclusive grooming shears fresh from our Sialkot forge.
          </p>
          <div className="mx-auto mt-6 w-24 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
        </div>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 text-lg font-light tracking-widest uppercase">
                No new arrivals found at the moment.
              </p>
              <Link href="/" className="inline-block mt-6 text-yellow-500 hover:text-yellow-400 transition-colors text-sm font-bold uppercase tracking-widest">
                Explore All Products
              </Link>
            </div>
          )}
        </div>

        {/* ── Back CTA ── */}
        <div className="mt-20 text-center">
          <Link 
            href="/" 
            className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-widest border-b border-gray-600 hover:border-white pb-1"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
