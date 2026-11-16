import Link from "next/link";
import { productsData, getSanitizedPetProduct } from "@/data/products";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

const CATEGORY_ALIASES: Record<string, string[]> = {
  "straight-scissors": [
    "straight-scissors",
    "pet-straight-scissors",
    "straight",
    "01_single_straight_scissor",
    "01-single-straight-scissor",
    "single-straight-scissor",
    "straight-shears",
  ],
  "pet-straight-scissors": [
    "pet-straight-scissors",
    "straight-scissors",
    "straight",
    "01_single_straight_scissor",
    "01-single-straight-scissor",
    "single-straight-scissor",
    "straight-shears",
  ],
  "curved-scissors": [
    "curved-scissors",
    "curved",
    "02_single_curved_scissor",
    "02-single-curved-scissor",
    "single-curved-scissor",
    "curved-shears",
  ],
  "thinning-shears": [
    "thinning-shears",
    "thinning",
    "blenders-thinning-scissors",
    "blenders-thinning-shears",
    "03_single_thinning_scissor",
    "03-single-thinning-scissor",
    "single-thinning-scissor",
    "chunker-shears",
  ],
  "blenders-thinning-scissors": [
    "blenders-thinning-scissors",
    "thinning-shears",
    "thinning",
    "03_single_thinning_scissor",
    "03-single-thinning-scissor",
    "single-thinning-scissor",
    "chunker-shears",
  ],
  "grooming-combs": [
    "grooming-combs",
    "pet-combs",
    "comb",
    "04_comb",
    "04-comb",
    "finishing-combs",
  ],
  "pet-combs": [
    "pet-combs",
    "grooming-combs",
    "comb",
    "04_comb",
    "04-comb",
    "finishing-combs",
  ],
  "double-sets": [
    "double-sets",
    "2-pieces",
    "2 pieces",
    "double-sets-2pcs",
    "05_double_sets_2pcs",
    "05-double-sets-2pcs",
  ],
  "pet-grooming-kits": [
    "pet-grooming-kits",
    "complete-kits",
    "kits",
    "complete-kits-4-to-5pcs",
    "06_complete_kits_4_to_5pcs",
    "06-complete-kits-4-to-5pcs",
    "complete-grooming-kits",
  ],
  "complete-kits": [
    "complete-kits",
    "pet-grooming-kits",
    "kits",
    "complete-kits-4-to-5pcs",
    "06_complete_kits_4_to_5pcs",
    "06-complete-kits-4-to-5pcs",
    "complete-grooming-kits",
  ],
  "pet-nail-cutters": ["pet-nail-cutters"],
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/ & /g, "-")
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

function matchesCategorySlug(productCategory: string, targetSlug: string): boolean {
  if (targetSlug === "all") return true;
  const rawLower = (productCategory || "").trim().toLowerCase();
  const normalized = slugify(productCategory || "");
  if (normalized === targetSlug || rawLower === targetSlug) return true;

  const aliases = CATEGORY_ALIASES[targetSlug];
  if (aliases) {
    return aliases.includes(rawLower) || aliases.includes(normalized);
  }
  return false;
}

function getNewCatalogSkuRank(item: any): number {
  const sku = String(item?.sku || item?.technical_specifications?.sku || "");
  const match = sku.match(/^BITE-PET-(5\d{2,})$/i);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;

  const title = categorySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${title} | Wholesale Pet Grooming Catalogue | BITE Instruments`,
    description: `Factory-direct Japanese 440C ${title} by BITE Instruments. Available in 5.0"–10.0" lengths with bulk tier pricing and OEM private label options.`,
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  let filteredProducts: any[] = [];

  try {
    const { data, error } = await supabase.from("products").select("*");

    if (!error && data && data.length > 0) {
      const mapped = data.map((item: any) => ({
        ...item,
        name: item.title || item.name,
        price:
          item.bulk_pricing?.qty_1_to_9 ??
          item.price_tier_1 ??
          item.price ??
          25.0,
        images: Array.isArray(item.images)
          ? item.images
          : item.image_url
          ? [item.image_url]
          : [],
        category: item.category || item.categories || "Pet Straight Scissors",
        price_tier_1: item.price_tier_1,
        price_tier_2: item.price_tier_2,
        price_tier_3: item.price_tier_3,
        bulk_pricing: item.bulk_pricing,
      }));
      filteredProducts = mapped.filter((product: any) =>
        matchesCategorySlug(product.category, categorySlug)
      );
    }
  } catch (err) {
    console.error("Supabase dynamic category fetch failed, using local fallback:", err);
  }

  // Fallback to local json data if empty or fetch failed
  if (filteredProducts.length === 0) {
    filteredProducts = productsData.filter((product: any) =>
      matchesCategorySlug(product.category, categorySlug)
    );
  }

  // Only sanitize legacy CSV-imported pet-* items that lack new SEO fields
  filteredProducts = filteredProducts
    .map((product: any, index: number) => {
      if (
        product.id &&
        String(product.id).startsWith("pet-") &&
        !product.meta_description
      ) {
        return getSanitizedPetProduct(product, index);
      }
      return product;
    })
    .sort((a: any, b: any) => getNewCatalogSkuRank(a) - getNewCatalogSkuRank(b));

  const title = categorySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen w-full bg-[#F4F5F7] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 uppercase tracking-widest mb-4 font-black">
            {title}
          </h1>
          <div className="mx-auto w-24 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
          <p className="text-slate-600 text-xs md:text-sm font-medium mt-3">
            🏭 Direct Factory Made Since 2015 ·{" "}
            <Link href="/custom-branding" className="text-amber-600 font-bold underline hover:text-amber-700">
              Reach Out for Custom Logo Branding &amp; Private Label
            </Link>
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item: any) => (
              <ProductCard key={item.id} product={item} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-900 text-lg font-light tracking-widest uppercase">
                No products found in this collection.
              </p>
              <Link
                href="/"
                className="inline-block mt-6 text-amber-600 hover:text-amber-500 transition-colors text-sm font-bold uppercase tracking-widest"
              >
                Explore All Products
              </Link>
            </div>
          )}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/"
            className="text-slate-900 hover:text-amber-600 transition-colors text-sm uppercase tracking-widest border-b border-slate-300 hover:border-amber-600 pb-1 font-bold"
          >
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
    "grooming-combs",
    "curved-scissors",
    "blenders-thinning-scissors",
    "thinning-shears",
    "pet-straight-scissors",
    "straight-scissors",
    "double-sets",
    "complete-kits",
    "pet-grooming-kits",
  ];
  return categories.map((cat) => ({
    category: cat,
  }));
}
