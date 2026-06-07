"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";
import SearchOverlay from "@/components/SearchOverlay";
import FavoritesDrawer from "@/components/FavoritesDrawer";
import CompareDrawer from "@/components/CompareDrawer";
import AuthModal from "@/components/AuthModal";
import CatalogueModal from "@/components/CatalogueModal";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  // State hooks
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/logo.png");
  const [currentLang, setCurrentLang] = useState("en");

  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const {
    favorites,
    compareList,
    favoritesOpen,
    setFavoritesOpen,
    compareOpen,
    setCompareOpen,
    theme,
    toggleTheme,
    user,
    signOut,
    t,
    catalogueOpen,
    setCatalogueOpen,
  } = useApp();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Google Translate integration
  // Google Translate integration
  useEffect(() => {
    // 1. Initialize the global Google Translate function cleanly
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ar,ru,de,zh,ja,es,fr,it,pt,tr,nl,ko,pl,sv,vi,ro',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    };

    // 2. Dynamically load the external core translation SDK script if missing
    if (!document.getElementById('google-translate-sdk-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-sdk-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const activeTrans = getCookie("googtrans");
    const activeLang = activeTrans ? activeTrans.split("/").pop() : "en";
    setCurrentLang(activeLang || "en");

    // Explicit fallback binding for raw DOM elements
    const deskSelect = document.getElementById("custom-language-selector") as HTMLSelectElement;
    if (deskSelect) deskSelect.value = activeLang || "en";

    const mobSelect = document.getElementById("mobile-custom-language-selector") as HTMLSelectElement;
    if (mobSelect) mobSelect.value = activeLang || "en";

    // 4. Update logoSrc to prevent broken image on initial SSR
    setLogoSrc("/assets/logo.png");
  }, [mobileMenuOpen]); // Evaluates upon viewport state alteration

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetLang = e.target.value;
    if (!targetLang) return;
    setCurrentLang(targetLang);

    if (targetLang === "en") {
      const domains = [window.location.hostname, `.${window.location.hostname}`, ""];
      domains.forEach((domain) => {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domain ? ` domain=${domain};` : ""}`;
        document.cookie = `googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domain ? ` domain=${domain};` : ""}`;
      });
      window.sessionStorage.removeItem("googtrans");
      window.localStorage.removeItem("googtrans");
      window.location.href = window.location.origin + window.location.pathname;
      return;
    }

    document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${targetLang}; path=/;`;
    window.location.hash = `#googtrans(en|${targetLang})`;

    const googleCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (googleCombo) {
      googleCombo.value = targetLang;
      googleCombo.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };
  return (
    <>
      {/* ================= TOP PROMO ANNOUNCEMENT BAR (CONTINUOUS ATTENTION LOOP) ================= */}
      <div
        className="w-full bg-[#5c6170] text-white text-[10px] md:text-xs font-bold uppercase tracking-widest text-center py-1 px-4 select-none shrink-0 border-none outline-none notranslate animate-pulse [animation-duration:3s]"
        translate="no"
      >
        Enjoy Free Worldwide Shipping On All Orders Over $250!
      </div>

      <header className="w-full relative z-50">
        {/* ================= ROW 1: GOLD TOPBAR (Minimalist & Centered) ================= */}
        <div className="bg-yellow-600 text-white w-full px-4 py-1 flex items-center justify-center border-b border-white/10 shadow-inner">
          <div className="flex items-center justify-center gap-4 sm:gap-6 max-w-screen-xl w-full">

            {/* Interaction Icons Block */}
            <div className="flex items-center justify-center gap-4 sm:gap-5 flex-nowrap shrink-0 text-white">
              {/* Search */}
              <button onClick={() => setSearchOpen(true)} aria-label="Open search" className="p-1 md:p-1.5 rounded-full transition-colors hover:bg-white/10 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
              {/* Compare */}
              <button onClick={() => setCompareOpen(true)} aria-label="Open comparison matrix" className="p-1 md:p-1.5 rounded-full transition-colors hover:bg-white/10 cursor-pointer relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M12 5.25L4.5 9m7.5-3.75L19.5 9M4.5 9h15M7.5 9v5.25a4.5 4.5 0 009 0V9M12 21H3.75m16.5 0H12" />
                </svg>
                {compareList.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-black bg-yellow-400 leading-none px-1 animate-pulse border border-[#d4af37]">
                    {compareList.length}
                  </span>
                )}
              </button>
              {/* Wishlist */}
              <button onClick={() => setFavoritesOpen(true)} aria-label="Open wishlist drawer" className="p-1 md:p-1.5 rounded-full transition-colors hover:bg-white/10 cursor-pointer relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-black bg-yellow-400 leading-none px-1 border border-[#d4af37]">
                    {favorites.length}
                  </span>
                )}
              </button>
              {/* Cart */}
              <button onClick={() => setCartOpen(true)} aria-label="Open quote cart" className="relative p-1 md:p-1.5 rounded-full transition-colors hover:bg-white/10 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-black bg-yellow-400 leading-none px-1 border border-[#d4af37]">
                    {cartCount}
                  </span>
                )}
              </button>
              {/* Profile */}
              <button onClick={() => setAuthOpen(true)} aria-label="Open sign‑in modal" className="p-1 md:p-1.5 rounded-full transition-colors hover:bg-white/10 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </button>
            </div>

            {/* Slogan Divider Line */}
            <div className="h-4 w-[1px] bg-white/30 shrink-0" />

            {/* Language Dropdown Container */}
            <div className="shrink-0 min-w-[90px] sm:min-w-[110px] notranslate" translate="no">
              <select
                id="custom-language-selector"
                value={currentLang}
                onChange={handleLanguageChange}
                className="notranslate bg-transparent border border-white/20 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none cursor-pointer w-full text-center bg-yellow-600 appearance-none"
                translate="no"
              >
                <option value="en" className="notranslate bg-neutral-800 text-white" translate="no">English</option>
                <option value="ar" className="notranslate bg-neutral-800 text-white" translate="no">العربية</option>
                <option value="ru" className="notranslate bg-neutral-800 text-white" translate="no">Русский</option>
                <option value="de" className="notranslate bg-neutral-800 text-white" translate="no">Deutsch</option>
                <option value="zh" className="notranslate bg-neutral-800 text-white" translate="no">中文</option>
                <option value="ja" className="notranslate bg-neutral-800 text-white" translate="no">日本語</option>
                <option value="es" className="notranslate bg-neutral-800 text-white" translate="no">Español</option>
                <option value="fr" className="notranslate bg-neutral-800 text-white" translate="no">Français</option>
                <option value="it" className="notranslate bg-neutral-800 text-white" translate="no">Italiano</option>
                <option value="pt" className="notranslate bg-neutral-800 text-white" translate="no">Português</option>
                <option value="tr" className="notranslate bg-neutral-800 text-white" translate="no">Türkçe</option>
                <option value="nl" className="notranslate bg-neutral-800 text-white" translate="no">Nederlands</option>
                <option value="ko" className="notranslate bg-neutral-800 text-white" translate="no">한국어</option>
                <option value="pl" className="notranslate bg-neutral-800 text-white" translate="no">Polski</option>
                <option value="sv" className="notranslate bg-neutral-800 text-white" translate="no">Svenska</option>
                <option value="vi" className="notranslate bg-neutral-800 text-white" translate="no">Tiếng Việt</option>
                <option value="ro" className="notranslate bg-neutral-800 text-white" translate="no">Română</option>
              </select>
            </div>

          </div>
        </div>

        {/* ================= ROW 2: ASH-WHITE MAIN NAVBAR ================= */}
        <div className="bg-white border-b border-gray-100 w-full px-4 md:px-8 flex items-center justify-between h-12 md:h-12 shadow-sm">

          {/* Left wrapper block: Houses Mobile Hamburger and Brand Logo in unified flex layout */}
          <div className="flex items-center gap-2 md:gap-0 shrink-0">
            {/* Left Element: Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-gray-700 block md:hidden shrink-0 focus:outline-none rounded hover:bg-gray-100"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Brand Assets Layer (Displays Logo Only per reference pic) */}
            <Link href="/" className="flex items-center shrink-0 max-h-full">
              <img
                src={logoSrc}
                alt="Bite Instruments"
                className="h-7 w-auto md:h-10 object-contain transition-transform duration-200 hover:scale-105"
                onError={(e) => {
                  if (e.currentTarget.src.includes('assets')) {
                    e.currentTarget.style.display = 'none';
                  } else {
                    e.currentTarget.src = '/assets/logo.png';
                  }
                }}
              />
            </Link>
          </div>

          {/* Desktop Links Grid (STRICTLY HIDDEN ON MOBILE) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold text-gray-800 tracking-wider">
            <Link href="/" className="hover:text-[#d4af37] transition-colors uppercase">Home</Link>

            {/* Pet Grooming hover dropdown */}
            <div className="relative group py-4">
              <button className="flex items-center gap-1 hover:text-[#d4af37] font-semibold transition-colors focus:outline-none uppercase">
                Pet Grooming
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg py-3 w-56 border border-gray-100 hidden group-hover:block transition-all duration-200 z-50">
                <Link href="/pet-nail-cutters" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-[#d4af37] font-medium">Nail Cutters</Link>
                <Link href="/pet-combs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-[#d4af37] font-medium">Pet Combs</Link>
                <Link href="/curved-scissors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-[#d4af37] font-medium">Curved Scissors</Link>
                <Link href="/blenders-thinning-scissors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-[#d4af37] font-medium">Blenders & Thinners</Link>
                <Link href="/pet-straight-scissors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-[#d4af37] font-medium">Straight Scissors</Link>
              </div>
            </div>

            <Link href="/pet-grooming-kits" className="hover:text-[#d4af37] transition-colors uppercase">Pet Grooming Kits</Link>
            <Link href="/blog" className="hover:text-[#d4af37] transition-colors uppercase">Blog</Link>
            <Link href="/about" className="hover:text-[#d4af37] transition-colors uppercase">About</Link>
            <Link href="/contact" className="hover:text-[#d4af37] transition-colors uppercase">Contact</Link>
          </nav>

          {/* Request Quote Button (Capsule design in gradient gold) */}
          <Link
            href="/checkout"
            className="flex items-center justify-center px-2.5 py-1 md:px-4.5 md:py-1.5 rounded-full font-bold uppercase tracking-widest text-[8px] md:text-[10px] text-[#0A1128] bg-gradient-to-r from-yellow-100 via-[#d4af37] to-yellow-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.6)]"
          >
            Request Quote
          </Link>

        </div>

      </header>

      {/* Mobile Menu Drawer (Completely isolated from primary header) */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full h-[calc(100vh-64px)] bg-white z-40 block md:hidden overflow-y-auto animate-fadeIn border-t border-gray-100">
          <div className="px-6 py-8 space-y-5 font-semibold text-gray-900 text-lg">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block border-b pb-2">Home</Link>

            {/* Pet Grooming sub-links in mobile */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest block">Pet Grooming</span>
              <div className="grid grid-cols-2 gap-3 pl-2">
                <Link href="/pet-nail-cutters" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 hover:text-[#d4af37] font-medium">Nail Cutters</Link>
                <Link href="/pet-combs" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 hover:text-[#d4af37] font-medium">Pet Combs</Link>
                <Link href="/curved-scissors" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 hover:text-[#d4af37] font-medium">Curved Scissors</Link>
                <Link href="/blenders-thinning-scissors" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 hover:text-[#d4af37] font-medium">Blenders & Thinners</Link>
                <Link href="/pet-straight-scissors" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 hover:text-[#d4af37] font-medium">Straight Scissors</Link>
              </div>
            </div>

            <Link href="/pet-grooming-kits" onClick={() => setMobileMenuOpen(false)} className="block border-b pb-2">Pet Grooming Kits</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block border-b pb-2">Blog</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block border-b pb-2">About</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block border-b pb-2">Contact</Link>

            {/* Mobile Language Selector */}
            <div className="border-t border-b py-4 space-y-2">
              <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest block">Language</span>
              <div className="shrink-0 min-w-[90px] sm:min-w-[110px] notranslate" translate="no">
                <select
                  id="mobile-custom-language-selector"
                  value={currentLang}
                  onChange={handleLanguageChange}
                  className="notranslate bg-transparent border border-white/20 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none cursor-pointer w-full text-center bg-yellow-600 appearance-none"
                  translate="no"
                >
                  <option value="en" className="notranslate bg-neutral-800 text-white" translate="no">English</option>
                  <option value="ar" className="notranslate bg-neutral-800 text-white" translate="no">العربية</option>
                  <option value="ru" className="notranslate bg-neutral-800 text-white" translate="no">Русский</option>
                  <option value="de" className="notranslate bg-neutral-800 text-white" translate="no">Deutsch</option>
                  <option value="zh" className="notranslate bg-neutral-800 text-white" translate="no">中文</option>
                  <option value="ja" className="notranslate bg-neutral-800 text-white" translate="no">日本語</option>
                  <option value="es" className="notranslate bg-neutral-800 text-white" translate="no">Español</option>
                  <option value="fr" className="notranslate bg-neutral-800 text-white" translate="no">Français</option>
                  <option value="it" className="notranslate bg-neutral-800 text-white" translate="no">Italiano</option>
                  <option value="pt" className="notranslate bg-neutral-800 text-white" translate="no">Português</option>
                  <option value="tr" className="notranslate bg-neutral-800 text-white" translate="no">Türkçe</option>
                  <option value="nl" className="notranslate bg-neutral-800 text-white" translate="no">Nederlands</option>
                  <option value="ko" className="notranslate bg-neutral-800 text-white" translate="no">한국어</option>
                  <option value="pl" className="notranslate bg-neutral-800 text-white" translate="no">Polski</option>
                  <option value="sv" className="notranslate bg-neutral-800 text-white" translate="no">Svenska</option>
                  <option value="vi" className="notranslate bg-neutral-800 text-white" translate="no">Tiếng Việt</option>
                  <option value="ro" className="notranslate bg-neutral-800 text-white" translate="no">Română</option>
                </select>
              </div>
            </div>

            <Link href="/checkout" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-3 rounded-full font-bold uppercase tracking-widest text-xs text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600 mt-4">
              Request Quote
            </Link>
          </div>
        </div>
      )}

      {/* Overlays & Drawers */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <FavoritesDrawer open={favoritesOpen} onClose={() => setFavoritesOpen(false)} />
      <CompareDrawer open={compareOpen} onClose={() => setCompareOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <CatalogueModal open={catalogueOpen} onClose={() => setCatalogueOpen(false)} />

      {/* Google Translate placeholder */}
      <div id="google_translate_element" className="hidden" />

      {/* Global CSS to hide Google Translate banner */}
      <style jsx global>{`
        .skiptranslate { display: none !important; }
        body { top: 0px !important; }
      `}</style>
    </>
  );
}