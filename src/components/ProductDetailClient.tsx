"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductDetailClient({ product }: { product: any }) {
  const { addToCart } = useCart();
  // Use product.images array if available, otherwise fallback to single image
  const galleryImages = product?.images && product.images.length > 0 
    ? product.images 
    : [product?.image_url || product?.image || "/assets/placeholder.png"];

  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [activeTab, setActiveTab] = useState("description");
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
  
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
              <span className="text-gray-400 text-sm font-light">(48 Reviews)</span>
            </div>

            {/* Price */}
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 tracking-widest mb-6">
              ${product?.price?.toFixed(2) || "0.00"} <span className="text-xs text-gray-500 font-light tracking-normal uppercase ml-2">USD</span>
            </p>

            {/* Brief Description */}
            <div className="text-gray-400 text-sm leading-relaxed mb-8 font-light line-clamp-3" dangerouslySetInnerHTML={{ __html: product?.description || "" }} />

            {/* Divider */}
            <div className="w-full h-[1px] bg-white/10 mb-8" />

            {/* Variants */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Size</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition-colors">
                    {product?.technical_specifications?.sizes?.map((size: string) => (
                      <option key={size} value={size}>{size}</option>
                    )) || (
                      <>
                        <option value="6.5">6.5" Inch</option>
                        <option value="7.0">7.0" Inch</option>
                        <option value="7.5">7.5" Inch</option>
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
                    <option value="silver">Mirror Polish Silver</option>
                    <option value="gold">Rose Gold</option>
                    <option value="matte">Matte Titanium</option>
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
                className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Add to Quote
              </button>
              <button className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm text-yellow-500 border border-yellow-500 hover:bg-yellow-500/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                Request Bulk Quote
              </button>
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
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-serif text-white mb-2 tracking-wide">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(star => (
                          <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        ))}
                      </div>
                      <span className="text-white font-bold">5.0</span>
                      <span className="text-gray-500 text-sm">(48 reviews)</span>
                    </div>
                  </div>
                  <button className="px-6 py-2 rounded-full border border-yellow-500 text-yellow-500 text-xs font-bold uppercase tracking-widest hover:bg-yellow-500/10 transition-colors">
                    Write a Review
                  </button>
                </div>
                
                {/* Mock Review */}
                <div className="border-t border-white/10 pt-8 mt-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-white font-bold tracking-wide block mb-1">Emily R. - Master Groomer</span>
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(star => (
                          <svg key={star} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-600 text-xs font-light">October 12, 2025</span>
                  </div>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">
                    "These are without a doubt the best shears I've used in my 15-year career. The balance is incredible, and they came out of the box razor sharp. Buying direct wholesale from Bite Instruments has completely transformed our salon's profitability. Will be ordering the full set!"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
