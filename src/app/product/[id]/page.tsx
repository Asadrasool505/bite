import { notFound } from "next/navigation";
import { productsData, getSanitizedPetProduct } from "@/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";
import { supabase } from "@/lib/supabaseClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return productsData.map((product) => ({
    id: product.id,
  }));
}

export const dynamicParams = true;

function normalizeSupabaseProduct(data: any) {
  const basePrice = Number(
    data.bulk_pricing?.qty_1_to_9 ?? data.price_tier_1 ?? data.price ?? 25.0
  );
  const tier2 = Number(
    data.bulk_pricing?.qty_10_to_49 ??
      data.price_tier_2 ??
      Math.round(basePrice * 0.95 * 100) / 100
  );
  const tier3 = Number(
    data.bulk_pricing?.qty_50_plus ??
      data.price_tier_3 ??
      Math.round(basePrice * 0.90 * 100) / 100
  );

  const ts = data.technical_specifications || {};
  const hardness =
    ts.hardness_rating ||
    ts.hardness ||
    data.hardness ||
    "60-61 HRC Vacuum Heat Treated";

  return {
    ...data,
    sku: data.sku || ts.sku || undefined,
    name: data.title || data.name,
    price: basePrice,
    price_tier_1: basePrice,
    price_tier_2: tier2,
    price_tier_3: tier3,
    bulk_pricing: data.bulk_pricing || {
      qty_1_to_9: basePrice,
      qty_10_to_49: tier2,
      qty_50_plus: tier3,
    },
    sizes:
      Array.isArray(data.sizes) && data.sizes.length > 0
        ? data.sizes
        : Array.isArray(ts.sizes) && ts.sizes.length > 0
        ? ts.sizes
        : undefined,
    images: Array.isArray(data.images)
      ? data.images
      : data.image_url
      ? [data.image_url]
      : [],
    category: data.category || data.categories || "straight-scissors",
    technical_specifications: {
      ...ts,
      material:
        ts.material ||
        data.steel_type ||
        "Japanese 440C Stainless Steel (Custom Steel Available)",
      steel_type:
        ts.steel_type || data.steel_type || "440C Japanese Stainless Steel",
      hardness_rating: hardness,
      hardness,
      edge_profile:
        ts.edge_profile || ts.edge || "Convex Razor-Sharp Edge",
      handle_style:
        ts.handle_style || ts.handle || "Ergonomic Offset Handle",
      tension_system:
        ts.tension_system ||
        ts.tension ||
        "Adjustable Precision Tension Screw",
      finish: ts.finish || data.color || "Mirror / PVD Titanium Finish",
      origin: ts.origin || "Sialkot, Pakistan",
      sizes:
        (Array.isArray(data.sizes) && data.sizes.length > 0 && data.sizes) ||
        (Array.isArray(ts.sizes) && ts.sizes.length > 0 && ts.sizes) || [
          '5.0"',
          '5.5"',
          '6.0"',
          '6.5"',
          '7.0"',
          '7.5"',
          '8.0"',
          '8.5"',
          '9.0"',
          '10.0"',
        ],
    },
  };
}

async function fetchProductByIdOrSlug(id: string): Promise<any | null> {
  try {
    const safeId = id.replace(/[,()]/g, "");
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`id.eq.${safeId},slug.eq.${safeId}`)
      .limit(1);

    if (!error && data && data.length > 0) {
      return normalizeSupabaseProduct(data[0]);
    }
  } catch (err) {
    console.error("Supabase dynamic fetch failed for product:", err);
  }

  return (
    productsData.find((p: any) => p.id === id || p.slug === id) || null
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductByIdOrSlug(id);

  if (!product) {
    return {
      title: "Product Not Found | BITE Instruments",
      description: "Product details are not available.",
    };
  }

  const productName = product.name || product.title || "Premium Pet Grooming Shears";
  const metaTitle =
    product.meta_title ||
    `${productName} | Factory-Direct Pet Grooming Tools | BITE Instruments`;
  const metaDescription =
    product.meta_description ||
    product.short_description ||
    `Factory-direct Japanese 440C ${productName} from BITE Instruments. Available in 5.0"-10.0" with custom OEM/private label branding.`;

  const keywords = Array.isArray(product.seo_keywords)
    ? product.seo_keywords
    : Array.isArray(product.features)
    ? product.features
    : undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product = await fetchProductByIdOrSlug(id);

  if (!product) {
    notFound();
  }

  // Only sanitize legacy CSV-imported pet-* records without pipeline SEO metadata
  if (
    product &&
    product.id &&
    String(product.id).startsWith("pet-") &&
    !product.meta_description
  ) {
    product = getSanitizedPetProduct(product, 0);
  }

  const highPrice = Number(
    product.bulk_pricing?.qty_1_to_9 ??
      product.price_tier_1 ??
      product.price ??
      25.0
  );
  const lowPrice = Number(
    product.bulk_pricing?.qty_50_plus ??
      product.price_tier_3 ??
      Math.round(highPrice * 0.90 * 100) / 100
  );

  const schemaProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name || product.title,
    brand: {
      "@type": "Brand",
      name: "BITE Instruments",
    },
    image:
      product.images && product.images.length > 0 ? product.images[0] : "",
    description:
      product.meta_description ||
      product.short_description ||
      (product.description
        ? product.description.replace(/<[^>]*>/g, "")
        : "Factory-direct Japanese 440C pet grooming tools by BITE Instruments."),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: lowPrice.toFixed(2),
      highPrice: highPrice.toFixed(2),
      offerCount: "3",
    },
  };

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BITE Instruments",
    url: "https://biteinstruments.com",
    logo: "https://biteinstruments.com/icon.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+923196085514",
      contactType: "customer service",
    },
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
