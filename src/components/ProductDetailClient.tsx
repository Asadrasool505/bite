"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getProductSpecs } from "./ProductCard";

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user, isFavorite, toggleFavorite, addToCompare, removeFromCompare, compareList, t, formatPrice, currency } = useApp();
  const isFav = isFavorite(product?.id);
  const inCompare = compareList.some((item) => item.id === product?.id);
  const specs = getProductSpecs(product);

  const tier1Price = Number(
    product?.bulk_pricing?.qty_1_to_9 ??
      (product?.price_tier_1 !== undefined && product?.price_tier_1 !== null
        ? product.price_tier_1
        : product?.price || 25.0)
  );
  const tier2Price = Number(
    product?.bulk_pricing?.qty_10_to_49 ??
      (product?.price_tier_2 !== undefined && product?.price_tier_2 !== null
        ? product.price_tier_2
        : Math.round(tier1Price * 0.95 * 100) / 100)
  );
  const tier3Price = Number(
    product?.bulk_pricing?.qty_50_plus ??
      (product?.price_tier_3 !== undefined && product?.price_tier_3 !== null
        ? product.price_tier_3
        : Math.round(tier1Price * 0.90 * 100) / 100)
  );

  const bulletPoints: string[] = Array.isArray(product?.bullet_points)
    ? product.bullet_points
    : Array.isArray(product?.features)
    ? product.features
    : [];

  const categoryLower = String(product?.category || product?.categories || "").toLowerCase();
  const titleLower = String(product?.name || product?.title || "").toLowerCase();
  const isKitOrSet =
    categoryLower.includes("kit") ||
    categoryLower.includes("set") ||
    titleLower.includes("kit") ||
    titleLower.includes("set");

  const defaultSizes = [
    '5.0" Inch',
    '5.5" Inch',
    '6.0" Inch',
    '6.5" Inch',
    '7.0" Inch',
    '7.5" Inch',
    '8.0" Inch',
    '8.5" Inch',
    '9.0" Inch',
    '10.0" Inch',
    'Custom OEM Length',
  ];
  const sizeOptions: string[] =
    (Array.isArray(product?.sizes) && product.sizes.length > 0 && product.sizes) ||
    (Array.isArray(product?.available_sizes) && product.available_sizes.length > 0 && product.available_sizes) ||
    (Array.isArray(product?.technical_specifications?.sizes) && product.technical_specifications.sizes.length > 0 && product.technical_specifications.sizes) ||
    defaultSizes;

  const productSku = product?.sku || product?.technical_specifications?.sku;

  const hasStructuredDesc =
    typeof product?.description === "string" &&
    product.description.toLowerCase().includes("the masterpiece standard");

  const standardFinishes = [
    "Mirror Polish Silver",
    "Titanium Gold",
    "Rose Gold / Pink",
    "Matte Black",
    "Black & Red Accent",
    "Sapphire Blue",
    "Rainbow Multi-Color",
  ];
  const primaryFinish = product?.technical_specifications?.finish || product?.color;
  const finishOptions = primaryFinish && !standardFinishes.includes(primaryFinish)
    ? [primaryFinish, ...standardFinishes]
    : standardFinishes;
  
  // Use product.images array if available, otherwise fallback to single image
  let galleryImages: string[] = [];
  
  if (Array.isArray(product?.images)) {
    galleryImages = product.images;
  } else if (typeof product?.images === 'string' && product.images.trim()) {
    const trimmed = product.images.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        galleryImages = JSON.parse(trimmed);
      } catch (e) {
        galleryImages = trimmed.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    } else {
      galleryImages = trimmed.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }

  if (!galleryImages || galleryImages.length === 0) {
    galleryImages = [product?.image_url || product?.image || "/assets/placeholder.png"];
  }

  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [activeTab, setActiveTab] = useState("description");
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });

  // Dynamic logistics region calculator state
  const [selectedCountry, setSelectedCountry] = useState("usa");

  // Sample Modal states
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [sampleName, setSampleName] = useState("");
  const [sampleCompany, setSampleCompany] = useState("");
  const [sampleEmail, setSampleEmail] = useState("");
  const [samplePhone, setSamplePhone] = useState("");
  const [sampleCourier, setSampleCourier] = useState("");
  const [isSampleSubmitting, setIsSampleSubmitting] = useState(false);
  const [sampleSuccess, setSampleSuccess] = useState(false);

  const LOGISTICS_REGIONS: Record<string, { label: string; prodDays: string; transitDays: string; total: string }> = {
    usa: { label: "United States (USA)", prodDays: "2–4", transitDays: "7–9", total: "9–13 Business Days" },
    uk: { label: "United Kingdom (UK)", prodDays: "2–4", transitDays: "6–8", total: "8–12 Business Days" },
    germany: { label: "Germany", prodDays: "2–4", transitDays: "6–8", total: "8–12 Business Days" },
    canada: { label: "Canada", prodDays: "2–4", transitDays: "8–10", total: "10–14 Business Days" },
    australia: { label: "Australia", prodDays: "2–4", transitDays: "9–11", total: "11–15 Business Days" },
    row: { label: "Rest of the World", prodDays: "2–4", transitDays: "10–12", total: "12–16 Business Days" }
  };

  const handleSampleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleName || !sampleCompany || !sampleEmail) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsSampleSubmitting(true);
    try {
      const response = await fetch("/api/sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: sampleName,
          company_name: sampleCompany,
          email: sampleEmail,
          phone: samplePhone,
          courier_account: sampleCourier,
          product_details: product?.name || product?.title || "Unknown Product",
        })
      });
      if (response.ok) {
        setSampleSuccess(true);
        setSampleName("");
        setSampleCompany("");
        setSampleEmail("");
        setSamplePhone("");
        setSampleCourier("");
      } else {
        alert("Sample request failed to submit. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error submitting sample request.");
    } finally {
      setIsSampleSubmitting(false);
    }
  };

  // Route tab from URL search parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["description", "specifications", "reviews"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Interactive reviews state
  const [reviews, setReviews] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`reviews_${product?.id}`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return [
      {
        name: "Emily R. - Master Groomer",
        rating: 5,
        date: "October 12, 2025",
        comment: "These are without a doubt the best shears I've used in my 15-year career. The balance is incredible, and they came out of the box razor sharp. Buying direct wholesale from Bite Instruments has completely transformed our salon's profitability. Will be ordering the full set!"
      }
    ];
  });
  
  // Load reviews from Supabase if table exists
  useEffect(() => {
    if (!product?.id) return;
    supabase
      .from("reviews")
      .select("*")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const compiled = data.map((r: any) => ({
            name: r.user_name || r.reviewer_name || "Anonymous Partner",
            rating: r.rating,
            date: new Date(r.created_at || Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            comment: r.review_text || r.comment || "No comment description provided."
          }));
          setReviews(compiled);
        }
      });
  }, [product?.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setZoomStyle({
      transformOrigin: `${x * 100}% ${y * 100}%`,
      transform: 'scale(2.5)' // 2.5x zoom
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] w-full pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="text-xs font-bold tracking-widest uppercase text-slate-900 mb-10">
          <span className="hover:text-amber-600 transition-colors cursor-pointer">Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-amber-600 transition-colors cursor-pointer">Products</span>
          <span className="mx-2">/</span>
          <span className="text-amber-600 font-extrabold">{product?.name || product?.title}</span>
        </div>

        {/* ── Top Section: 2 Columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-6">
            <div 
              className="w-full aspect-square bg-white/50 rounded-2xl border border-slate-200 flex items-center justify-center p-8 shadow-2xl relative overflow-hidden cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Radial glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent pointer-events-none opacity-50" />
              <img 
                src={activeImage} 
                alt={product?.name || product?.title} 
                className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-transform duration-200 ease-out" 
                style={zoomStyle}
              />
            </div>
            
            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((thumb: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(thumb)}
                    className={`aspect-square rounded-xl overflow-hidden border ${activeImage === thumb ? 'border-yellow-500 bg-white' : 'border-slate-200 bg-white/50'} hover:border-yellow-500/50 transition-all flex items-center justify-center p-2`}
                  >
                    <img src={thumb} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain drop-shadow-md" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-serif text-slate-900 tracking-wide mb-4 font-extrabold uppercase">
              {product?.name || product?.title}
            </h1>
            
            {/* Rating & SKU */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex text-amber-500">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              {reviews.length > 0 ? (
                <span className="text-slate-900 text-sm font-bold">
                  ({reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'})
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded border border-amber-500/30 text-amber-600 bg-amber-500/5">
                  Premium Quality Tested
                </span>
              )}
              {productSku && (
                <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded border border-slate-300 text-slate-900 bg-white">
                  SKU: {productSku}
                </span>
              )}
            </div>

            {/* Base Starting Price Display */}
            <p className="text-xl font-bold text-slate-900 tracking-wider mb-4">
              {product?.is_variable ? (
                <span>Baseline: Starting from {formatPrice(tier1Price)}</span>
              ) : (
                <span>Retail / Sample Price: {formatPrice(tier1Price)}</span>
              )}
              <span className="text-xs text-slate-900 font-light tracking-normal uppercase ml-2">{currency.code}</span>
            </p>

            {/* B2B Tiered Wholesale Pricing Table */}
            <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-[9px] font-black tracking-widest text-amber-600 uppercase mb-3">🔥 B2B WHOLESALE VOLUME TIER DISCOUNTS</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="border border-slate-200 bg-slate-50 rounded-xl p-3">
                  <p className="text-[9px] text-slate-900 font-bold uppercase tracking-wider">1 - 9 Units</p>
                  <p className="text-sm font-black text-slate-900 mt-1">
                    {formatPrice(tier1Price)}
                  </p>
                  <p className="text-[7px] text-slate-900 mt-0.5 font-medium">Standard Retail</p>
                </div>
                <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[6px] font-black px-1 py-0.5 rounded-bl-lg uppercase tracking-widest">5% OFF</div>
                  <p className="text-[9px] text-amber-600 font-bold uppercase tracking-wider">10 - 49 Units</p>
                  <p className="text-sm font-black text-amber-600 mt-1">
                    {formatPrice(tier2Price)}
                  </p>
                  <p className="text-[7px] text-amber-600 mt-0.5 font-bold">Bulk Discount</p>
                </div>
                <div className="border border-green-600/20 bg-green-600/5 rounded-xl p-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-600 text-white text-[6px] font-black px-1 py-0.5 rounded-bl-lg uppercase tracking-widest">10% OFF</div>
                  <p className="text-[9px] text-green-600 font-bold uppercase tracking-wider">50+ Units</p>
                  <p className="text-sm font-black text-green-600 mt-1">
                    {formatPrice(tier3Price)}
                  </p>
                  <p className="text-[7px] text-green-600 mt-0.5 font-bold">Factory Direct</p>
                </div>
              </div>
            </div>

            {/* B2B Dynamic Logistics Shipping Timeline Calculator */}
            <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-[9px] font-black tracking-widest text-amber-600 uppercase mb-3">🌐 {t("shipping_calculator_title")}</p>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <select 
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors"
                  >
                    {Object.entries(LOGISTICS_REGIONS).map(([key, region]) => (
                      <option key={key} value={key} className="bg-white text-slate-900">
                        {region.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-amber-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-900 font-bold uppercase tracking-wider">{t("production_lead_time")}</span>
                    <span className="text-slate-900 font-semibold">2–4 Business Days</span>
                  </div>
                  <div className="text-[10px] text-slate-900 italic mt-0.5 ml-1 font-semibold">Handcrafted, Quality Tested & Ready to Ship from Sialkot Factory</div>
                  
                  <div className="w-full h-[1px] bg-slate-200 my-2" />
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-900 font-bold uppercase tracking-wider">{t("transit_time")}</span>
                    <span className="text-amber-600 font-semibold">{LOGISTICS_REGIONS[selectedCountry].transitDays} Business Days</span>
                  </div>
                  <div className="text-[10px] text-slate-900 italic mt-0.5 ml-1 font-semibold">Premium Air Cargo via DHL Express / FedEx Priority</div>
                  
                  <div className="w-full h-[1px] bg-slate-200 my-2" />
                  
                  <div className="flex justify-between items-center text-xs bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                    <span className="text-amber-600 font-extrabold uppercase tracking-widest">{t("total_delivery")}</span>
                    <span className="text-amber-600 font-black text-sm">{LOGISTICS_REGIONS[selectedCountry].total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Brief Description & Key Feature Bullets */}
            {product?.short_description ? (
              <p className="text-slate-900 text-sm leading-relaxed mb-4 font-normal">
                {product.short_description}
              </p>
            ) : (
              <div className="text-slate-900 text-sm leading-relaxed mb-4 font-light line-clamp-3" dangerouslySetInnerHTML={{ __html: product?.description || "" }} />
            )}

            {bulletPoints.length > 0 && (
              <ul className="mb-6 space-y-1.5 bg-white/80 border border-slate-200 rounded-xl p-4">
                {bulletPoints.slice(0, 5).map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-900 font-medium leading-relaxed">
                    <span className="text-amber-600 font-black mt-0.5">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Certified Specifications */}
            <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-in fade-in duration-300">
              <p className="text-[9px] font-black tracking-widest text-amber-600 uppercase mb-3">
                🛠️ {specs.type === "shears" ? t("certified_steel_specs") : "Certified Steel Specifications"}
              </p>
              <div className="space-y-3">
                <div className="flex flex-col gap-1 text-xs pb-2 border-b border-slate-100">
                  <span className="text-slate-900 font-bold uppercase tracking-wider">Material &amp; Steel Grade</span>
                  <span className="text-slate-900 font-medium">{specs.material}</span>
                </div>
                <div className="flex flex-col gap-1 text-xs pb-2 border-b border-slate-100">
                  <span className="text-slate-900 font-bold uppercase tracking-wider">Steel Type</span>
                  <span className="text-slate-900 font-medium">{specs.steel_type}</span>
                </div>
                <div className="flex flex-col gap-1 text-xs pb-2 border-b border-slate-100">
                  <span className="text-slate-900 font-bold uppercase tracking-wider">{t("hardness_label") || "Hardness Rating"}</span>
                  <span className="text-amber-600 font-extrabold">{specs.hardness_rating}</span>
                </div>
                <div className="flex flex-col gap-1 text-xs pb-2 border-b border-slate-100">
                  <span className="text-slate-900 font-bold uppercase tracking-wider">Edge Profile</span>
                  <span className="text-slate-900 font-medium">{specs.edge_profile}</span>
                </div>
                <div className="flex flex-col gap-1 text-xs pb-2 border-b border-slate-100">
                  <span className="text-slate-900 font-bold uppercase tracking-wider">Handle Style</span>
                  <span className="text-slate-900 font-medium">{specs.handle_style}</span>
                </div>
                <div className="flex flex-col gap-1 text-xs pb-2 border-b border-slate-100">
                  <span className="text-slate-900 font-bold uppercase tracking-wider">Tension System</span>
                  <span className="text-slate-900 font-medium">{specs.tension_system}</span>
                </div>
                {specs.power && (
                  <div className="flex flex-col gap-1 text-xs pb-2 border-b border-slate-100">
                    <span className="text-slate-900 font-bold uppercase tracking-wider">Power / Battery</span>
                    <span className="text-slate-900 font-medium">{specs.power}</span>
                  </div>
                )}
                {specs.speed && (
                  <div className="flex flex-col gap-1 text-xs pb-2 border-b border-slate-100">
                    <span className="text-slate-900 font-bold uppercase tracking-wider">Speed Settings</span>
                    <span className="text-slate-900 font-medium">{specs.speed}</span>
                  </div>
                )}
                {specs.safety && (
                  <div className="flex flex-col gap-1 text-xs pb-2 border-b border-slate-100">
                    <span className="text-slate-900 font-bold uppercase tracking-wider">Safety Guard</span>
                    <span className="text-slate-900 font-medium">{specs.safety}</span>
                  </div>
                )}
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-slate-900 font-bold uppercase tracking-wider">Origin</span>
                  <span className="text-slate-900 font-semibold">{specs.origin}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-slate-200 mb-6" />

            {/* Variants Selectors - Contrast Fixed */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-900">Size (5.0&quot; – 10.0&quot;)</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors">
                    {sizeOptions.map((size: string) => (
                      <option key={size} value={size} className="bg-white text-slate-900">{size}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-amber-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-900">Color / Finish</label>
                <div className="relative">
                  <select defaultValue={primaryFinish || finishOptions[0]} className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors">
                    {finishOptions.map((finish: string) => (
                      <option key={finish} value={finish} className="bg-white text-slate-900">{finish}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-amber-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-auto">
              {/* Wholesale & MOQ Info Banner */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                <p className="text-xs text-amber-600 font-bold tracking-wide">
                  Wholesale Tier (50+ to 1–9 pcs): <span className="font-extrabold">{formatPrice(tier3Price)} - {formatPrice(tier1Price)}</span> / unit
                  <span className="mx-2 text-slate-900/30">|</span>
                  OEM / Private Label MOQ: <span className="font-extrabold">{isKitOrSet ? "10 Kits" : "20 Pieces"}</span>
                </p>
                <p className="text-[11px] text-slate-800 font-medium mt-1">
                  Custom Laser Logo Engraving, Color Coatings &amp; Branded Pouches (MOQ: 10 Kits / 20 Singles) · Standard Japanese 440C Steel (420J2, VG-10 &amp; Damascus OEM Available)
                </p>
                <div className="w-full h-[1px] bg-amber-500/10 my-2" />
                <p className="text-xs text-slate-900 font-bold tracking-wide">
                  Shipping Policy: <span className="text-amber-600 font-extrabold">FREE Worldwide over $250</span> (otherwise $35.00 Flat Rate via DHL/FedEx Express direct from Sialkot)
                </p>
              </div>

              <button 
                onClick={() => addToCart(product)}
                className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm bg-amber-500 text-slate-950 hover:bg-amber-600 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                {t("add_to_quote")}
              </button>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    addToCart(product);
                    router.push("/checkout");
                  }}
                  className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-amber-600 border border-amber-500 hover:bg-amber-500/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer text-center"
                >
                  Request Bulk Quote
                </button>
                <button 
                  onClick={() => setIsSampleModalOpen(true)}
                  className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-900 border border-slate-300 hover:border-amber-500 hover:bg-amber-500/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer text-center"
                >
                  {t("request_sample")}
                </button>
              </div>
              
              {/* E-Commerce Utilities: Wishlist and Compare */}
              <div className="flex gap-4">
                <button
                  onClick={() => toggleFavorite(product)}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                    isFav 
                      ? "bg-red-500/10 border-red-500 text-red-500" 
                      : "border-slate-300 text-slate-900 hover:text-amber-600 hover:border-amber-500 hover:bg-slate-50"
                  }`}
                >
                  <svg className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {isFav ? "Saved" : "Save Item"}
                </button>

                <button
                  onClick={() => {
                    if (inCompare) {
                      removeFromCompare(product.id);
                    } else {
                      addToCompare(product);
                    }
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                    inCompare 
                      ? "bg-amber-500/10 border-amber-500 text-amber-600" 
                      : "border-slate-300 text-slate-900 hover:text-amber-600 hover:border-amber-500 hover:bg-slate-50"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M12 5.25L4.5 9m7.5-3.75L19.5 9M4.5 9h15" />
                  </svg>
                  {inCompare ? "Compared" : "Compare"}
                </button>
              </div>
            </div>
            
            {/* Shipping note */}
            <div className="flex items-center gap-2 mt-6 justify-center">
              <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              <p className="text-xs text-slate-900 tracking-wider">Ships direct from Sialkot, Pakistan</p>
            </div>
          </div>
        </div>

        {/* ── Bottom Section: Tabbed Interface ── */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Tabs header */}
          <div className="flex border-b border-slate-200">
            {["description", "specifications", "reviews"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-5 text-xs md:text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? "text-amber-600 border-b-2 border-amber-500 bg-slate-50" 
                    : "text-slate-900 hover:text-amber-600 hover:bg-slate-50"
                }`}
              >
                {tab === 'description' ? 'Product Description' : tab === 'specifications' ? 'Technical Specifications' : 'Groomer Reviews'}
              </button>
            ))}
          </div>
          
          {/* Tabs content */}
          <div className="p-8 md:p-12 min-h-[300px]">
            {activeTab === "description" && (
              <div className="animate-in fade-in duration-500">
                {hasStructuredDesc ? (
                  <div
                    className="text-slate-900 font-light leading-relaxed space-y-4 max-w-none [&_h3]:text-xl [&_h3]:font-serif [&_h3]:font-black [&_h3]:text-slate-900 [&_h3]:mt-6 [&_h3]:mb-3 [&_h4]:text-xs [&_h4]:font-extrabold [&_h4]:uppercase [&_h4]:tracking-widest [&_h4]:text-amber-600 [&_h4]:mt-6 [&_h4]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:font-bold [&_strong]:text-slate-900"
                    dangerouslySetInnerHTML={{ __html: product?.description || "" }}
                  />
                ) : (
                  <>
                    <h3 className="text-xl font-serif text-slate-900 mb-4 tracking-wide font-black">The Masterpiece Standard</h3>
                    {bulletPoints.length > 0 && (
                      <ul className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-5">
                        {bulletPoints.map((point: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-900 font-medium">
                            <span className="text-amber-600 font-black">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="text-slate-900 font-light leading-relaxed mb-6 space-y-3 prose max-w-none" dangerouslySetInnerHTML={{ __html: product?.description || "" }} />
                    <p className="text-slate-900 font-light leading-relaxed">
                      Every instrument is hand-forged by BITE Instruments in Sialkot, Pakistan, bringing decades of metallurgical craftsmanship directly to professional pet groomers, salons, veterinary clinics, and global OEM/private-label distributors.
                    </p>
                  </>
                )}
              </div>
            )}
            
            {activeTab === "specifications" && (
              <div className="animate-in fade-in duration-500 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                  <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Material</span>
                  <span className="text-slate-900 text-sm font-light text-right">{specs.material}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                  <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Steel Type</span>
                  <span className="text-slate-900 text-sm font-light text-right">{specs.steel_type}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                  <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Hardness Rating</span>
                  <span className="text-slate-900 text-sm font-light text-right">{specs.hardness_rating}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                  <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Edge Profile</span>
                  <span className="text-slate-900 text-sm font-light text-right">{specs.edge_profile}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                  <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Handle Style</span>
                  <span className="text-slate-900 text-sm font-light text-right">{specs.handle_style}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                  <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Tension System</span>
                  <span className="text-slate-900 text-sm font-light text-right">{specs.tension_system}</span>
                </div>
                {(specs.finish || product?.color) && (
                  <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                    <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Finish / Color</span>
                    <span className="text-slate-900 text-sm font-light text-right">{specs.finish || product?.color}</span>
                  </div>
                )}
                {specs.power && (
                  <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                    <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Power / Battery</span>
                    <span className="text-slate-900 text-sm font-light text-right">{specs.power}</span>
                  </div>
                )}
                {specs.speed && (
                  <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                    <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Speed Settings</span>
                    <span className="text-slate-900 text-sm font-light text-right">{specs.speed}</span>
                  </div>
                )}
                {specs.safety && (
                  <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                    <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Safety Guard</span>
                    <span className="text-slate-900 text-sm font-light text-right">{specs.safety}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                  <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Origin</span>
                  <span className="text-slate-900 text-sm font-light text-right">{specs.origin}</span>
                </div>
              </div>
            )}
            
            {activeTab === "reviews" && (
              <div className="animate-in fade-in duration-500 flex flex-col gap-8">
                <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                  <div>
                    <h3 className="text-xl font-serif text-slate-900 mb-2 tracking-wide font-black">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-500">
                        {[1,2,3,4,5].map(star => (
                          <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        ))}
                      </div>
                      {reviews.length > 0 && <span className="text-slate-900 font-bold mr-1">5.0</span>}
                      <span className="text-slate-900 text-sm">
                        {reviews.length > 0 ? `(${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})` : "Be the first to review this product"}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      router.push(`/product/${product.id}/write-review`);
                    }}
                    className="px-6 py-2.5 rounded-full border border-amber-500 text-amber-600 text-xs font-bold uppercase tracking-widest hover:bg-amber-500/10 transition-all cursor-pointer"
                  >
                    Write a Review
                  </button>
                </div>
                
                {/* Dynamic Reviews List */}
                <div className="flex flex-col gap-6">
                  {reviews.length > 0 ? (
                    reviews.map((rev, index) => (
                      <div key={index} className="border-b border-slate-200 pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="text-slate-900 font-bold tracking-wide block mb-1">{rev.name}</span>
                            <div className="flex text-amber-500">
                              {Array.from({ length: rev.rating }).map((_, sIdx) => (
                                <svg key={sIdx} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                              ))}
                            </div>
                          </div>
                          <span className="text-slate-900 text-xs font-light">{rev.date}</span>
                        </div>
                        <p className="text-slate-900 text-sm font-light leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-900 text-sm italic">Be the first to review this product. Write a review to share your professional experience with other B2B buyers.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Sample Request Modal */}
      {isSampleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 my-4 mx-auto">
          <div className="relative w-full max-w-lg bg-[#F4F5F7] border border-slate-200 rounded-2xl overflow-hidden shadow-2xl p-8 animate-in zoom-in-95 duration-300 max-h-[85vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => {
                setIsSampleModalOpen(false);
                setSampleSuccess(false);
              }}
              className="absolute top-6 right-6 text-slate-900 hover:text-amber-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {sampleSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-serif text-slate-900 mb-4 tracking-wide font-extrabold">{t("sample_modal_title")}</h3>
                <p className="text-slate-900 text-sm leading-relaxed mb-6 font-medium">
                  {t("sample_success_msg")}
                </p>
                <button 
                  onClick={() => {
                    setIsSampleModalOpen(false);
                    setSampleSuccess(false);
                  }}
                  className="px-8 py-3 bg-amber-500 text-slate-950 font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg hover:bg-amber-600 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSampleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif text-slate-900 mb-2 tracking-wide font-black">{t("sample_modal_title")}</h3>
                  <p className="text-slate-900 text-xs font-light leading-relaxed">
                    {t("sample_modal_desc")}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-2">{t("name_label")} *</label>
                    <input 
                      type="text" 
                      required
                      value={sampleName}
                      onChange={(e) => setSampleName(e.target.value)}
                      placeholder="e.g. Alexander Weber"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-2">{t("company_label")} *</label>
                    <input 
                      type="text" 
                      required
                      value={sampleCompany}
                      onChange={(e) => setSampleCompany(e.target.value)}
                      placeholder="e.g. Grooming World GmbH"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-2">{t("email_label")} *</label>
                    <input 
                      type="email" 
                      required
                      value={sampleEmail}
                      onChange={(e) => setSampleEmail(e.target.value)}
                      placeholder="e.g. weber@groomingworld.de"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={samplePhone}
                      onChange={(e) => setSamplePhone(e.target.value)}
                      placeholder="e.g. +49 123 4567"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-2">{t("courier_acc_label")}</label>
                    <input 
                      type="text" 
                      value={sampleCourier}
                      onChange={(e) => setSampleCourier(e.target.value)}
                      placeholder="e.g. DHL-98234-AX / FEDEX-7823-QP"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-[10px] text-amber-600 font-light leading-relaxed">
                    {t("sample_disclaimer")}
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={isSampleSubmitting}
                  className="w-full py-4 bg-amber-500 text-slate-950 hover:bg-amber-600 font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isSampleSubmitting ? t("processing") : t("submit_request")}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}