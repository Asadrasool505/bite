import Link from "next/link";
import { notFound } from "next/navigation";
import { productsData, getSanitizedPetProduct } from "@/data/products";
import { supabase } from "@/lib/supabaseClient";
import FormattedPrice from "@/components/FormattedPrice";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> | { category: string } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const categorySlug = resolvedParams.category;
  
  const title = categorySlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} | Wholesale Grooming Catalogue | Bite Instruments`,
    description: `Browse Sialkot's premium selection of wholesale ${title}. Engineered with high-grade Japanese steel for professional groomers and global export.`
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> | { category: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const categorySlug = resolvedParams.category;

  // Function to slugify category names for comparison
  const slugify = (text: string) => 
    text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');

  let filteredProducts: any[] = [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (!error && data && data.length > 0) {
      // Map database columns to local properties for catalog compatibility
      const mapped = data.map((item: any) => ({
        ...item,
        name: item.title || item.name,
        price: item.price_tier_1 || item.price || 25.0,
        images: Array.isArray(item.images) ? item.images : (item.image_url ? [item.image_url] : []),
        category: item.category || item.categories || "Pet Straight Scissors",
        // Map baseline pricing tiers back to item scope for Cart compatibility
        price_tier_1: item.price_tier_1,
        price_tier_2: item.price_tier_2,
        price_tier_3: item.price_tier_3,
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

  // Synchronize dynamic pet product descriptions and specifications from our authoritative array
  filteredProducts = filteredProducts.map((product: any, index: number) => {
    if (product.id && product.id.startsWith('pet-')) {
      return getSanitizedPetProduct(product, index);
    }
    return product;
  });


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
    <div className="min-h-screen w-full bg-[#F4F5F7] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 uppercase tracking-widest mb-4 font-black">
            {title}
          </h1>
          <div className="mx-auto w-24 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item: any) => {
              let productImages: string[] = [];
              if (Array.isArray(item.images)) {
                productImages = item.images;
              } else if (typeof item.images === 'string' && item.images.trim()) {
                const trimmed = item.images.trim();
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                  try {
                    productImages = JSON.parse(trimmed);
                  } catch (e) {
                    productImages = trimmed.split(',').map((s: string) => s.trim()).filter(Boolean);
                  }
                } else {
                  productImages = trimmed.split(',').map((s: string) => s.trim()).filter(Boolean);
                }
              }

              const displayImage = productImages.length > 0
                ? productImages[0]
                : (item.image_url || item.image || "/assets/placeholder.png");
              
              return (
                <Link href={`/product/${item.id}`} key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-amber-500 hover:-translate-y-1 group relative overflow-hidden h-full shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                  {/* Image */}
                  <div className="w-full h-64 bg-slate-50 rounded-xl mb-6 flex items-center justify-center border border-slate-100 shadow-inner p-4 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     <img src={displayImage} alt={item.name} className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  {/* Details */}
                  <div className="flex flex-col flex-1 w-full text-left">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-slate-900 font-bold text-base leading-tight group-hover:text-amber-600 transition-colors line-clamp-2">{item.name}</h3>
                      <FormattedPrice 
                        price={item.price} 
                        isVariable={item.is_variable} 
                        className="text-amber-600 font-black tracking-wide text-sm whitespace-nowrap" 
                      />
                    </div>
                    <div className="text-slate-900 text-xs font-light mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: item.description || "" }} />
                    
                    <div className="mt-auto pt-4 border-t border-slate-200 flex flex-wrap gap-2">
                      <span className="text-[9px] uppercase tracking-widest text-slate-900 border border-slate-300 rounded-full px-2 py-0.5">{item.category}</span>
                      <span className="text-[9px] uppercase tracking-widest text-amber-600 border border-amber-500/20 bg-amber-500/5 rounded-full px-2 py-0.5 font-bold">Premium Export</span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-900 text-lg font-light tracking-widest uppercase">No products found in this collection.</p>
              <Link href="/" className="inline-block mt-6 text-amber-600 hover:text-amber-500 transition-colors text-sm font-bold uppercase tracking-widest">
                Explore All Products
              </Link>
            </div>
          )}
        </div>
        
        <div className="mt-20 text-center">
            <Link href="/" className="text-slate-900 hover:text-amber-600 transition-colors text-sm uppercase tracking-widest border-b border-slate-300 hover:border-amber-600 pb-1 font-bold">
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
