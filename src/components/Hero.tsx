"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const bgImages = [
  "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1974&auto=format&fit=crop", // Dog looking up
  "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2071&auto=format&fit=crop", // Fluffy dog
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2068&auto=format&fit=crop", // Grooming dog
  "https://images.unsplash.com/photo-1719464454959-9cf304ef4774?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  // Close up pet
];

const fgImages = [
  "https://plus.unsplash.com/premium_photo-1663036401821-d60fe33f066f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Professional tools
  "https://plus.unsplash.com/premium_photo-1663036405014-3b4f2713633c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Cat
  "https://plus.unsplash.com/premium_photo-1664297694687-570b7f392906?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Shears
  "https://plus.unsplash.com/premium_photo-1664303963727-48c2aee9485e?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  // Cute kitten
];

export default function Hero() {
  const [bgIndex, setBgIndex] = useState(0);
  const [fgIndex, setFgIndex] = useState(0);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 6000); // Slow Ken Burns background

    const fgInterval = setInterval(() => {
      setFgIndex((prev) => (prev + 1) % fgImages.length);
    }, 3000); // Fast snappy foreground

    return () => {
      clearInterval(bgInterval);
      clearInterval(fgInterval);
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-[#0A1128]">

      {/* Background Layer: Ken Burns Image Slider */}
      {bgImages.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 w-full h-full z-0"
          style={{
            opacity: index === bgIndex ? 1 : 0,
            transition: index === bgIndex
              ? "opacity 2s ease-in-out"
              : "opacity 2s ease-in-out",
          }}
        >
          <img
            src={src}
            alt="Background"
            className="w-full h-full object-cover"
            style={{
              transform: index === bgIndex ? "scale(1.15)" : "scale(1)",
              transition: index === bgIndex
                ? "transform 12s ease-out"
                : "transform 12s linear",
            }}
          />
        </div>
      ))}

      {/* Dark Navy Overlay */}
      <div className="absolute inset-0 bg-[#0A1128]/60 z-0"></div>

      {/* Dual Layer Content */}
      <div className="z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12 w-full pt-16 gap-16">

        {/* Left Side: Text & Buttons */}
        <div className="flex-1 flex flex-col items-start justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 leading-tight">
            Masterpiece Shears for Master Groomers
          </h1>
          <p className="text-sm md:text-lg opacity-95 max-w-lg text-left text-gray-100 mb-10 font-light tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Hand-crafted Japanese J2 Steel pet grooming instruments directly from Sialkot. Precision redefined.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="#collection" className="px-7 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600">
              Explore Collection
            </Link>
            <Link href="#contact" className="px-7 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:bg-yellow-500 hover:text-[#0A1128] text-yellow-500 border border-yellow-500 bg-transparent">
              Request Quote
            </Link>
          </div>
        </div>

        {/* Right Side: Foreground Animation Gallery */}
        <div className="w-full max-w-sm lg:w-1/3 aspect-[4/5] relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-yellow-500/20">
          {fgImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="Gallery highlight"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700`}
              style={{
                opacity: idx === fgIndex ? 1 : 0,
                transform: idx === fgIndex ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // satisfying bounce effect
              }}
            />
          ))}
          {/* Subtle inner gradient to frame the gallery images */}
          <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none"></div>
        </div>

      </div>
    </section>
  );
}
