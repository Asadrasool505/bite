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

    // 3. CRITICAL: Read active cookie on mount to set the correct visual select state in our dropdown
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const activeTrans = getCookie('googtrans');
    const selectEl = document.getElementById('custom-language-selector') as HTMLSelectElement;
    if (selectEl && activeTrans) {
      const currentLang = activeTrans.split('/').pop(); // Extract 'ar', 'de' etc.
      if (currentLang) selectEl.value = currentLang;
    } else if (selectEl) {
      selectEl.value = 'en';
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetLang = e.target.value;
    if (!targetLang) return;

    if (targetLang === 'en') {
      // Force wipe all active translation configurations cleanly
      const domains = [window.location.hostname, `.${window.location.hostname}`, ''];
      domains.forEach(domain => {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domain ? ` domain=${domain};` : ''}`;
        document.cookie = `googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domain ? ` domain=${domain};` : ''}`;
      });
      
      window.sessionStorage.removeItem('googtrans');
      window.localStorage.removeItem('googtrans');

      // Strip any translation hash from the URL and issue a hard reload to clean HTML baseline
      window.location.href = window.location.origin + window.location.pathname;
      return;
    }

    // Unconditional Hash Route injection to force Google's engine to switch contexts cleanly
    document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${targetLang}; path=/;`;
    window.location.hash = `#googtrans(en|${targetLang})`;
    
    // Trigger native combobox if already mounted, otherwise issue quick reload to parse state
    const googleCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleCombo) {
      googleCombo.value = targetLang;
      googleCombo.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };


  return (
    <>
      {/* Announcement Bar */}
      <div className="w-full bg-slate-950 text-white text-[10px] md:text-xs font-bold py-2.5 px-4 text-center uppercase tracking-widest border-b border-slate-800 animate-pulse">
        ENJOY FREE WORLDWIDE SHIPPING ON ALL ORDERS OVER $250!
      </div>

      {/* Solid Yellow Utility Row */}
      <div className="bg-yellow-600 text-white w-full px-3 py-2 flex items-center justify-between md:justify-end gap-2 md:gap-6">
        <span className="hidden md:block text-xs font-semibold text-white tracking-wide">Factory-Direct Export Quality | Sialkot Certified</span>
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto flex-nowrap shrink-0">
          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
            className="p-1.5 md:p-2 rounded-full transition-colors hover:bg-white/10 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {/* Compare Button */}
          <button
            onClick={() => setCompareOpen(true)}
            aria-label="Open comparison matrix"
            className="p-1.5 md:p-2 rounded-full transition-colors hover:bg-white/10 cursor-pointer relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M12 5.25L4.5 9m7.5-3.75L19.5 9M4.5 9h15M7.5 9v5.25a4.5 4.5 0 009 0V9M12 21H3.75m16.5 0H12" />
            </svg>
            {compareList.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-[#0A1128] bg-yellow-500 leading-none px-1 animate-pulse">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Favorites Button */}
          <button
            onClick={() => setFavoritesOpen(true)}
            aria-label="Open wishlist drawer"
            className="p-1.5 md:p-2 rounded-full transition-colors hover:bg-white/10 cursor-pointer relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-[#0A1128] bg-yellow-500 leading-none px-1">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open quote cart"
            className="relative p-1.5 md:p-2 rounded-full transition-colors hover:bg-white/10 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-[#0A1128] bg-yellow-500 leading-none px-1">
                {cartCount}
              </span>
            )}
          </button>

          {/* Sign‑In Button */}
          <button
            onClick={() => setAuthOpen(true)}
            aria-label="Open sign‑in modal"
            className="p-1.5 md:p-2 rounded-full transition-colors hover:bg-white/10 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>

          {/* Admin Link */}
          <Link href="/admin" className="p-1.5 md:p-2 rounded-full text-white hover:bg-white/10">
            Admin
          </Link>

          {/* Language Selector */}
          <div className="shrink-0 max-w-[120px] sm:max-w-none notranslate" translate="no">
            <select
              id="custom-language-selector"
              onChange={handleLanguageChange}
              className="notranslate bg-yellow-600 text-white rounded-md p-1 focus:outline-none"
              translate="no"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="ru">Русский</option>
              <option value="de">Deutsch</option>
              <option value="zh-CN">中文</option>
              <option value="ja">日本語</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="tr">Türkçe</option>
              <option value="nl">Nederlands</option>
              <option value="ko">한국어</option>
              <option value="pl">Polski</option>
              <option value="sv">Svenska</option>
              <option value="vi">Tiếng Việt</option>
              <option value="ro">Română</option>
            </select>
          </div>
        </div>
      </div>

      {/* Google Translate placeholder */}
      <div id="google_translate_element" className="hidden" />

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between h-16 md:h-20">
          {/* Mobile Hamburger */}
          <button
            onClick={toggleMobileMenu}
            className="flex md:hidden p-2 text-slate-900 hover:text-amber-600 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center transition-transform duration-200 hover:scale-[1.02] shrink-0">
            <img src="/logo.png" alt="Bite Instruments Official Logo" className="h-10 w-auto object-contain rounded" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase text-slate-900">
            <Link href="/" className="relative group transition-colors hover:text-amber-600">
              {t("home")}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Pet Grooming Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 transition-colors hover:text-amber-600 uppercase focus:outline-none cursor-pointer">
                {t("pet_grooming")}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col gap-4 w-60">
                  <h3 className="text-amber-600 font-bold tracking-widest text-[10px] border-b border-slate-100 pb-2">{t("pet_instruments")}</h3>
                  <ul className="flex flex-col gap-3">
                    {[
                      { name: "Pet Nail Cutters", path: "/pet-nail-cutters", key: "pet_nail_cutters" },
                      { name: "Pet Combs", path: "/pet-combs", key: "pet_combs" },
                      { name: "Curved Scissors", path: "/curved-scissors", key: "curved_scissors" },
                      { name: "Blenders & Thinning Scissors", path: "/blenders-thinning-scissors", key: "blenders_thinning_scissors" },
                      { name: "Pet Straight Scissors", path: "/pet-straight-scissors", key: "pet_straight_scissors" },
                    ].map(item => (
                      <li key={item.path}>
                        <Link href={item.path} className="text-slate-800 hover:text-amber-600 transition-colors text-xs tracking-wide block py-0.5">
                          {t(item.key)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <Link href="/pet-grooming-kits" className="relative group transition-colors hover:text-amber-600">
              Pet Grooming Kits
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link href="/blog" className="relative group transition-colors hover:text-amber-600">
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link href="/about" className="relative group transition-colors hover:text-amber-600">
              {t("about")}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link href="/contact" className="relative group transition-colors hover:text-amber-600">
              {t("contact")}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* Request Quote Button */}
          <Link
            href="/checkout"
            className="hidden lg:flex items-center justify-center px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs text-[#0A1128] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(250,204,21,0.6)]"
          >
            {t("request_quote")}
          </Link>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white border-b border-slate-200 ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-b-0 opacity-0'}`}>
          <div className="px-6 py-8 space-y-6">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-800 hover:text-amber-500 uppercase tracking-widest">
              {t("home")}
            </Link>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">
                {t("pet_grooming")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Nail Cutters", path: "/pet-nail-cutters", key: "pet_nail_cutters" },
                  { name: "Pet Combs", path: "/pet-combs", key: "pet_combs" },
                  { name: "Curved Scissors", path: "/curved-scissors", key: "curved_scissors" },
                  { name: "Blenders & Thinners", path: "/blenders-thinning-scissors", key: "blenders_thinning_scissors" },
                  { name: "Straight Scissors", path: "/pet-straight-scissors", key: "pet_straight_scissors" },
                ].map(item => (
                  <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-600 hover:text-amber-500 font-medium">
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/pet-grooming-kits" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-900 hover:text-amber-600 uppercase tracking-widest">
              Pet Grooming Kits
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-900 hover:text-amber-600 uppercase tracking-widest">
              Blog
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-900 hover:text-amber-600 uppercase tracking-widest">
              {t("about")}
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-900 hover:text-amber-600 uppercase tracking-widest">
              {t("contact")}
            </Link>
            <Link href="/checkout" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-[#0A1128] bg-yellow-500">
              {t("request_quote")}
            </Link>
          </div>
        </div>
      </header>

      {/* Overlays & Drawers */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <FavoritesDrawer open={favoritesOpen} onClose={() => setFavoritesOpen(false)} />
      <CompareDrawer open={compareOpen} onClose={() => setCompareOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <CatalogueModal open={catalogueOpen} onClose={() => setCatalogueOpen(false)} />

      {/* Global CSS to hide Google Translate banner */}
      <style jsx global>{`
        .skiptranslate { display: none !important; }
        body { top: 0px !important; }
      `}</style>
    </>
  );
}