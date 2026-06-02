import { notFound } from "next/navigation";
import productsData from "../../../../products.json";
import ProductDetailClient from "@/components/ProductDetailClient";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function generateStaticParams() {
  return productsData.map((product) => ({
    id: product.id,
  }));
}

export const dynamicParams = true;

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;

  let product: any = null;

  // Prioritize fetching dynamically from Supabase first to ensure real-time price and detail updates
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      product = {
        ...data,
        name: data.title || data.name,
        price: data.price_tier_1 || data.price || 25.0,
        images: Array.isArray(data.images) ? data.images : (data.image_url ? [data.image_url] : []),
        category: data.category || data.categories || "Pet Straight Scissors",
        technical_specifications: data.technical_specifications || {
          material: data.steel_type || "Japanese J2 Steel",
          handle: "Ergonomic Offset Handle",
          edge: "Convex Micro-serrated Razor Edge",
          tension: "Professional Adjustable Pivot Screw System",
          sizes: ["7.0\" Inch", "7.5\" Inch", "8.0\" Inch"]
        }
      };
    }
  } catch (err) {
    console.error("Supabase dynamic fetch failed for product:", err);
  }

  // Fallback to local products.json file dataset if not found or fetch fails
  if (!product) {
    product = productsData.find((p) => p.id === id);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

