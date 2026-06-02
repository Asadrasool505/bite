"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";

interface CatalogueModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CatalogueModal({ open, onClose }: CatalogueModalProps) {
  const { t } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
  });

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/catalogue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSuccess(true);
      setFormData({ name: "", company: "", email: "", phone: "" });
    } catch (err: any) {
      console.error("Error submitting catalogue request:", err);
      alert(`Submission failed: ${err.message || "Please check your connection and try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#050814]/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#0A1128]/90 border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Decorative corner glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-white/5 bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
              <svg className="w-8 h-8 text-[#0A1128]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-white mb-4 tracking-wide">
              {t("request_received")}
            </h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">
              {t("catalogue_success_desc")}
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all hover:shadow-[0_0_15px_rgba(250,204,21,0.3)] cursor-pointer"
            >
              {t("continue_browsing")}
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-serif text-white mb-2 tracking-wide text-center uppercase">
              {t("catalogue_modal_title")}
            </h3>
            <p className="text-gray-400 text-xs font-light leading-relaxed text-center mb-8 max-w-sm mx-auto">
              {t("catalogue_modal_desc")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 block">
                  {t("name_label")}
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#050814]/60 border border-white/15 rounded-xl px-4 py-3.5 text-white text-xs focus:border-yellow-500 outline-none transition-all font-light"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 block">
                  {t("company_label")}
                </label>
                <input
                  required
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-[#050814]/60 border border-white/15 rounded-xl px-4 py-3.5 text-white text-xs focus:border-yellow-500 outline-none transition-all font-light"
                  placeholder="Luxury Pet Distributors Co."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 block">
                  {t("email_label")}
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#050814]/60 border border-white/15 rounded-xl px-4 py-3.5 text-white text-xs focus:border-yellow-500 outline-none transition-all font-light"
                  placeholder="john@company.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 block">
                  {t("phone_label")}
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#050814]/60 border border-white/15 rounded-xl px-4 py-3.5 text-white text-xs focus:border-yellow-500 outline-none transition-all font-light"
                  placeholder="+1 (234) 567-8900"
                />
              </div>

              <button
                disabled={loading}
                className="w-full py-4.5 rounded-xl font-black uppercase tracking-[0.2em] text-xs text-[#0A1128] bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 shadow-[0_5px_15px_rgba(250,204,21,0.2)] hover:shadow-[0_10px_25px_rgba(250,204,21,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 cursor-pointer mt-4"
              >
                {loading ? t("processing") : t("submit_request")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
