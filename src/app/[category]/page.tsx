import Link from "next/link";
import { notFound } from "next/navigation";
import productsData from "../../../products.json";
import { supabase } from "@/lib/supabaseClient";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> | { category: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const categorySlug = resolvedParams.category;

  // Function to slugify category names for comparison
  const slugify = (text: string) => 
    text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');

  let filteredProducts: any[] = [];

  try {
    const { data, error } = await supabase
      .from('pet_products')
      .select('*');

    if (!error && data && data.length > 0) {
      // Map categories column to category property for catalog compatibility
      const mapped = data.map((item: any) => ({
        ...item,
        category: item.categories || item.category || "Pet Straight Scissors",
        // Fallback baseline price for display
        price: item.price_tier_1 || item.price || 25.0
      }));
      filteredProducts = mapped.filter(
        (product: any) => slugify(product.category) === categorySlug
      );
    }
  } catch (err) {
    console.error("Supabase dynamic category fetch failed, using local fallback:", err);
  }

  // Fallback to local json data if empty or fetch failed
  if (filteredProducts.length === 0) {
    filteredProducts = productsData.filter(
      (product: any) => slugify(product.category) === categorySlug
    );
  }


  // If no products found for this category slug, we can still show the page but it will be empty
  // or we could show notFound() if we want strict categories. 
  // Let's be flexible but check if the slug looks like a valid path.
  if (filteredProducts.length === 0 && !["all", "best-sellers", "grooming-shears"].includes(categorySlug)) {
    // Optionally return notFound() or just show empty
  }

  const title = categorySlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen w-full bg-[#050814] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 uppercase tracking-widest mb-4">
            {title}
          </h1>
          <div className="mx-auto w-24 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item: any) => {
              const displayImage = item.images && item.images.length > 0 
                ? item.images[0] 
                : (item.image_url || item.image || "/assets/placeholder.png");
              
              return (
                <Link href={`/product/${item.id}`} key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-yellow-500/50 hover:bg-white/10 hover:-translate-y-1 group relative overflow-hidden h-full">
                  {/* Image */}
                  <div className="w-full h-64 bg-[#0A1128] rounded-xl mb-6 flex items-center justify-center border border-white/5 shadow-inner p-4 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     <img src={displayImage} alt={item.name} className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {/* Details */}
                  <div className="flex flex-col flex-1 w-full text-left">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-white font-bold text-base leading-tight group-hover:text-yellow-400 transition-colors line-clamp-2">{item.name}</h3>
                      <p className="text-yellow-500 font-black tracking-wide text-sm whitespace-nowrap">
                        {item.is_variable ? `Starting from $${item.price?.toFixed(2)}` : `$${item.price?.toFixed(2)}`}
                      </p>
                    </div>
                    <div className="text-gray-400 text-xs font-light mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: item.description || "" }} />
                    
                    <div className="mt-auto pt-4 border-t border-white/10 flex flex-wrap gap-2">
                      <span className="text-[9px] uppercase tracking-widest text-gray-500 border border-gray-600/50 rounded-full px-2 py-0.5">{item.category}</span>
                      <span className="text-[9px] uppercase tracking-widest text-yellow-500/50 border border-yellow-500/20 rounded-full px-2 py-0.5">Premium Export</span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 text-lg font-light tracking-widest uppercase">No products found in this collection.</p>
              <Link href="/" className="inline-block mt-6 text-yellow-500 hover:text-yellow-400 transition-colors text-sm font-bold uppercase tracking-widest">
                Explore All Products
              </Link>
            </div>
          )}
        </div>
        
        <div className="mt-20 text-center">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-widest border-b border-gray-600 hover:border-white pb-1">
                Back to Home
            </Link>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  const categories = [
    "pet-nail-cutters",
    "pet-combs",
    "curved-scissors",
    "blenders-thinning-scissors",
    "pet-straight-scissors"
  ];
  return categories.map((cat) => ({
    category: cat,
  }));
}
