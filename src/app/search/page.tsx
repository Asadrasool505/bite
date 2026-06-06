"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { productsData } from "@/data/products";
import FormattedPrice from "@/components/FormattedPrice";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get all unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    productsData.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, []);

  // Filter products based on query and category
  const filteredProducts = useMemo(() => {
    return productsData.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-amber-600 text-xs font-black tracking-[0.4em] uppercase mb-3">
          Explore Collection
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-slate-900 uppercase tracking-wide">
          Search Instruments
        </h1>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full max-w-2xl mx-auto mb-10">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name, steel type, category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base search-input-field"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-900 hover:text-amber-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Categories Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
              selectedCategory === cat
                ? "bg-amber-500 border-amber-500 text-slate-950 font-extrabold shadow-sm"
                : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50 hover:text-amber-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="mb-6 flex justify-between items-center text-sm text-slate-900 border-b border-slate-200 pb-4">
        <span>Found {filteredProducts.length} premium instrument{filteredProducts.length !== 1 ? "s" : ""}</span>
        {selectedCategory !== "All" && (
          <span className="font-semibold text-amber-600">Category: {selectedCategory}</span>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((item) => {
            const displayImage = item.images?.[0] || "/assets/placeholder.png";
            return (
              <Link
                href={`/product/${item.id}`}
                key={item.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col hover:shadow-md transition-all duration-300 group h-full"
              >
                {/* Image Container */}
                <div className="w-full h-56 bg-slate-50 rounded-2xl mb-5 flex items-center justify-center border border-slate-100 p-4 relative overflow-hidden">
                  <img
                    src={displayImage}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-slate-900 font-serif font-extrabold text-base leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    <FormattedPrice
                      price={item.price}
                      isVariable={item.is_variable}
                      className="text-amber-600 font-bold text-sm whitespace-nowrap"
                    />
                  </div>
                  
                  <p
                    className="text-slate-900 text-xs font-light mb-4 line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.description || "" }}
                  />

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-widest text-slate-900 font-bold">{item.category}</span>
                    <span className="text-[9px] uppercase tracking-widest text-amber-600 font-black">Premium Quality</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-3xl p-8">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-900 text-lg font-light tracking-wide mb-4">No instruments match your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen w-full bg-[#F4F5F7] pt-32 pb-20 px-6 search-page-bg">
      <Suspense fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  );
}
