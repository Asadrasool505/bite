"use client";

import { useState } from "react";

export default function ContactPage() {
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaChecked) {
      alert("Please verify you are not a robot.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <div
      className="min-h-screen w-full py-28 px-6 md:px-12"
      style={{ background: "radial-gradient(ellipse at 30% 20%, #0d1f4a 0%, #080f2a 50%, #050814 100%)" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Page Header ── */}
        <div className="mb-16 text-center">
          <p className="text-[#D4AF37] text-xs font-black tracking-[0.5em] uppercase mb-4">
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-wider">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
              Us
            </span>
          </h1>
          <div
            className="mx-auto mt-6 w-20 h-[2px] rounded-full"
            style={{ background: "linear-gradient(to right, transparent, #D4AF37, transparent)" }}
          />
        </div>

        {/* ── 2-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ════════════════════════════
              LEFT COLUMN
          ════════════════════════════ */}
          <div className="flex flex-col gap-8">

            {/* Intro */}
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-3 uppercase tracking-wide">
                Contact Us
              </h2>
              <p className="text-gray-400 text-base font-light leading-relaxed">
                Please connect with us on any questions or concerns you may have! Our team of grooming instrument specialists is ready to assist you.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+923196085514"
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-bold uppercase tracking-widest text-sm text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Phone icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                Call Us
              </a>

              <a
                href="mailto:biteinstruments@gmail.com"
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-bold uppercase tracking-widest text-sm text-yellow-400 border border-yellow-500 hover:bg-yellow-500/10 hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Envelope icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Email Us
              </a>

              <a
                href="https://wa.me/923196085514"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-bold uppercase tracking-widest text-sm text-[#0A1128] bg-gradient-to-r from-green-400 to-emerald-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* WhatsApp icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.557 4.116 1.519 5.847L.057 23.882l6.197-1.625A11.932 11.932 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.894 0-3.668-.502-5.2-1.378l-.373-.218-3.879 1.017 1.035-3.78-.24-.387A9.972 9.972 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                WhatsApp Us
              </a>
            </div>

            {/* Contact details */}
            <div className="flex flex-col gap-4">
              {[
                { icon: "📍", label: "Small Industrial Estate, Sialkot, Punjab 51310, Pakistan" },
                { icon: "📞", label: "+92 319 608 5514" },
                { icon: "✉️", label: "biteinstruments@gmail.com" },
                { icon: "🕐", label: "Mon – Sat: 9:00 AM – 6:00 PM (PKT)" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 text-gray-400 text-sm font-light">
                  <span className="text-base mt-0.5 flex-shrink-0">{item.icon}</span>
                  <span className="leading-relaxed">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Google Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ height: 300 }}>
              <iframe
                title="Bite Instruments — Sialkot Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54670.35786456637!2d74.47958605!3d32.4945392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391eedf49dab5561%3A0x9b3b6b8e8b8b8b8b!2sSialkot%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(190deg) saturate(0.8) brightness(0.75)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

          {/* ════════════════════════════
              RIGHT COLUMN — FORM
          ════════════════════════════ */}
          <div>
            <p className="text-white text-lg font-semibold tracking-wide mb-6">
              Please fill out the form below
            </p>

            {submitted ? (
              <div className="bg-white/5 backdrop-blur-md border border-yellow-500/30 p-10 rounded-2xl text-center shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-sm font-light">Thank you for reaching out. Our team will respond within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col gap-5"
              >
                {/* First Name + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Ali"
                      className="w-full bg-black/20 border border-white/20 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Ahmed"
                      className="w-full bg-black/20 border border-white/20 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-black/20 border border-white/20 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-black/20 border border-white/20 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Comments / Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about your grooming business, the tools you need, or any wholesale inquiry…"
                    className="w-full bg-black/20 border border-white/20 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all resize-none"
                  />
                </div>

                {/* Captcha placeholder */}
                <div className="flex items-center gap-4 bg-gray-100/5 border border-white/10 rounded-xl px-5 py-4 select-none">
                  <button
                    type="button"
                    onClick={() => setCaptchaChecked(!captchaChecked)}
                    className={`w-6 h-6 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all duration-200 ${
                      captchaChecked
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-400 hover:border-blue-400"
                    }`}
                  >
                    {captchaChecked && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                  </button>
                  <span className="text-gray-300 text-sm font-medium">I am not a robot</span>
                  <div className="ml-auto flex flex-col items-center gap-0.5 opacity-60">
                    {/* reCAPTCHA logo placeholder */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">rC</span>
                    </div>
                    <span className="text-gray-600 text-[8px] tracking-wide">reCAPTCHA</span>
                    <span className="text-gray-700 text-[7px]">Privacy · Terms</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
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
