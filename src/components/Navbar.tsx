"use client";

import { useState } from "react";
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";
import SearchOverlay from "@/components/SearchOverlay";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0A1128]/70 border-b border-yellow-500/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

          {/* ── Mobile Hamburger ── */}
          <button 
            onClick={toggleMobileMenu}
            className="flex md:hidden p-2 text-gray-400 hover:text-yellow-400 transition-colors"
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
          <Link href="/" className="flex flex-col items-center md:items-start leading-none group transition-opacity hover:opacity-80">
            <span className="text-white text-2xl md:text-3xl font-serif tracking-wider group-hover:text-yellow-100 transition-colors duration-300">
              Bite
            </span>
            <span className="text-yellow-500 text-[8px] md:text-[9px] tracking-[0.35em] uppercase font-bold mt-0.5">
              Instruments
            </span>
          </Link>

          {/* ── Desktop Navigation Links ── */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase text-gray-200">
            <Link href="/" className="relative group transition-colors hover:text-white">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Products Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 transition-colors hover:text-white uppercase focus:outline-none">
                Products
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full" />
              </button>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-[#0A1128]/95 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex gap-12 w-max">
                  {/* Shears */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-yellow-500 font-bold tracking-widest text-[10px]">SHEARS</h3>
                    <ul className="flex flex-col gap-3">
                      {["Straight Shears", "Curved Shears", "Thinning Shears", "Chunker Shears", "Lefty Shears"].map(item => (
                        <li key={item}>
                          <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-white hover:text-yellow-400 transition-colors capitalize text-xs tracking-wide">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Combs & Rakes */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-yellow-500 font-bold tracking-widest text-[10px]">COMBS & RAKES</h3>
                    <ul className="flex flex-col gap-3">
                      {["Finishing Combs", "Undercoat Rakes", "Slicker Brushes"].map(item => (
                        <li key={item}>
                          <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-white hover:text-yellow-400 transition-colors capitalize text-xs tracking-wide">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Grooming Kits */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-yellow-500 font-bold tracking-widest text-[10px]">GROOMING KITS</h3>
                    <ul className="flex flex-col gap-3">
                      {["Essential Kits", "Master Sets"].map(item => (
                        <li key={item}>
                          <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-white hover:text-yellow-400 transition-colors capitalize text-xs tracking-wide">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/about" className="relative group transition-colors hover:text-white">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full" />
            </Link>
            
            <Link href="/contact" className="relative group transition-colors hover:text-white">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* ── Right Side: Quote / Search / Cart ── */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="p-2 md:p-2.5 rounded-full transition-all text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
            </button>

            {/* Cart icon */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative p-2 md:p-2.5 rounded-full transition-all text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-[#0A1128] bg-yellow-500 shadow-[0_0_6px_rgba(212,175,55,0.8)] leading-none px-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Request Quote button (Desktop Only) */}
            <Link
              href="/checkout"
              className="hidden lg:flex items-center justify-center px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs text-[#0A1128] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(250,204,21,0.6)]"
            >
              Request Quote
            </Link>
          </div>
        </div>

        {/* ── Mobile Menu Dropdown ── */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out bg-[#0A1128] border-b border-white/10 ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 py-8 space-y-6">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-gray-200 hover:text-yellow-400 uppercase tracking-widest">Home</Link>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Collections</p>
              <div className="grid grid-cols-2 gap-4">
                {["Straight Shears", "Curved Shears", "Thinning Shears", "Kits"].map(item => (
                  <Link 
                    key={item} 
                    href={`/${item.toLowerCase().replace(/ /g, '-')}`} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-gray-200 hover:text-yellow-400 uppercase tracking-widest">About</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-gray-200 hover:text-yellow-400 uppercase tracking-widest">Contact</Link>
            <Link 
              href="/checkout" 
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-[#0A1128] bg-yellow-500"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </header>

      {/* ── Overlays ── */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer    open={cartOpen}   onClose={() => setCartOpen(false)} />
    </>
  );
}
