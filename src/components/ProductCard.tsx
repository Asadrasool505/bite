"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  features?: string[];
  on_main_page?: boolean;
  technical_specifications?: {
    handle: string;
    edge: string;
    material: string;
    sizes: string[];
  };
}

export function getProductSpecs(product: any) {
  const name = (product?.name || product?.title || "").toLowerCase();
  const category = (product?.category || product?.categories || "").toLowerCase();

  const isShears = category.includes("scissors") || category.includes("shears") || name.includes("scissors") || name.includes("shear");

  if (isShears) {
    return {
      type: "shears",
      material: product?.technical_specifications?.material || "Premium Japanese J2 Stainless Steel",
      handle: product?.technical_specifications?.handle || "Ergonomic Offset",
      edge: product?.technical_specifications?.edge || "Convex Micro-serrated",
      finish: product?.technical_specifications?.finish || "Satin Polish Finish",
      hardness: "HRC 60-61",
      tension: product?.technical_specifications?.tension || "Adjustable Gold Dial",
      origin: "Sialkot, Pakistan"
    };
  }

  // Non-shear items
  if (category.includes("clipper") || name.includes("clipper")) {
    return {
      type: "clippers",
      material: "Professional-Grade Steel & Polymer",
      power: "High-Torque Motor / Li-Ion Cordless",
      speed: "5-Speed Adjustable Smart Motor",
      coating: "Stay-Cool Ceramic / Titanium Coating",
      origin: "Sialkot, Pakistan"
    };
  }

  if (category.includes("comb") || name.includes("comb")) {
    return {
      type: "combs",
      material: "High-Grade Stainless Steel / Premium Polymer",
      coating: "Anti-Static Chrome Plating",
      pins: "Rounded Tapered Safety Pins",
      grip: "Ergonomic Anti-Slip Rubber Grip",
      origin: "Sialkot, Pakistan"
    };
  }

  if (category.includes("nail") || name.includes("nail") || name.includes("claw")) {
    return {
      type: "nail_cutters",
      material: "High-Grade Stainless Steel / Premium Polymer",
      safety: "Built-in Quick Sensor Safety Guard",
      grip: "Ergonomic Non-Slip Comfort Grip",
      coating: "Anti-Rust Treated Finish",
      origin: "Sialkot, Pakistan"
    };
  }

  if (category.includes("brush") || name.includes("brush") || name.includes("slicker")) {
    return {
      type: "brushes",
      material: "Premium Beechwood & Polished Stainless Steel Pins",
      coating: "Anti-Static Pin Coating",
      pins: "Soft-Flex Polished Steel Pins",
      grip: "Comfort-Grip Ergonomic Handle",
      origin: "Sialkot, Pakistan"
    };
  }

  // Universal Fallback
  return {
    type: "universal",
    material: "High-Grade Stainless Steel / Premium Polymer",
    coating: "Anti-Static / Rust-Resistant",
    design: "Professional Ergonomic Grip",
    finish: "Premium Matte / Polished Finish",
    origin: "Sialkot, Pakistan"
  };
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite, addToCompare, removeFromCompare, compareList, t } = useApp();
  const [reviews, setReviews] = useState<any[]>([]);

  const displayImage = product?.images && product.images.length > 0 
    ? product.images[0] 
    : "/assets/placeholder.png";

  const isFav = isFavorite(product?.id);
  const inCompare = compareList.some((item) => item.id === product?.id);

  // Load reviews on mount
  useEffect(() => {
    if (typeof window !== "undefined" && product?.id) {
      const saved = localStorage.getItem(`reviews_${product.id}`);
      if (saved) {
        try {
          setReviews(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        // Fallback default review
        setReviews([
          { rating: 5, comment: "Professional standard quality." }
        ]);
      }
    }
  }, [product?.id]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
    : 5;

  const reviewsCount = reviews.length;
  const specs = getProductSpecs(product);

  return (
    <Link href={`/product/${product?.id}`} className="block h-full group">
      <div className="relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 border border-slate-100 bg-white/5 backdrop-blur-sm h-full group-hover:-translate-y-1 group-hover:border-yellow-500/50 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.2)] flex flex-col">
        
        {/* Aspect ratio block */}
        <div className="aspect-square relative w-full flex items-center justify-center p-6 bg-white/50">
          
          {/* Floating Compare Scale Overlay */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (inCompare) {
                removeFromCompare(product.id);
              } else {
                addToCompare(product);
              }
            }}
            className={`absolute top-3 left-3 z-10 p-2 rounded-full backdrop-blur-sm border transition-all hover:scale-110 cursor-pointer ${
              inCompare 
                ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" 
                : "bg-white/80 border-slate-200 text-gray-400 hover:border-yellow-500/50 hover:text-yellow-400"
            }`}
            title="Compare Specification"
            aria-label="Add to comparison"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M12 5.25L4.5 9m7.5-3.75L19.5 9M4.5 9h15" />
            </svg>
          </button>

          {/* Floating Wishlist Heart Overlay */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product);
            }}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm border transition-all hover:scale-110 cursor-pointer ${
              isFav 
                ? "bg-red-500/20 border-red-500 text-red-500" 
                : "bg-white/80 border-slate-200 text-gray-400 hover:border-yellow-500/50 hover:text-yellow-400"
            }`}
            title="Add to Favorites"
            aria-label="Bookmark item"
          >
            <svg className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          <Image
            src={displayImage}
            alt={product?.name || "Product Image"}
            fill
            className="object-contain p-4 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Card Body */}
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <h3 className="text-lg md:text-xl font-bold mb-1 transition-colors text-slate-900 group-hover:text-amber-600">
            {product?.name}
          </h3>

          {/* Star Ratings Row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-amber-500">
              {Array.from({ length: Math.round(averageRating) }).map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            {reviewsCount > 0 ? (
              <span 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/product/${product.id}?tab=reviews`);
                }}
                className="text-[10px] text-slate-900 hover:text-amber-600 hover:underline transition-colors font-medium cursor-pointer"
              >
                ({reviewsCount} {reviewsCount === 1 ? 'Review' : 'Reviews'})
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border border-amber-500/30 text-amber-600">
                Premium Quality Tested
              </span>
            )}
          </div>

          <div className="text-xs md:text-sm text-slate-900 mb-6 line-clamp-3 font-light" dangerouslySetInnerHTML={{ __html: product?.description || "" }} />
          
          <div className="mt-auto pt-6 border-t border-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-amber-600">{t("technical_specs")}</p>
            <ul className="text-xs text-slate-900 space-y-2 mb-6">
              {specs.type === "shears" ? (
                <>
                  <li><strong className="text-slate-900 font-bold">Material:</strong> {specs.material}</li>
                  <li><strong className="text-slate-900 font-bold">Handle:</strong> {specs.handle}</li>
                  <li><strong className="text-slate-900 font-bold">Finish:</strong> {specs.finish}</li>
                </>
              ) : (
                <>
                  <li><strong className="text-slate-900 font-bold">Material:</strong> {specs.material}</li>
                  <li><strong className="text-slate-900 font-bold">Coating:</strong> {specs.coating || specs.finish || "Anti-Static / Rust-Resistant"}</li>
                </>
              )}
            </ul>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              className="w-full text-center py-3 rounded-full font-bold uppercase tracking-widest text-xs text-amber-600 border border-amber-500/30 transition-all group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-transparent cursor-pointer"
            >
              {t("add_to_quote")}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}