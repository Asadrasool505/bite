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

// Presets strictly calibrated to user's exact preferred values:
// 1. Near Screw (RECOMMENDED DEFAULT): X: 48.5%, Y: 49.5%, Scale: 0.42x, Rotation: 0°
// 2. Blade Base: X: 61%, Y: 49.5%, Scale: 0.44x, Rotation: -1°
// 3. Mid Blade: X: 71%, Y: 49.5%, Scale: 0.44x, Rotation: -2°
const POSITION_PRESETS = [
  {
    id: "near-screw",
    name: "Near Screw",
    tag: "Recommended",
    x: 48.5,
    y: 49.5,
    scale: 0.42,
    rotation: 0,
    description: "Subtle emblem placement on handle shank",
  },
  {
    id: "blade-base",
    name: "Blade Base",
    tag: "Standard",
    x: 61,
    y: 49.5,
    scale: 0.44,
    rotation: -1,
    description: "Flat blade area right beside pivot screw",
  },
  {
    id: "mid-blade",
    name: "Mid Blade",
    tag: "Prominent",
    x: 71,
    y: 49.5,
    scale: 0.44,
    rotation: -2,
    description: "Centered placement along upper blade",
  },
];

// Authentic Laser Engraving Finish Modes (Default: Silver Highlight on Black Finish)
const ENGRAVING_MODES = [
  {
    id: "silver-emboss",
    name: "Silver Highlight",
    styleClass: "grayscale brightness-150 contrast-200 opacity-90 mix-blend-overlay",
    canvasFilter: "grayscale(100%) brightness(1.5) contrast(2) opacity(0.9)",
    description: "Bright metallic silver laser highlight effect",
  },
  {
    id: "laser-grey",
    name: "Laser Grey",
    styleClass: "grayscale brightness-75 contrast-140 opacity-85 mix-blend-multiply",
    canvasFilter: "grayscale(100%) brightness(0.75) contrast(1.4) opacity(0.85)",
    description: "Authentic metallic steel grey laser burn etching",
  },
  {
    id: "original",
    name: "Full Color",
    styleClass: "drop-shadow-sm opacity-90",
    canvasFilter: "none",
    description: "Original uploaded logo colors",
  },
];

