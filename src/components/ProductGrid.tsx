import { productsData } from "@/data/products";
import ProductCard from "./ProductCard";

const FEATURED_KIT_SKUS = [
  "BITE-PET-540", // Matte Black 5-Piece Kit
  "BITE-PET-546", // Mirror Polish Silver 5-Piece Kit
  "BITE-PET-542", // Blue Titanium 5-Piece Kit
  "BITE-PET-543", // Gold Titanium 5-Piece Kit
  "BITE-PET-544", // Rainbow Multi-Color 5-Piece Kit
  "BITE-PET-545", // Hot Pink 5-Piece Kit
];

export default function ProductGrid() {
  const featuredKits = FEATURED_KIT_SKUS
    .map((sku) => productsData.find((p: any) => p.sku === sku))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section id="collection" className="py-12 px-6 md:px-8 w-full bg-[#F4F5F7]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-10 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-widest text-yellow-600 mb-6">
            Professional Grooming Essentials
          </h2>
          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredKits.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
