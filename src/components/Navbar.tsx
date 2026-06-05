"use client";

import { useState } from "react";
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
    language,
    setLanguage,
    user,
    signOut,
    t,
    catalogueOpen,
    setCatalogueOpen
  } = useApp();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-yellow-500/10">
        {/* Dynamic Top-Bar Announcement Ticker */}
        <div className="w-full bg-slate-900 text-amber-400 text-[10px] md:text-xs font-black py-2.5 px-4 text-center uppercase tracking-widest border-b border-yellow-500/10 animate-pulse">
          Enjoy free worldwide shipping on all orders over $250!
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-3 flex items-center justify-between">

          {/* ── Mobile Hamburger ── */}
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

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center justify-center transition-transform duration-200 hover:scale-[1.02] shrink-0">
            <img
              src="/assets/logo.png"
              alt="Bite Instruments Official Logo"
              className="h-10 w-auto object-contain rounded"
            />
          </Link>

          {/* ── Desktop Navigation Links ── */}
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

              {/* Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col gap-4 w-60">
                  <h3 className="text-amber-600 font-bold tracking-widest text-[10px] border-b border-slate-100 pb-2">{t("pet_instruments")}</h3>
                  <ul className="flex flex-col gap-3">
                    {[
                      { name: "Pet Nail Cutters", path: "/pet-nail-cutters", key: "pet_nail_cutters" },
                      { name: "Pet Combs", path: "/pet-combs", key: "pet_combs" },
                      { name: "Curved Scissors", path: "/curved-scissors", key: "curved_scissors" },
                      { name: "Blenders & Thinning Scissors", path: "/blenders-thinning-scissors", key: "blenders_thinning_scissors" },
                      { name: "Pet Straight Scissors", path: "/pet-straight-scissors", key: "pet_straight_scissors" }
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

            <Link href="/about" className="relative group transition-colors hover:text-amber-600">
              {t("about")}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link href="/contact" className="relative group transition-colors hover:text-amber-600">
              {t("contact")}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* ── Right Side Controls ── */}
          <div className="flex items-center gap-1 md:gap-2.5">

            {/* Multi-language Selector */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-full px-2.5 py-1">
              <span className="text-[10px] text-amber-600 font-black mr-1 uppercase">🌍</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-white text-slate-900 hover:text-amber-600 text-[10px] font-black uppercase tracking-widest outline-none border-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-white text-white">🇺🇸 EN</option>
                <option value="zh" className="bg-white text-white">🇨🇳 中文</option>
                <option value="ja" className="bg-white text-white">🇯🇵 日本語</option>
                <option value="ar" className="bg-white text-white">🇦🇪 العربية</option>
                <option value="ru" className="bg-white text-white">🇷🇺 Русский</option>
                <option value="de" className="bg-white text-white">🇩🇪 DE</option>
                <option value="fr" className="bg-white text-white">🇫🇷 FR</option>
                <option value="es" className="bg-white text-white">🇪🇸 ES</option>
              </select>
            </div>



            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="p-1.5 md:p-2 rounded-full transition-all text-slate-900 hover:text-amber-600 hover:bg-amber-500/10 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Compare Button */}
            <button
              onClick={() => setCompareOpen(true)}
              aria-label="Open comparison matrix"
              className="relative p-1.5 md:p-2 rounded-full transition-all text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M12 5.25L4.5 9m7.5-3.75L19.5 9M4.5 9h15M7.5 9v5.25a4.5 4.5 0 009 0V9M12 21H3.75m16.5 0H12" />
              </svg>
              {compareList.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-[#0A1128] bg-yellow-500 shadow-[0_0_6px_rgba(212,175,55,0.8)] leading-none px-1 animate-pulse">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Favorites Button */}
            <button
              onClick={() => setFavoritesOpen(true)}
              aria-label="Open wishlist drawer"
              className="relative p-1.5 md:p-2 rounded-full transition-all text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-[#0A1128] bg-yellow-500 shadow-[0_0_6px_rgba(212,175,55,0.8)] leading-none px-1">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open quote cart"
              className="relative p-1.5 md:p-2 rounded-full transition-all text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-[#0A1128] bg-yellow-500 shadow-[0_0_6px_rgba(212,175,55,0.8)] leading-none px-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile / Account Control */}
            <div className="relative">
              <button
                onClick={() => {
                  if (user) {
                    setUserDropdownOpen(!userDropdownOpen);
                  } else {
                    setAuthOpen(true);
                  }
                }}
                aria-label="User Account"
                className="p-1.5 md:p-2 rounded-full transition-all text-slate-900 hover:text-amber-600 hover:bg-amber-500/10 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </button>
              {user && userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 p-4 shadow-2xl z-50 flex flex-col gap-2">
                  <div className="border-b border-slate-200 pb-2 mb-2">
                    <p className="text-xs text-slate-900 font-bold truncate max-w-full">
                      {user.user_metadata?.full_name || "B2B Wholesale Buyer"}
                    </p>
                    <p className="text-[9px] text-amber-600 font-bold uppercase tracking-wider truncate max-w-full">
                      {user.user_metadata?.company_name || "Global Distributor"}
                    </p>
                    <p className="text-[8px] text-slate-600 font-sans truncate max-w-full">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="text-left text-[10px] uppercase font-bold tracking-wider text-slate-900 hover:text-amber-600 transition-colors py-1.5 block cursor-pointer"
                  >
                    💼 Account Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      setFavoritesOpen(true);
                      setUserDropdownOpen(false);
                    }}
                    className="text-left text-[10px] uppercase font-bold tracking-wider text-slate-900 hover:text-amber-600 transition-colors py-1.5 cursor-pointer"
                  >
                    {t("favorites")}
                  </button>
                  <button
                    onClick={() => {
                      setCompareOpen(true);
                      setUserDropdownOpen(false);
                    }}
                    className="text-left text-[10px] uppercase font-bold tracking-wider text-slate-900 hover:text-amber-600 transition-colors py-1.5 cursor-pointer"
                  >
                    {t("compare")}
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setUserDropdownOpen(false);
                    }}
                    className="text-left text-[10px] uppercase font-bold tracking-wider text-red-400 hover:text-red-300 transition-colors py-1.5 border-t border-slate-100 mt-2 pt-2 cursor-pointer"
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>

            {/* Request Quote Button */}
            <Link
              href="/checkout"
              className="hidden lg:flex items-center justify-center px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs text-[#0A1128] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(250,204,21,0.6)]"
            >
              {t("request_quote")}
            </Link>
          </div>
        </div>

        {/* ── Mobile Menu Dropdown ── */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white border-b border-slate-200 ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 py-8 space-y-6">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-800 hover:text-amber-500 uppercase tracking-widest">{t("home")}</Link>
            {/* Mobile Pet Grooming Section */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">{t("pet_grooming")}</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Nail Cutters", path: "/pet-nail-cutters", key: "pet_nail_cutters" },
                  { name: "Pet Combs", path: "/pet-combs", key: "pet_combs" },
                  { name: "Curved Scissors", path: "/curved-scissors", key: "curved_scissors" },
                  { name: "Blenders & Thinners", path: "/blenders-thinning-scissors", key: "blenders_thinning_scissors" },
                  { name: "Straight Scissors", path: "/pet-straight-scissors", key: "pet_straight_scissors" }
                ].map(item => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-slate-600 hover:text-amber-500 font-medium"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-900 hover:text-amber-600 uppercase tracking-widest">{t("about")}</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-900 hover:text-amber-600 uppercase tracking-widest">{t("contact")}</Link>
            <Link
              href="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-[#0A1128] bg-yellow-500"
            >
              {t("request_quote")}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Overlays & Modals ── */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <FavoritesDrawer open={favoritesOpen} onClose={() => setFavoritesOpen(false)} />
      <CompareDrawer open={compareOpen} onClose={() => setCompareOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <CatalogueModal open={catalogueOpen} onClose={() => setCatalogueOpen(false)} />
    </>
  );
}