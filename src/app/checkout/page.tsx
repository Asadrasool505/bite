"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { calculateCartShipping } from "@/utils/shipping";

/* ─────────────────────────────────────────────────
   EMPTY-CART FALLBACK: full inline Contact Us form
   Rendered whenever cart.length === 0
───────────────────────────────────────────────── */
function EmptyCartContactView() {
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contactData, setContactData] = useState({
    firstName: "", lastName: "", email: "", phone: "", message: "",
  });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaChecked) {
      alert("Please verify you are not a robot.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Submission failed');
      setSubmitted(true);
    } catch (err: any) {
      alert(`Failed to send: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">

        {/* ── Empty-cart notice banner ── */}
        <div className="mb-10 flex flex-col sm:flex-row items-center gap-5 bg-amber-500/10 border border-amber-500/25 rounded-2xl px-6 py-5">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-amber-700 font-black text-sm uppercase tracking-widest mb-1">Your Cart is Empty</p>
            <p className="text-amber-800/80 text-xs font-light leading-relaxed">
              Browse our catalog and add at least one product before submitting a wholesale quote.
              You can also reach us directly below with any general inquiry.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 ml-auto px-5 py-2.5 bg-amber-500 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-amber-600 transition-all"
          >
            Browse Products ➔
          </Link>
        </div>

        {/* ── Page Header ── */}
        <div className="mb-12 text-center">
          <p className="text-amber-600 text-xs font-black tracking-[0.5em] uppercase mb-4">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 uppercase tracking-wider">
            Contact <span className="text-amber-600">Us</span>
          </h1>
          <div
            className="mx-auto mt-5 w-20 h-[2px] rounded-full"
            style={{ background: "linear-gradient(to right, transparent, #D4AF37, transparent)" }}
          />
          <p className="text-slate-500 text-sm font-light mt-4 max-w-xl mx-auto leading-relaxed">
            Our export team is ready to answer wholesale inquiries, OEM requests, and general questions about Bite Instruments.
          </p>
        </div>

        {/* ── 2-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT: contact details */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {[
                { icon: "📍", label: "Small Industrial Estate, Sialkot, Punjab 51310, Pakistan" },
                { icon: "📞", label: "+92 319 608 5514" },
                { icon: "✉️", label: "biteinstruments@gmail.com" },
                { icon: "🕐", label: "Business Hours: 9:00 AM – 6:00 PM PKT (UTC+5)" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 text-slate-700 text-sm font-light">
                  <span className="text-base mt-0.5 shrink-0">{item.icon}</span>
                  <span className="leading-relaxed">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <a
                href="tel:+923196085514"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm text-slate-950 bg-amber-500 hover:bg-amber-600 transition-all"
              >
                Call Us
              </a>
              <a
                href="mailto:biteinstruments@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm text-amber-600 border border-amber-500 hover:bg-amber-500/10 transition-all"
              >
                Email Us
              </a>
              <a
                href="https://wa.me/923196085514"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm text-slate-950 bg-emerald-500 hover:bg-emerald-600 transition-all"
              >
                WhatsApp
              </a>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md" style={{ height: 260 }}>
              <iframe
                title="Bite Instruments — Sialkot Location"
                src="https://maps.google.com/maps?q=Small%20Industrial%20Estate%20Sialkot,%20Pakistan&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* RIGHT: contact form */}
          <div>
            {submitted ? (
              <div className="bg-white border border-slate-200 p-10 rounded-2xl text-center shadow-md">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-slate-900 text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-slate-500 text-sm font-light mb-6">Our team will respond within 24 hours.</p>
                <Link href="/" className="inline-block px-6 py-3 bg-amber-500 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-amber-600 transition-all">
                  Back to Home
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleContactSubmit}
                className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm flex flex-col gap-5"
              >
                <p className="text-slate-900 text-sm font-semibold tracking-wide">Please fill out the form below</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-900 text-xs font-bold uppercase tracking-widest">First Name</label>
                    <input type="text" required placeholder="Ali"
                      className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-900 text-xs font-bold uppercase tracking-widest">Last Name</label>
                    <input type="text" required placeholder="Ahmed"
                      className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-900 text-xs font-bold uppercase tracking-widest">Email Address</label>
                  <input type="email" required placeholder="you@example.com"
                    className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-900 text-xs font-bold uppercase tracking-widest">Phone / WhatsApp</label>
                  <input type="tel" placeholder="+1 (555) 000-0000"
                    className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-900 text-xs font-bold uppercase tracking-widest">Message / Inquiry</label>
                  <textarea required rows={5}
                    placeholder="Tell us about your grooming business, the tools you need, or any wholesale inquiry…"
                    className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none" />
                </div>

                {/* Captcha */}
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 select-none">
                  <button
                    type="button"
                    onClick={() => setCaptchaChecked(!captchaChecked)}
                    className={`w-6 h-6 rounded flex items-center justify-center border-2 shrink-0 transition-all duration-200 ${
                      captchaChecked ? "bg-amber-500 border-amber-500" : "bg-white border-slate-300 hover:border-amber-500"
                    }`}
                  >
                    {captchaChecked && (
                      <svg className="w-3.5 h-3.5 text-slate-950" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className="text-slate-700 text-sm font-medium">I am not a robot</span>
                  <div className="ml-auto flex flex-col items-center gap-0.5 opacity-60">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">rC</span>
                    </div>
                    <span className="text-slate-500 text-[8px] tracking-wide font-bold">reCAPTCHA</span>
                    <span className="text-slate-400 text-[7px]">Privacy · Terms</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm text-slate-950 bg-amber-500 hover:bg-amber-600 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-sm"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { formatPrice } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdTrackingId, setCreatedTrackingId] = useState("");
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

  // ── CART GUARD: show Contact form if no items are in cart ──
  if (cart.length === 0 && !success) {
    return <EmptyCartContactView />;
  }

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
      setCreatedTrackingId(data.trackingId || "");

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
          <h1 className="text-3xl font-serif text-slate-900 font-extrabold mb-4 tracking-wide">Order Registered</h1>
          <p className="text-slate-900 font-light leading-relaxed mb-6">
            Thank you for your order with Bite Instruments. Your wholesale order is registered in our Sialkot database and production tracking is live.
          </p>
          {createdTrackingId && (
            <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <p className="text-[10px] font-black tracking-[0.2em] text-amber-600 uppercase mb-2">Automated Shipment Tracking ID</p>
              <p className="text-lg font-mono font-black text-slate-900 select-all">{createdTrackingId}</p>
              <Link 
                href={`/track-order?id=${createdTrackingId.replace(/[^0-9]/g, "")}`}
                className="inline-block mt-3 text-xs font-bold text-amber-600 hover:text-amber-700 underline"
              >
                Go to Live Tracking Portal ➔
              </Link>
            </div>
          )}
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