// Instant Canvas-Based Background Remover (< 15ms execution)
function instantRemoveBackground(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      if (data[3] < 20) {
        resolve(imageSrc);
        return;
      }

      const tolerance = 45;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
        if (diff < tolerance) {
          data[i + 3] = 0;
        } else if (diff < tolerance * 1.6) {
          const alphaFraction = (diff - tolerance) / (tolerance * 0.6);
          data[i + 3] = Math.floor(data[i + 3] * alphaFraction);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

export default function CustomBrandingPage() {
  const { t } = useApp();

  // Default finish: Matte Black (FINISHES[1])
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[1]);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Default preset: Near Screw (POSITION_PRESETS[0])
  const [selectedPreset, setSelectedPreset] = useState("near-screw");
  const [engravingMode, setEngravingMode] = useState(ENGRAVING_MODES[0]);

  // Exact preferred default values matching user's Near Screw screenshot
  const [logoScale, setLogoScale] = useState(0.42);
  const [logoX, setLogoX] = useState(48.5); // percentage
  const [logoY, setLogoY] = useState(49.5); // percentage
  const [logoRotation, setLogoRotation] = useState(0); // degrees
  const [logoInvert, setLogoInvert] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processLogoFile = async (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload an image file (PNG, JPG, JPEG, WebP, or SVG).");
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const rawSrc = event.target.result as string;
        
        const processedSrc = await instantRemoveBackground(rawSrc);
        setLogoSrc(processedSrc);

        // Apply default Recommended preset: Near Screw
        applyPreset(POSITION_PRESETS[0]);
        setEngravingMode(ENGRAVING_MODES[0]);
        setIsProcessing(false);

        if (file.type !== "image/png" || file.size > 200000) {
          try {
            const { removeBackground } = await import("@imgly/background-removal");
            const blob = await removeBackground(file);
            const aiProcessedUrl = URL.createObjectURL(blob);
            setLogoSrc(aiProcessedUrl);
          } catch (err) {
            console.warn("AI background refinement bypassed, using instant canvas result:", err);
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const applyPreset = (preset: typeof POSITION_PRESETS[0]) => {
    setSelectedPreset(preset.id);
    setLogoX(preset.x);
    setLogoY(preset.y);
    setLogoScale(preset.scale);
    setLogoRotation(preset.rotation);
  };

  const handleManualAdjust = (setter: (val: number) => void, val: number) => {
    setSelectedPreset("custom");
    setter(val);
  };

  const clearLogo = () => {
    setLogoSrc(null);
    setSelectedPreset("near-screw");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadMockup = () => {
    if (!logoSrc) return;
    setDownloading(true);

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setDownloading(false);
      return;
    }

    const baseImg = new Image();
    baseImg.crossOrigin = "anonymous";
    baseImg.src = "/assets/clean-shear.png";

    baseImg.onload = () => {
      ctx.clearRect(0, 0, 1200, 1200);

      ctx.filter = selectedFinish.canvasFilter || "none";
      ctx.drawImage(baseImg, 0, 0, 1200, 1200);

      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = logoSrc;
      logoImg.onload = () => {
        ctx.save();

        const x = 1200 * (logoX / 100);
        const y = 1200 * (logoY / 100);
        ctx.translate(x, y);
        ctx.rotate((logoRotation * Math.PI) / 180);

        let filterString = engravingMode.canvasFilter;
        if (logoInvert) {
          filterString = filterString === "none" ? "invert(100%)" : `${filterString} invert(100%)`;
        }
        ctx.filter = filterString;

        const baseHeight = 100 * logoScale;
        const aspect = logoImg.width / logoImg.height;
        const baseWidth = baseHeight * aspect;

        ctx.drawImage(logoImg, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);

        ctx.restore();

        const link = document.createElement("a");
        link.download = `bite-oem-${selectedFinish.id}-laser-engraved-mockup.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setDownloading(false);
      };

      logoImg.onerror = () => {
        setDownloading(false);
        alert("Failed to render custom logo on mockup canvas.");
      };
    };

    baseImg.onerror = () => {
      setDownloading(false);
      alert("Failed to load baseline scissor image.");
    };
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-slate-100 pt-28 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 uppercase tracking-widest mb-3">
            {t("oem_title")}
          </h1>
          <p className="text-gray-400 text-sm font-light tracking-wide max-w-xl mx-auto">
            Upload your brand logo. Instant background removal and laser-engraving alignment directly on the scissor blade.
          </p>
          <div className="mx-auto w-24 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50 mt-4" />
        </div>

        {/* Main Grid: Left Preview Box, Right Control Panel Facing Each Other */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Scissor Preview Frame */}
          <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[480px] lg:sticky lg:top-28 shadow-2xl">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 to-transparent pointer-events-none" />

            {/* Scissor Mockup Container */}
            <div className="relative w-full max-w-xl aspect-square flex items-center justify-center p-4 bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
              {/* Base Scissor Image with default Matte Black finish */}
              <img
                src="/assets/clean-shear.png"
                alt="Bite Instruments OEM Scissor Mockup"
                className={`w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] transition-all duration-500 ${selectedFinish.filterClass} ${selectedFinish.glowClass}`}
              />

              {/* Dynamic Overlaying Logo Constrained inside Blade Boundaries */}
              {logoSrc && !isProcessing && (
                <div
                  className="absolute pointer-events-none flex items-center justify-center"
                  style={{
                    left: `${logoX}%`,
                    top: `${logoY}%`,
                    transform: `translate(-50%, -50%) rotate(${logoRotation}deg) scale(${logoScale})`,
                    maxHeight: "36px",
                    maxWidth: "140px",
                    transition: "left 0.1s ease-out, top 0.1s ease-out, transform 0.1s ease-out",
                  }}
                >
                  <img
                    src={logoSrc}
                    alt="Uploaded OEM Logo"
                    className={`max-h-full max-w-full object-contain ${engravingMode.styleClass} ${
                      logoInvert ? "invert" : ""
                    }`}
                  />
                </div>
              )}

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20">
                  <div className="w-12 h-12 mb-3 rounded-full border-4 border-yellow-500/20 border-t-yellow-400 animate-spin" />
                  <span className="text-white text-xs font-bold tracking-wider uppercase mb-1">
                    Removing Background...
                  </span>
                  <span className="text-gray-400 text-[11px] font-light">
                    Auto-fitting logo onto scissor blade
                  </span>
                </div>
              )}
            </div>

            {/* Empty state overlay prompt */}
            {!logoSrc && !isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-3xl p-6 text-center pointer-events-none">
                <div className="max-w-xs">
                  <div className="w-12 h-12 rounded-full border border-yellow-500/30 flex items-center justify-center mx-auto mb-3 bg-yellow-500/10 text-yellow-400">
                    <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-gray-200 text-sm font-medium mb-1">Upload Your Logo</p>
                  <p className="text-gray-400 text-xs font-light">
                    Upload logo on the right. Background is removed instantly and mark is auto-fitted near screw.
                  </p>
                </div>
              </div>
            )}

            {/* Download Mockup Button */}
            {logoSrc && !isProcessing && (
              <button
                disabled={downloading}
                onClick={downloadMockup}
                className="mt-6 px-8 py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-xs text-[#0A1128] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 hover:shadow-[0_10px_25px_rgba(250,204,21,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {downloading ? "Generating High-Res Mockup..." : "Download OEM Laser Mockup"}
              </button>
            )}
          </div>

          {/* Right Column: OEM Control Panel Directly Facing Preview */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* TOP PANEL: Fine-Tuning Controls & Presets (Appears at TOP when Logo active) */}
            {logoSrc && !isProcessing && (
              <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-yellow-400/40 rounded-3xl p-5 shadow-2xl space-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚙️</span> Fine-Tune Logo Position & Size
                  </h3>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Real-Time Adjust</span>
                </div>

                {/* Fine-Tuning Controls with (+) and (-) Stepper Buttons */}
                <div className="space-y-2.5">

                  {/* Size / Scale Stepper */}
                  <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-2xl space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase text-slate-300">
                      <span>Logo Size (Blade Scale)</span>
                      <span className="text-yellow-400 font-mono text-xs">{logoScale.toFixed(2)}x</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleManualAdjust(setLogoScale, Math.max(0.1, parseFloat((logoScale - 0.02).toFixed(2))))}
                        className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-yellow-400 text-yellow-400 font-black flex items-center justify-center text-base active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.01"
                        value={logoScale}
                        onChange={(e) => handleManualAdjust(setLogoScale, parseFloat(e.target.value))}
                        className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleManualAdjust(setLogoScale, Math.min(1.0, parseFloat((logoScale + 0.02).toFixed(2))))}
                        className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-yellow-400 text-yellow-400 font-black flex items-center justify-center text-base active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Position (X) Stepper */}
                  <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-2xl space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase text-slate-300">
                      <span>Horizontal Position (X)</span>
                      <span className="text-yellow-400 font-mono text-xs">{logoX}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleManualAdjust(setLogoX, Math.max(20, parseFloat((logoX - 0.5).toFixed(1))))}
                        className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-yellow-400 text-yellow-400 font-black flex items-center justify-center text-base active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="20"
                        max="85"
                        step="0.5"
                        value={logoX}
                        onChange={(e) => handleManualAdjust(setLogoX, parseFloat(e.target.value))}
                        className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleManualAdjust(setLogoX, Math.min(85, parseFloat((logoX + 0.5).toFixed(1))))}
                        className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-yellow-400 text-yellow-400 font-black flex items-center justify-center text-base active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Vertical Position (Y) Stepper */}
                  <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-2xl space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase text-slate-300">
                      <span>Vertical Position (Y)</span>
                      <span className="text-yellow-400 font-mono text-xs">{logoY.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleManualAdjust(setLogoY, Math.max(35, parseFloat((logoY - 0.5).toFixed(1))))}
                        className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-yellow-400 text-yellow-400 font-black flex items-center justify-center text-base active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="35"
                        max="65"
                        step="0.5"
                        value={logoY}
                        onChange={(e) => handleManualAdjust(setLogoY, parseFloat(e.target.value))}
                        className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleManualAdjust(setLogoY, Math.min(65, parseFloat((logoY + 0.5).toFixed(1))))}
                        className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-yellow-400 text-yellow-400 font-black flex items-center justify-center text-base active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Rotation Stepper */}
                  <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-2xl space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase text-slate-300">
                      <span>Rotation Angle</span>
                      <span className="text-yellow-400 font-mono text-xs">{logoRotation}°</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleManualAdjust(setLogoRotation, Math.max(-180, logoRotation - 1))}
                        className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-yellow-400 text-yellow-400 font-black flex items-center justify-center text-base active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={logoRotation}
                        onChange={(e) => handleManualAdjust(setLogoRotation, parseInt(e.target.value))}
                        className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleManualAdjust(setLogoRotation, Math.min(180, logoRotation + 1))}
                        className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-yellow-400 text-yellow-400 font-black flex items-center justify-center text-base active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                </div>

                {/* 1-Click Alignment Presets */}
                <div className="pt-2 border-t border-slate-800">
                  <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>🎯</span> Quick Placement Presets
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {POSITION_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset)}
                        className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          selectedPreset === preset.id
                            ? "border-yellow-400 bg-yellow-400/10 text-slate-100 shadow-[0_0_12px_rgba(250,204,21,0.15)]"
                            : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-0.5">
                          <span className="text-[11px] font-bold">{preset.name}</span>
                          <span
                            className={`text-[7px] font-black uppercase px-1 py-0.2 rounded ${
                              preset.tag === "Recommended"
                                ? "bg-yellow-400 text-slate-950"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {preset.tag}
                          </span>
                        </div>
                        <span className="text-[8px] font-light text-slate-400 leading-tight block">
                          {preset.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Engraving Style Modes & Invert */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Style:</span>
                    <div className="grid grid-cols-3 gap-1 flex-1">
                      {ENGRAVING_MODES.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => setEngravingMode(mode)}
                          className={`py-1 px-1.5 rounded-lg border text-[8px] font-bold uppercase tracking-wider transition-all text-center cursor-pointer ${
                            engravingMode.id === mode.id
                              ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                              : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {mode.name.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setLogoInvert(!logoInvert)}
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer shrink-0 ${
                      logoInvert
                        ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                        : "border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {logoInvert ? "Tone: Inverted" : "Tone: Normal"}
                  </button>
                </div>

              </div>
            )}

            {/* Panel 2: Logo Upload */}
            <div
              className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-yellow-400">📁</span> Upload Brand Logo
              </h3>

              {!logoSrc ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-yellow-400/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/70 transition-all text-center"
                >
                  <svg className="w-8 h-8 text-yellow-400/80 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-slate-200 font-bold block mb-0.5">Click or Drag & Drop Logo</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-light block">PNG, JPG, JPEG, WebP, SVG</span>
                  <span className="mt-2 inline-block px-2.5 py-0.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-full text-[9px] font-semibold">⚡ Auto Laser-Silver Highlight Engraving</span>
                </div>
              ) : (
                <div className="flex items-center justify-between border border-slate-800 rounded-2xl p-3 bg-slate-950/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 p-1 flex items-center justify-center overflow-hidden">
                      <img src={logoSrc} alt="Preview Logo Thumbnail" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-100 font-bold block">Logo Active</span>
                      <span className="text-[9px] text-yellow-400 uppercase tracking-widest block font-medium font-mono">Near Screw (Recommended)</span>
                    </div>
                  </div>
                  <button
                    onClick={clearLogo}
                    className="px-3 py-1.5 border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-white rounded-xl transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Change Logo
                  </button>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Panel 3: Color Finishes */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-yellow-400">✨</span> {t("choose_finish")}
              </h3>
              <div className="grid grid-cols-4 gap-2.5 mb-2">
                {FINISHES.map((finish) => (
                  <button
                    key={finish.id}
                    onClick={() => setSelectedFinish(finish)}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer ${
                      selectedFinish.id === finish.id
                        ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(250,204,21,0.2)]"
                        : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full shadow-inner border border-white/20 mb-1"
                      style={{ background: finish.colorCode }}
                    />
                    <span className="text-[8px] uppercase tracking-widest text-slate-300 text-center truncate w-full font-bold">
                      {finish.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-yellow-400/80 font-light italic text-center">
                {selectedFinish.description}
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}