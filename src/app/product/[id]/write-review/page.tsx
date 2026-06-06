"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { productsData } from "@/data/products";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function WriteReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const { user } = useApp();

  const product = productsData.find((p) => p.id === productId);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  // Set default B2B user name
  useEffect(() => {
    if (user) {
      setUserName(user.user_metadata?.full_name || user.email || "");
    }
  }, [user]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-bold mb-4">Product Not Found</p>
          <Link href="/" className="px-6 py-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold uppercase tracking-wider text-xs">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert("Please enter your name to post a verified wholesale review.");
      return;
    }
    if (!reviewText.trim()) {
      alert("Please provide some details about the instrument's performance.");
      return;
    }

    setLoading(true);

    const reviewPayload = {
      product_id: product.id,
      user_name: userName,
      rating,
      review_text: reviewText
    };

    try {
      // 1. Save to Supabase Table
      const { error } = await supabase.from("reviews").insert([reviewPayload]);

      if (error) {
        console.warn("Supabase insertion failed, using local fallback:", error);
      }

      // 2. Local Fallback Backup
      const localReviewsKey = `reviews_${product.id}`;
      const savedLocal = localStorage.getItem(localReviewsKey);
      let localReviews = [];
      if (savedLocal) {
        try {
          localReviews = JSON.parse(savedLocal);
        } catch (e) {
          console.error(e);
        }
      }

      const formattedLocalReview = {
        name: userName,
        rating,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        comment: reviewText
      };

      localStorage.setItem(localReviewsKey, JSON.stringify([formattedLocalReview, ...localReviews]));

      alert("Thank you! Your verified B2B product review has been submitted successfully.");
      
      // Redirect back to Product page with reviews tab active
      router.push(`/product/${product.id}?tab=reviews`);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("There was an issue publishing your review. It has been saved locally.");
      router.push(`/product/${product.id}?tab=reviews`);
    } finally {
      setLoading(false);
    }
  };

  const productThumbnail = product.images && product.images.length > 0 
    ? product.images[0] 
    : "/assets/placeholder.png";

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <div className="max-w-3xl mx-auto px-6 py-24">
        {/* Breadcrumbs */}
        <div className="text-[10px] font-bold tracking-widest uppercase text-slate-900 mb-8">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/product/${product.id}`} className="hover:text-amber-600 transition-colors">{product.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-amber-600">Write Review</span>
        </div>

        {/* Product Reference Card */}
        <div className="flex items-center gap-6 bg-white border border-slate-200 rounded-2xl p-5 mb-10 shadow-sm">
          <div className="w-16 h-16 relative bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-100">
            <Image
              src={productThumbnail}
              alt={product.name}
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <span className="text-[9px] text-amber-600 font-bold uppercase tracking-widest block mb-1">Product Review Target</span>
            <h2 className="text-xl font-serif text-slate-900 font-bold">{product.name}</h2>
          </div>
        </div>

        {/* Dynamic Submission Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-serif text-slate-900 font-bold tracking-wide mb-8">
            Write a B2B Product Review
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Interactive Stars Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Select Product Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <button
                    type="button"
                    key={starValue}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    aria-label={`Rate ${starValue} stars`}
                  >
                    <svg
                      className={`w-8 h-8 transition-colors ${
                        starValue <= (hoverRating ?? rating)
                          ? "text-amber-500 fill-current drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                          : "text-slate-300"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499c.198-.396.762-.396.96 0l2.394 4.793 5.289.788c.451.067.632.622.308.944l-3.827 3.731.902 5.267c.077.447-.39.787-.791.569l-4.73-2.507-4.73 2.507c-.401.218-.868-.122-.79-.569l.903-5.267-3.828-3.73c-.324-.322-.143-.877.309-.944l5.289-.788 2.394-4.793z"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* User Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Your Name / Display Identifier</label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Description Text Box */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Review Description / B2B Experience</label>
              <textarea
                required
                rows={5}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your detailed feedback on manufacturing tolerance, steel quality, weight balance, and shipping lead time..."
                className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm text-slate-950 bg-amber-500 hover:bg-amber-600 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <span>Submit Verified Review</span>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
