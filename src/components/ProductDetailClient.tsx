"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user, isFavorite, toggleFavorite, addToCompare, removeFromCompare, compareList, t, formatPrice, currency } = useApp();
  const isFav = isFavorite(product?.id);
  const inCompare = compareList.some((item) => item.id === product?.id);
  
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
  const [sampleCourier, setSampleCourier] = useState("");
  const [isSampleSubmitting, setIsSampleSubmitting] = useState(false);
  const [sampleSuccess, setSampleSuccess] = useState(false);

  const LOGISTICS_REGIONS: Record<string, { label: string; prodDays: string; transitDays: string; total: string }> = {
    usa: { label: "United States (USA)", prodDays: "12–15", transitDays: "7–9", total: "19–24 Business Days" },
    uk: { label: "United Kingdom (UK)", prodDays: "12–15", transitDays: "6–8", total: "18–23 Business Days" },
    germany: { label: "Germany", prodDays: "12–15", transitDays: "6–8", total: "18–23 Business Days" },
    canada: { label: "Canada", prodDays: "12–15", transitDays: "8–10", total: "20–25 Business Days" },
    australia: { label: "Australia", prodDays: "12–15", transitDays: "9–11", total: "21–26 Business Days" },
    row: { label: "Rest of the World", prodDays: "12–15", transitDays: "10–12", total: "22–27 Business Days" }
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
          name: sampleName,
          company: sampleCompany,
          email: sampleEmail,
          courierAccount: sampleCourier,
        })
      });
      if (response.ok) {
        setSampleSuccess(true);
        setSampleName("");
        setSampleCompany("");
        setSampleEmail("");
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
    <div className="min-h-screen bg-[#050814] w-full pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-10">
          <span className="hover:text-yellow-500 transition-colors cursor-pointer">Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-yellow-500 transition-colors cursor-pointer">Products</span>
          <span className="mx-2">/</span>
          <span className="text-yellow-500">{product?.name || product?.title}</span>
        </div>

        {/* ── Top Section: 2 Columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-6">
            <div 
              className="w-full aspect-square bg-[#0A1128]/50 rounded-2xl border border-white/10 flex items-center justify-center p-8 shadow-2xl relative overflow-hidden cursor-crosshair"
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
                    className={`aspect-square rounded-xl overflow-hidden border ${activeImage === thumb ? 'border-yellow-500 bg-[#0A1128]' : 'border-white/10 bg-[#0A1128]/50'} hover:border-yellow-500/50 transition-all flex items-center justify-center p-2`}
                  >
                    <img src={thumb} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain drop-shadow-md" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-serif text-white tracking-wide mb-4">
              {product?.name || product?.title}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <span className="text-gray-400 text-sm font-light">({reviews.length} Reviews)</span>
            </div>

            {/* Base Starting Price Display */}
            <p className="text-xl font-bold text-gray-200 tracking-wider mb-4">
              {product?.is_variable ? (
                <span>Baseline: Starting from {formatPrice(Number(product?.price_tier_1 || product?.price || 25.00))}</span>
              ) : (
                <span>Baseline Price: {formatPrice(Number(product?.price_tier_1 || product?.price || 0.00))}</span>
              )}
              <span className="text-xs text-gray-500 font-light tracking-normal uppercase ml-2">{currency.code}</span>
            </p>

            {/* B2B Tiered Wholesale Pricing Table */}
            <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-[9px] font-black tracking-widest text-yellow-500 uppercase mb-3">🔥 B2B WHOLESALE VOLUME TIER DISCOUNTS</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="border border-white/5 bg-[#0A1128]/40 rounded-xl p-3">
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">1 - 10 Units</p>
                  <p className="text-sm font-black text-white mt-1">
                    {formatPrice(Number(product?.price_tier_1 !== undefined && product?.price_tier_1 !== null ? product.price_tier_1 : (product?.price || 25.00)))}
                  </p>
                  <p className="text-[7px] text-gray-400 mt-0.5">Base wholesale</p>
                </div>
                <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-xl p-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-yellow-500 text-[#0A1128] text-[6px] font-black px-1 py-0.5 rounded-bl-lg uppercase tracking-widest">15% OFF</div>
                  <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-wider">11 - 30 Units</p>
                  <p className="text-sm font-black text-yellow-400 mt-1">
                    {formatPrice(Number(product?.price_tier_2 !== undefined && product?.price_tier_2 !== null ? product.price_tier_2 : ((product?.price || 25.00) * 0.85)))}
                  </p>
                  <p className="text-[7px] text-gray-400 mt-0.5">Bulk Discount</p>
                </div>
                <div className="border border-green-500/20 bg-green-500/5 rounded-xl p-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-[6px] font-black px-1 py-0.5 rounded-bl-lg uppercase tracking-widest">30% OFF</div>
                  <p className="text-[9px] text-green-400 font-bold uppercase tracking-wider">31+ Units</p>
                  <p className="text-sm font-black text-green-400 mt-1">
                    {formatPrice(Number(product?.price_tier_3 !== undefined && product?.price_tier_3 !== null ? product.price_tier_3 : ((product?.price || 25.00) * 0.70)))}
                  </p>
                  <p className="text-[7px] text-gray-400 mt-0.5">Factory Direct</p>
                </div>
              </div>
            </div>

            {/* B2B Dynamic Logistics Shipping Timeline Calculator */}
            <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-[9px] font-black tracking-widest text-yellow-500 uppercase mb-3">🌐 {t("shipping_calculator_title")}</p>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <select 
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full appearance-none bg-[#0A1128]/60 border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition-colors"
                  >
                    {Object.entries(LOGISTICS_REGIONS).map(([key, region]) => (
                      <option key={key} value={key} className="bg-[#0A1128] text-white">
                        {region.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-yellow-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-wider">{t("production_lead_time")}</span>
                    <span className="text-white font-semibold">12–15 Business Days</span>
                  </div>
                  <div className="text-[10px] text-gray-500 italic mt-0.5 ml-1">Handcrafted & Quality Tested in Sialkot Factory</div>
                  
                  <div className="w-full h-[1px] bg-white/5 my-2" />
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-wider">{t("transit_time")}</span>
                    <span className="text-yellow-500 font-semibold">{LOGISTICS_REGIONS[selectedCountry].transitDays} Business Days</span>
                  </div>
                  <div className="text-[10px] text-gray-500 italic mt-0.5 ml-1">Premium Air Cargo via DHL Express / FedEx Priority</div>
                  
                  <div className="w-full h-[1px] bg-white/5 my-2" />
                  
                  <div className="flex justify-between items-center text-xs bg-yellow-500/5 p-2 rounded-lg border border-yellow-500/10">
                    <span className="text-yellow-500 font-extrabold uppercase tracking-widest">{t("total_delivery")}</span>
                    <span className="text-yellow-400 font-black text-sm">{LOGISTICS_REGIONS[selectedCountry].total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Brief Description */}
            <div className="text-gray-400 text-sm leading-relaxed mb-6 font-light line-clamp-3" dangerouslySetInnerHTML={{ __html: product?.description || "" }} />

            {/* Certified Steel Specifications */}
            <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm animate-in fade-in duration-300">
              <p className="text-[9px] font-black tracking-widest text-yellow-500 uppercase mb-3">🛠️ {t("certified_steel_specs")}</p>
              <div className="space-y-3">
                <div className="flex flex-col gap-1 text-xs pb-2 border-b border-white/5">
                  <span className="text-gray-400 font-bold uppercase tracking-wider">{t("material_label")}</span>
                  <span className="text-white font-medium">{t("material_value")}</span>
                </div>
                <div className="flex flex-col gap-1 text-xs pb-2 border-b border-white/5">
                  <span className="text-gray-400 font-bold uppercase tracking-wider">{t("hardness_label")}</span>
                  <span className="text-yellow-400 font-extrabold">{t("hardness_value")}</span>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider">{t("edge_label")}</span>
                  <span className="text-white font-medium">{t("edge_value")}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-white/10 mb-6" />

            {/* Variants Selectors - Contrast Fixed */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Size</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition-colors">
                    {product?.technical_specifications?.sizes?.map((size: string) => (
                      <option key={size} value={size} className="bg-[#0A1128] text-white dark:bg-[#0A1128] dark:text-white light:bg-white light:text-slate-900">{size}</option>
                    )) || (
                      <>
                        <option value="6.5" className="bg-[#0A1128] text-white dark:bg-[#0A1128] dark:text-white light:bg-white light:text-slate-900">6.5" Inch</option>
                        <option value="7.0" className="bg-[#0A1128] text-white dark:bg-[#0A1128] dark:text-white light:bg-white light:text-slate-900">7.0" Inch</option>
                        <option value="7.5" className="bg-[#0A1128] text-white dark:bg-[#0A1128] dark:text-white light:bg-white light:text-slate-900">7.5" Inch</option>
                      </>
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-yellow-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Color / Finish</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition-colors">
                    <option value="silver" className="bg-[#0A1128] text-white dark:bg-[#0A1128] dark:text-white light:bg-white light:text-slate-900">Mirror Polish Silver</option>
                    <option value="gold" className="bg-[#0A1128] text-white dark:bg-[#0A1128] dark:text-white light:bg-white light:text-slate-900">Rose Gold</option>
                    <option value="matte" className="bg-[#0A1128] text-white dark:bg-[#0A1128] dark:text-white light:bg-white light:text-slate-900">Matte Titanium</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-yellow-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-auto">
              <button 
                onClick={() => addToCart(product)}
                className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                {t("add_to_quote")}
              </button>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    addToCart(product);
                    router.push("/checkout");
                  }}
                  className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-yellow-500 border border-yellow-500 hover:bg-yellow-500/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer text-center"
                >
                  Request Bulk Quote
                </button>
                <button 
                  onClick={() => setIsSampleModalOpen(true)}
                  className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-gray-300 border border-white/20 hover:border-white/50 hover:bg-white/5 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer text-center"
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
                      : "border-white/10 text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/5"
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
                      ? "bg-yellow-500/10 border-yellow-500 text-yellow-400" 
                      : "border-white/10 text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/5"
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
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              <p className="text-xs text-gray-500 tracking-wider">Ships direct from Sialkot, Pakistan</p>
            </div>
          </div>
        </div>

        {/* ── Bottom Section: Tabbed Interface ── */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          {/* Tabs header */}
          <div className="flex border-b border-white/10">
            {["description", "specifications", "reviews"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-5 text-xs md:text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? "text-yellow-400 border-b-2 border-yellow-400 bg-white/5" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
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
                <h3 className="text-xl font-serif text-white mb-4 tracking-wide">The Masterpiece Standard</h3>
                <div className="text-gray-400 font-light leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: product?.description || "" }} />
                <p className="text-gray-400 font-light leading-relaxed">
                  Every instrument is hand-forged in Sialkot, bringing centuries of metallurgical heritage directly to your grooming salon. We focus on micron-level precision so you can focus on the art of grooming.
                </p>
              </div>
            )}
            
            {activeTab === "specifications" && (
              <div className="animate-in fade-in duration-500 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Steel Type</span>
                  <span className="text-white text-sm font-light">{product?.technical_specifications?.material || "Japanese J2 Steel"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Handle Style</span>
                  <span className="text-white text-sm font-light">{product?.technical_specifications?.handle || "Ergonomic Offset"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Blade Edge</span>
                  <span className="text-white text-sm font-light">{product?.technical_specifications?.edge || "Convex Micro-serrated"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Rockwell Hardness</span>
                  <span className="text-white text-sm font-light">HRC 60-61</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Tension System</span>
                  <span className="text-white text-sm font-light">Adjustable Gold Dial</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Origin</span>
                  <span className="text-white text-sm font-light">Sialkot, Pakistan</span>
                </div>
              </div>
            )}
            
            {activeTab === "reviews" && (
              <div className="animate-in fade-in duration-500 flex flex-col gap-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div>
                    <h3 className="text-xl font-serif text-white mb-2 tracking-wide">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(star => (
                          <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        ))}
                      </div>
                      <span className="text-white font-bold">5.0</span>
                      <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      router.push(`/product/${product.id}/write-review`);
                    }}
                    className="px-6 py-2.5 rounded-full border border-yellow-500 text-yellow-500 text-xs font-bold uppercase tracking-widest hover:bg-yellow-500/10 transition-all cursor-pointer"
                  >
                    Write a Review
                  </button>
                </div>
                
                {/* Dynamic Reviews List */}
                <div className="flex flex-col gap-6">
                  {reviews.map((rev, index) => (
                    <div key={index} className="border-b border-white/5 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-white font-bold tracking-wide block mb-1">{rev.name}</span>
                          <div className="flex text-yellow-400">
                            {Array.from({ length: rev.rating }).map((_, sIdx) => (
                              <svg key={sIdx} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            ))}
                          </div>
                        </div>
                        <span className="text-gray-500 text-xs font-light">{rev.date}</span>
                      </div>
                      <p className="text-gray-400 text-sm font-light leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Sample Request Modal */}
      {isSampleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-[#050814] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button 
              onClick={() => {
                setIsSampleModalOpen(false);
                setSampleSuccess(false);
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {sampleSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-serif text-white mb-4 tracking-wide">{t("sample_modal_title")}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {t("sample_success_msg")}
                </p>
                <button 
                  onClick={() => {
                    setIsSampleModalOpen(false);
                    setSampleSuccess(false);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-[#0A1128] font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSampleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif text-white mb-2 tracking-wide">{t("sample_modal_title")}</h3>
                  <p className="text-gray-400 text-xs font-light leading-relaxed">
                    {t("sample_modal_desc")}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{t("name_label")} *</label>
                    <input 
                      type="text" 
                      required
                      value={sampleName}
                      onChange={(e) => setSampleName(e.target.value)}
                      placeholder="e.g. Alexander Weber"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{t("company_label")} *</label>
                    <input 
                      type="text" 
                      required
                      value={sampleCompany}
                      onChange={(e) => setSampleCompany(e.target.value)}
                      placeholder="e.g. Grooming World GmbH"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{t("email_label")} *</label>
                    <input 
                      type="email" 
                      required
                      value={sampleEmail}
                      onChange={(e) => setSampleEmail(e.target.value)}
                      placeholder="e.g. weber@groomingworld.de"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{t("courier_acc_label")}</label>
                    <input 
                      type="text" 
                      value={sampleCourier}
                      onChange={(e) => setSampleCourier(e.target.value)}
                      placeholder="e.g. DHL-98234-AX / FEDEX-7823-QP"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                  <p className="text-[10px] text-yellow-500/90 font-light leading-relaxed">
                    {t("sample_disclaimer")}
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={isSampleSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-[#0A1128] font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
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
