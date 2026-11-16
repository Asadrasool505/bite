"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";

export interface Product {
  id: string;
  sku?: string;
  slug?: string;
  name: string;
  title?: string;
  price: number;
  price_tier_1?: number;
  price_tier_2?: number;
  price_tier_3?: number;
  bulk_pricing?: {
    qty_1_to_9?: number;
    qty_10_to_49?: number;
    qty_50_plus?: number;
  };
  short_description?: string;
  description: string;
  category: string;
  images: string[] | string;
  image?: string;
  image_url?: string;
  is_variable?: boolean;
  features?: string[];
  on_main_page?: boolean;
  technical_specifications?: {
    material?: string;
    steel_type?: string;
    hardness_rating?: string;
    hardness?: string;
    edge_profile?: string;
    edge?: string;
    handle_style?: string;
    handle?: string;
    tension_system?: string;
    tension?: string;
    origin?: string;
    finish?: string;
    sizes?: string[];
  };
}

export function getProductSpecs(product: any) {
  const name = (product?.name || product?.title || "").toLowerCase();
  const category = (product?.category || product?.categories || "").toLowerCase();
  const ts = product?.technical_specifications || {};

  const isComb = category.includes("comb") || name.includes("comb");
  const isClipper = category.includes("clipper") || name.includes("clipper");
  const isNail = category.includes("nail") || name.includes("nail") || name.includes("claw");
  const isBrush = category.includes("brush") || name.includes("brush") || name.includes("slicker");
  const isShears =
    !isComb &&
    (category.includes("scissors") ||
      category.includes("scissor") ||
      category.includes("shears") ||
      category.includes("sets") ||
      category.includes("kits") ||
      name.includes("scissors") ||
      name.includes("scissor") ||
      name.includes("shear") ||
      name.includes("kit") ||
      name.includes("set"));

  if (isShears) {
    const hardnessRating =
      ts.hardness_rating ||
      ts.hardness ||
      product?.hardness ||
      "60-61 HRC Vacuum Heat Treated";
    const edgeProfile =
      ts.edge_profile || ts.edge || "Convex Razor-Sharp Edge";
    const handleStyle =
      ts.handle_style || ts.handle || "Ergonomic Offset Handle";
    const tensionSystem =
      ts.tension_system || ts.tension || "Adjustable Precision Tension Screw";

    return {
      type: "shears",
      material:
        ts.material ||
        product?.steel_type ||
        "Japanese 440C Stainless Steel (Custom Steel Available)",
      steel_type:
        ts.steel_type ||
        product?.steel_type ||
        "440C Japanese Stainless Steel",
      hardness_rating: hardnessRating,
      hardness: hardnessRating,
      edge_profile: edgeProfile,
      edge: edgeProfile,
      handle_style: handleStyle,
      handle: handleStyle,
      tension_system: tensionSystem,
      tension: tensionSystem,
      finish: ts.finish || product?.color || "Mirror / PVD Titanium Finish",
      origin: ts.origin || "Sialkot, Pakistan",
    };
  }

  // Non-shear items
  if (isClipper) {
    return {
      type: "clippers",
      material: ts.material || "Professional-Grade Steel & Polymer",
      steel_type: ts.steel_type || "High-Carbon Tool Steel Blades",
      hardness_rating: ts.hardness_rating || "60-61 HRC Vacuum Heat Treated",
      edge_profile: ts.edge_profile || "Precision-Ground Detachable Blade",
      handle_style: ts.handle_style || "Anti-Slip Ergonomic Chassis",
      tension_system: ts.tension_system || "High-Torque Drive System",
      power: "High-Torque Motor / Li-Ion Cordless",
      speed: "5-Speed Adjustable Smart Motor",
      coating: ts.finish || "Stay-Cool Ceramic / Titanium Coating",
      origin: ts.origin || "Sialkot, Pakistan",
    };
  }

  if (isComb) {
    const hardnessRating =
      ts.hardness_rating ||
      ts.hardness ||
      product?.hardness ||
      "60-61 HRC Vacuum Heat Treated";
    const edgeProfile =
      ts.edge_profile || ts.edge || "Rounded Anti-Scratch Pins";
    const handleStyle =
      ts.handle_style || ts.handle || "Precision-Balanced Anti-Slip Spine";
    const tensionSystem =
      ts.tension_system || ts.tension || "N/A (One-Piece Solid Spine)";

    return {
      type: "combs",
      material:
        ts.material ||
        product?.steel_type ||
        "Japanese 440C Stainless Steel (Custom Steel Available)",
      steel_type: ts.steel_type || "440C Japanese Stainless Steel",
      hardness_rating: hardnessRating,
      hardness: hardnessRating,
      edge_profile: edgeProfile,
      edge: edgeProfile,
      handle_style: handleStyle,
      handle: handleStyle,
      tension_system: tensionSystem,
      tension: tensionSystem,
      finish: ts.finish || product?.color || "Anti-Static PVD / Chrome Finish",
      coating: ts.finish || product?.color || "Anti-Static PVD / Chrome Finish",
      pins: edgeProfile,
      grip: handleStyle,
      origin: ts.origin || "Sialkot, Pakistan",
    };
  }

  if (isNail) {
    return {
      type: "nail_cutters",
      material: ts.material || "High-Grade Stainless Steel / Premium Polymer",
      steel_type: ts.steel_type || "440C Japanese Stainless Steel",
      hardness_rating: ts.hardness_rating || "60-61 HRC Vacuum Heat Treated",
      edge_profile: ts.edge_profile || "Micro-Beveled Claw Shearing Blade",
      handle_style: ts.handle_style || "Ergonomic Non-Slip Comfort Grip",
      tension_system: ts.tension_system || "Concealed Return Spring Mechanism",
      safety: "Built-in Quick Sensor Safety Guard",
      grip: "Ergonomic Non-Slip Comfort Grip",
      coating: ts.finish || "Anti-Rust Treated Finish",
      origin: ts.origin || "Sialkot, Pakistan",
    };
  }

  if (isBrush) {
    return {
      type: "brushes",
      material: ts.material || "Premium Beechwood & Polished Stainless Steel Pins",
      steel_type: ts.steel_type || "304 Stainless Steel Flex Pins",
      hardness_rating: ts.hardness_rating || "Spring-Tempered Resilient Pins",
      edge_profile: ts.edge_profile || "Cushioned Rounded Bristle Tips",
      handle_style: ts.handle_style || "Comfort-Grip Ergonomic Handle",
      tension_system: ts.tension_system || "Air-Cushion Rubber Pad",
      coating: "Anti-Static Pin Coating",
      pins: "Soft-Flex Polished Steel Pins",
      grip: "Comfort-Grip Ergonomic Handle",
      origin: ts.origin || "Sialkot, Pakistan",
    };
  }

  // Universal Fallback
  return {
    type: "universal",
    material: ts.material || "Japanese 440C Stainless Steel (Custom Steel Available)",
    steel_type: ts.steel_type || "440C Japanese Stainless Steel",
    hardness_rating: ts.hardness_rating || "60-61 HRC Vacuum Heat Treated",
    edge_profile: ts.edge_profile || "Precision-Finished Edge",
    handle_style: ts.handle_style || "Professional Ergonomic Grip",
    tension_system: ts.tension_system || "Precision Factory Calibrated",
    coating: ts.finish || product?.color || "Anti-Static / Rust-Resistant",
    design: "Professional Ergonomic Grip",
    finish: ts.finish || product?.color || "Premium Matte / Polished Finish",
    origin: ts.origin || "Sialkot, Pakistan",
  };
}

