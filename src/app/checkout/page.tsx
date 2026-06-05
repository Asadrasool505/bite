"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { calculateCartShipping } from "@/utils/shipping";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { formatPrice } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    country: "",
    whatsapp: "",
    notes: "",
  });

  const { totalShipping, discount, totalQuantity } = calculateCartShipping(cart, cartTotal);
  const grandContractTotal = cartTotal + totalShipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const quoteId = `Q-${Date.now().toString().slice(-6)}`;
      const { totalShipping } = calculateCartShipping(cart, cartTotal);
      const grandContractTotal = cartTotal + totalShipping;

      // Call server-side API which handles both Supabase insertion & email dispatch
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId,
          ...formData,
          items: cart,
          totalAmount: cartTotal,
          totalShipping,
          grandTotal: grandContractTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit quote request on server");
      }

      console.log(`SUCCESS: Quote #${quoteId} submitted and processed on the server!`);

      // Backup the quote inside browser localStorage as a safety net
      try {
        const localQuotes = JSON.parse(localStorage.getItem("b2b_quotes") || "[]");
        localQuotes.push({
          id: quoteId,
          date: new Date().toISOString(),
          ...formData,
          items: cart,
          total_amount: cartTotal,
          total_shipping: totalShipping,
          grand_total: grandContractTotal,
          status: "pending",
        });
        localStorage.setItem("b2b_quotes", JSON.stringify(localQuotes));
      } catch (backupError) {
        console.error("Local storage backup failed:", backupError);
      }

      setSuccess(true);
      clearCart();
    } catch (error: any) {
      console.error("Error in quote submission:", error);
      alert(`Submission failed: ${error.message || "Please check your network or try again."}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-md">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <svg className="w-10 h-10 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif text-slate-900 font-extrabold mb-4 tracking-wide">Quote Requested</h1>
          <p className="text-slate-900 font-light leading-relaxed mb-10">
            Thank you for your interest in Bite Instruments. Our export department will review your request and contact you via WhatsApp or Email within 24 hours.
          </p>
          <Link href="/" className="inline-block w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs bg-amber-500 text-slate-950 hover:bg-amber-600 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] text-center">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 tracking-wider mb-16 text-center font-extrabold uppercase">
          Finalize <span className="text-amber-600">Quote</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-10 border-b border-slate-200 pb-4">
              Exporter Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Full Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:border-amber-500 outline-none transition-all font-light"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Company Name</label>
                  <input
                    required
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:border-amber-500 outline-none transition-all font-light"
                    placeholder="Luxury Grooming Inc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:border-amber-500 outline-none transition-all font-light"
                  placeholder="john@company.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Country</label>
                  <input
                    required
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:border-amber-500 outline-none transition-all font-light"
                    placeholder="United States"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">WhatsApp Number</label>
                  <input
                    required
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:border-amber-500 outline-none transition-all font-light"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:border-amber-500 outline-none transition-all font-light resize-none"
                  placeholder="Inquire about bulk shipping rates or custom laser engraving..."
                />
              </div>

              <button
                disabled={loading || cart.length === 0}
                className="w-full py-5 rounded-xl font-black uppercase tracking-[0.3em] text-sm bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-[0_10px_30px_rgba(245,158,11,0.2)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.4)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 cursor-pointer"
              >
                {loading ? "Processing..." : "Submit Quote Request"}
              </button>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="flex flex-col gap-10">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-8 border-b border-slate-200 pb-4">
                Quote Summary
              </h2>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-900 text-sm font-semibold truncate">{item.name}</h4>
                      <p className="text-slate-900 text-xs mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-amber-600 font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                {cart.length === 0 && (
                  <p className="text-slate-900 text-center py-10">No items in your quote</p>
                )}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-200 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-900 uppercase tracking-widest font-bold">Total Items</span>
                  <span className="text-slate-900 font-bold">{totalQuantity} units</span>
                </div>
                
                {/* Subtotal (Product Costs) */}
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-900 uppercase tracking-widest">Subtotal (Product Costs)</span>
                  <span className="text-black font-extrabold text-base">{formatPrice(cartTotal)}</span>
                </div>

                {/* Shipping Fee */}
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-900 uppercase tracking-widest">Shipping Fee</span>
                  <span className="text-amber-600 font-extrabold text-base">
                    {totalShipping === 0 ? "FREE Worldwide Shipping" : `${formatPrice(totalShipping)} Flat Rate`}
                  </span>
                </div>

                <div className="w-full h-[1px] bg-slate-200 my-2" />

                {/* Grand Contract Total (Products + Shipping) */}
                <div className="flex justify-between items-center text-lg border-t border-slate-200 pt-4">
                  <span className="text-black font-black uppercase tracking-widest text-sm">Grand Contract Total</span>
                  <span className="text-amber-600 font-black text-2xl">{formatPrice(grandContractTotal)}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-amber-600 font-bold text-xs uppercase tracking-widest mb-1">Export Policy</h5>
                <p className="text-slate-900 text-xs font-light leading-relaxed">
                  Bite Instruments ships globally from Sialkot. Final shipping costs and lead times will be provided by your account manager after review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}