"use client";

import { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";

const FINISHES = [
  {
    id: "satin-silver",
    name: "Satin Silver",
    colorCode: "#E2E8F0",
    filterClass: "brightness-100 contrast-100 saturate-50 sepia-0",
    canvasFilter: "brightness(1) contrast(1) saturate(0.5) sepia(0)",
    glowClass: "shadow-[0_0_20px_rgba(255,255,255,0.15)]",
    description: "Classic high-grade surgical stainless steel, satin finished.",
  },
  {
    id: "matte-black",
    name: "Matte Black",
    colorCode: "#1E293B",
    filterClass: "brightness-[0.3] contrast-125 saturate-0",
    canvasFilter: "brightness(0.3) contrast(1.25) saturate(0)",
    glowClass: "shadow-[0_0_20px_rgba(0,0,0,0.5)]",
    description: "Ultra-slick premium matte stealth black coating.",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    colorCode: "#FDA4AF",
    filterClass: "brightness-95 contrast-105 saturate-100 hue-rotate-[320deg] sepia-[0.35]",
    canvasFilter: "brightness(0.95) contrast(1.05) saturate(1) sepia(0.35)",
    glowClass: "shadow-[0_0_20px_rgba(251,113,133,0.3)]",
    description: "Elegant polished rose gold luxury plating.",
  },
  {
    id: "titanium-rainbow",
    name: "Titanium Rainbow",
    colorCode: "linear-gradient(135deg, #A855F7, #3B82F6, #10B981, #EAB308)",
    filterClass: "brightness-105 contrast-110 saturate-150 hue-rotate-[190deg] sepia-[0.1]",
    canvasFilter: "brightness(1.05) contrast(1.1) saturate(1.5) sepia(0.1)",
    glowClass: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    description: "Vibrant multi-color neo-chrome titanium anodized finish.",
  },
];

export default function CustomBrandingPage() {
  const { t } = useApp();
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0]);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(1.0);
  const [logoX, setLogoX] = useState(50); // percentage (0 - 100)
  const [logoY, setLogoY] = useState(40); // percentage (0 - 100)
  const [logoRotation, setLogoRotation] = useState(0); // degrees
  const [logoInvert, setLogoInvert] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "image/png") {
        alert("Please upload a transparent logo in PNG format.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== "image/png") {
        alert("Please upload a transparent logo in PNG format.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setLogoSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadMockup = () => {
    if (!logoSrc) return;
    setDownloading(true);

    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setDownloading(false);
      return;
    }

    const baseImg = new Image();
    baseImg.crossOrigin = "anonymous";
    baseImg.src = "/assets/clean-shear.png";

    baseImg.onload = () => {
      // 1. Clear offscreen canvas
      ctx.clearRect(0, 0, 800, 800);
      
      // 2. Draw clean straight baseline shear with active finish filters
      ctx.filter = selectedFinish.canvasFilter || "none";
      ctx.drawImage(baseImg, 0, 0, 800, 800);

      // 3. Draw overlay custom user logo
      const logoImg = new Image();
      logoImg.src = logoSrc;
      logoImg.onload = () => {
        ctx.save();
        
        // Translate offscreen canvas context to relative position center
        const x = 800 * (logoX / 100);
        const y = 800 * (logoY / 100);
        ctx.translate(x, y);
        
        // Apply precise rotation & logo scale shifts
        ctx.rotate((logoRotation * Math.PI) / 180);
        
        // Invert if active
        ctx.filter = logoInvert ? "invert(100%)" : "none";
        
        // Center size calculation matching preview aspects
        const size = 160 * logoScale;
        ctx.drawImage(logoImg, -size / 2, -size / 2, size, size);
        
        ctx.restore();

        // 4. Trigger browser file download
        const link = document.createElement("a");
        link.download = `oem-custom-${selectedFinish.id}-mockup.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setDownloading(false);
      };
      
      logoImg.onerror = () => {
        setDownloading(false);
        alert("Failed to load transparent logo image.");
      };
    };

    baseImg.onerror = () => {
      setDownloading(false);
      alert("Failed to load baseline scissor mockup asset.");
    };
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F5F7] pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 uppercase tracking-widest mb-4">
            {t("oem_title")}
          </h1>
          <p className="text-gray-400 text-sm font-light tracking-wide max-w-xl mx-auto">
            {t("oem_instructions")}
          </p>
          <div className="mx-auto w-24 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50 mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Interactive Preview Canvas */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-slate-200 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] shadow-2xl">
            {/* Ambient Background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 to-transparent pointer-events-none" />

            <div className="relative w-full max-w-md aspect-square flex items-center justify-center p-6 bg-white/40 border border-slate-100 rounded-2xl">
              
              {/* Scissor Mockup Base Image with Color Filter */}
              <img
                src="/assets/clean-shear.png"
                alt="Bite Instruments OEM Scissor Mockup"
                className={`w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-500 ${selectedFinish.filterClass} ${selectedFinish.glowClass}`}
              />

              {/* Dynamic Overlaying Logo */}
              {logoSrc && (
                <div
                  className="absolute pointer-events-none flex items-center justify-center"
                  style={{
                    left: `${logoX}%`,
                    top: `${logoY}%`,
                    transform: `translate(-50%, -50%) rotate(${logoRotation}deg) scale(${logoScale})`,
                    width: "80px",
                    height: "80px",
                    transition: "transform 0.05s ease-out, left 0.05s ease-out, top 0.05s ease-out",
                  }}
                >
                  <img
                    src={logoSrc}
                    alt="Uploaded OEM Logo"
                    className={`max-w-full max-h-full object-contain filter drop-shadow-md ${
                      logoInvert ? "invert" : ""
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Instruction tooltip in preview */}
            {!logoSrc && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-3xl p-6 text-center">
                <div className="max-w-xs">
                  <div className="w-12 h-12 rounded-full border border-yellow-500/30 flex items-center justify-center mx-auto mb-4 bg-yellow-500/10 text-yellow-400">
                    <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-sm font-medium mb-1">Preview Is Locked</p>
                  <p className="text-gray-500 text-xs font-light">Upload your transparent PNG logo on the right to project it on the scissor handle.</p>
                </div>
              </div>
            )}

            {/* Premium Download Mockup Button */}
            {logoSrc && (
              <button
                disabled={downloading}
                onClick={downloadMockup}
                className="mt-8 px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs text-[#0A1128] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 hover:shadow-[0_10px_25px_rgba(250,204,21,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {downloading ? "Generating Mockup..." : "Download OEM Preview"}
              </button>
            )}
          </div>

          {/* Right Column: OEM Control Panel */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Control Panel: Finishes */}
            <div className="bg-white/5 backdrop-blur-md border border-slate-200 rounded-3xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-yellow-500">✨</span> {t("choose_finish")}
              </h3>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {FINISHES.map((finish) => (
                  <button
                    key={finish.id}
                    onClick={() => setSelectedFinish(finish)}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-2 transition-all relative ${
                      selectedFinish.id === finish.id
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-slate-200 bg-white/50 hover:border-white/35"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full shadow-inner border border-white/20 mb-1"
                      style={{ background: finish.colorCode }}
                    />
                    <span className="text-[8px] uppercase tracking-widest text-gray-300 text-center truncate w-full font-bold">
                      {finish.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-yellow-500/80 font-light italic text-center">
                {selectedFinish.description}
              </p>
            </div>

            {/* Control Panel: Logo Upload */}
            <div
              className="bg-white/5 backdrop-blur-md border border-slate-200 rounded-3xl p-6 shadow-xl"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-yellow-500">📁</span> {t("upload_logo")}
              </h3>

              {!logoSrc ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500/50 hover:bg-white/5 transition-all text-center"
                >
                  <svg className="w-10 h-10 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-gray-300 font-bold block mb-1">Drag & Drop Logo Here</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-light block">or Click to Browse (PNG format only)</span>
                </div>
              ) : (
                <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-4 bg-white/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                      <img src={logoSrc} alt="Preview Logo Thumbnail" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <span className="text-xs text-white font-bold block">Logo Active</span>
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Transparent PNG</span>
                    </div>
                  </div>
                  <button
                    onClick={clearLogo}
                    className="p-2 border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/20 hover:text-white rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    Remove
                  </button>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/png"
                className="hidden"
              />
            </div>

            {/* Control Panel: Position Adjusters */}
            {logoSrc && (
              <div className="bg-white/5 backdrop-blur-md border border-slate-200 rounded-3xl p-6 shadow-xl space-y-5">
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="text-yellow-500">⚙️</span> Adjust Alignment
                </h3>

                {/* Scale */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
                    <span>Logo Scale</span>
                    <span className="text-yellow-500">{logoScale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="2.5"
                    step="0.05"
                    value={logoScale}
                    onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>

                {/* X Position */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
                    <span>Position Horizontal</span>
                    <span className="text-yellow-500">{logoX}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="1"
                    value={logoX}
                    onChange={(e) => setLogoX(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>

                {/* Y Position */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
                    <span>Position Vertical</span>
                    <span className="text-yellow-500">{logoY}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="1"
                    value={logoY}
                    onChange={(e) => setLogoY(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>

                {/* Rotation */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
                    <span>Rotation Angle</span>
                    <span className="text-yellow-500">{logoRotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={logoRotation}
                    onChange={(e) => setLogoRotation(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>

                {/* Logo color inversion */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Invert Logo Color (Black/White)</span>
                  <button
                    onClick={() => setLogoInvert(!logoInvert)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                      logoInvert 
                        ? "border-yellow-500 bg-yellow-500/10 text-yellow-500" 
                        : "border-slate-200 text-gray-400 hover:text-white"
                    }`}
                  >
                    {logoInvert ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}