export default function ProductCard({ product }: { product: Product | any }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite, addToCompare, removeFromCompare, compareList, t, formatPrice } = useApp();

  let parsedImages: string[] = [];
  if (Array.isArray(product?.images)) {
    parsedImages = product.images;
  } else if (typeof product?.images === "string" && product.images.trim()) {
    const trimmed = product.images.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        parsedImages = JSON.parse(trimmed);
      } catch {
        parsedImages = trimmed.split(",").map((s: string) => s.trim()).filter(Boolean);
      }
    } else {
      parsedImages = trimmed.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
  }

  const displayImage =
    parsedImages.length > 0
      ? parsedImages[0]
      : product?.image_url || product?.image || "/assets/placeholder.png";

  const displayTitle = product?.name || product?.title || "BITE Instruments Product";
  const displayPrice = Number(
    product?.bulk_pricing?.qty_1_to_9 ??
      (product?.price_tier_1 !== undefined && product?.price_tier_1 !== null
        ? product.price_tier_1
        : product?.price || 25.0)
  );

  const isFav = isFavorite(product?.id);
  const inCompare = compareList.some((item) => item.id === product?.id);

  return (
    <Link href={`/product/${product?.slug || product?.id}`} className="block h-full group">
      <div className="relative rounded-2xl overflow-hidden shadow-sm transition-all duration-300 border border-slate-200 bg-white h-full group-hover:-translate-y-1 group-hover:border-amber-500 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.18)] flex flex-col">

        {/* Aspect ratio block */}
        <div className="aspect-square relative w-full flex items-center justify-center p-6 bg-slate-50/70">

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
                ? "bg-yellow-500/20 border-yellow-500 text-yellow-500"
                : "bg-white/90 border-slate-200 text-gray-400 hover:border-yellow-500/50 hover:text-yellow-500"
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
                : "bg-white/90 border-slate-200 text-gray-400 hover:border-yellow-500/50 hover:text-yellow-500"
            }`}
            title="Add to Favorites"
            aria-label="Bookmark item"
          >
            <svg className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          <img
            src={displayImage}
            alt={displayTitle}
            className="w-full h-full object-contain p-4 drop-shadow-md transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Card Body: Clean Title + Price + Add to Cart */}
        <div className="p-5 md:p-6 flex-1 flex flex-col">
          <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-3">
            {displayTitle}
          </h3>

          <div className="flex items-baseline justify-between gap-2 mb-4 pt-3 border-t border-slate-100 mt-auto">
            <span className="text-lg md:text-xl font-extrabold text-amber-600">
              {formatPrice(displayPrice)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              10+ (5% Off) · 50+ (10% Off)
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full text-center py-3 rounded-xl font-bold uppercase tracking-widest text-xs bg-amber-500 text-slate-950 hover:bg-amber-600 transition-all cursor-pointer shadow-sm"
          >
            {t("add_to_quote")}
          </button>
        </div>
      </div>
    </Link>
  );
}