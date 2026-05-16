"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("quotes").insert([
        {
          ...formData,
          items: cart,
          total_amount: cartTotal,
          status: "pending",
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert("There was an error submitting your quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-10 text-center backdrop-blur-xl shadow-2xl">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(250,204,21,0.4)]">
            <svg className="w-10 h-10 text-[#0A1128]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif text-white mb-4 tracking-wide">Quote Requested</h1>
          <p className="text-gray-400 font-light leading-relaxed mb-10">
            Thank you for your interest in Bite Instruments. Our export department will review your request and contact you via WhatsApp or Email within 24 hours.
          </p>
          <Link href="/" className="inline-block w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050814] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-serif text-white tracking-wider mb-16 text-center">
          Finalize <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">Quote</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Form */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-10 border-b border-yellow-500/20 pb-4">
              Exporter Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Full Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#0A1128]/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-500 outline-none transition-all font-light"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Company Name</label>
                  <input
                    required
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-[#0A1128]/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-500 outline-none transition-all font-light"
                    placeholder="Luxury Grooming Inc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0A1128]/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-500 outline-none transition-all font-light"
                  placeholder="john@company.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Country</label>
                  <input
                    required
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-[#0A1128]/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-500 outline-none transition-all font-light"
                    placeholder="United States"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">WhatsApp Number</label>
                  <input
                    required
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full bg-[#0A1128]/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-500 outline-none transition-all font-light"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-[#0A1128]/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-500 outline-none transition-all font-light resize-none"
                  placeholder="Inquire about bulk shipping rates or custom laser engraving..."
                />
              </div>

              <button
                disabled={loading || cart.length === 0}
                className="w-full py-5 rounded-xl font-black uppercase tracking-[0.3em] text-sm text-[#0A1128] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 shadow-[0_10px_30px_rgba(250,204,21,0.2)] hover:shadow-[0_15px_40px_rgba(250,204,21,0.4)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? "Processing..." : "Submit Quote Request"}
              </button>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="flex flex-col gap-10">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-8 border-b border-yellow-500/20 pb-4">
                Quote Summary
              </h2>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-[#0A1128] rounded-xl border border-white/10 flex items-center justify-center p-2">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-semibold truncate">{item.name}</h4>
                      <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-yellow-400 font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                {cart.length === 0 && (
                  <p className="text-gray-500 text-center py-10">No items in your quote</p>
                )}
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase tracking-widest text-xs">Total Items</span>
                  <span className="text-white font-medium">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
                </div>
                <div className="flex justify-between items-center text-xl">
                  <span className="text-white font-bold uppercase tracking-widest text-sm">Estimated Total</span>
                  <span className="text-yellow-500 font-black">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="text-yellow-500 font-bold text-xs uppercase tracking-widest mb-1">Export Policy</h5>
                <p className="text-gray-400 text-xs font-light leading-relaxed">
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
