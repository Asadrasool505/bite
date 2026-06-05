import { notFound } from "next/navigation";
import productsData from "../../../../products.json";
import ProductDetailClient from "@/components/ProductDetailClient";
import { supabase } from "@/lib/supabaseClient";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function generateStaticParams() {
  return productsData.map((product) => ({
    id: product.id,
  }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> | { id: string } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;

  let product: any = null;

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
      };
    }
  } catch (err) {
    console.error("Supabase dynamic fetch failed for product metadata:", err);
  }

  if (!product) {
    product = productsData.find((p) => p.id === id);
  }

  if (!product) {
    return {
      title: "Product Not Found | Bite Instruments",
      description: "Product details are not available."
    };
  }

  const productName = product.name || product.title || "Premium Shears";
  return {
    title: `${productName} | Wholesale Pet Shears | Bite Instruments`,
    description: `Wholesale supplier of premium ${productName}. Engineered with premium Japanese steel for professional pet groomers and salons globally.`
  };
}

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

  const schemaProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name || product.title,
    "image": product.images && product.images.length > 0 ? product.images[0] : "",
    "description": product.description ? product.description.replace(/<[^>]*>/g, '') : "Premium B2B grooming tools.",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "8.50",
      "highPrice": "24.00",
      "offerCount": "100"
    }
  };

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bite Instruments",
    "url": "https://biteinstruments.com",
    "logo": "https://biteinstruments.com/icon.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+923196085514",
      "contactType": "customer service"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}

