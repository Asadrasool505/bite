"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp, t } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, {
          full_name: fullName,
          company_name: companyName,
          whatsapp: whatsapp,
        });
        setSuccess("B2B registration successful! You can now log in.");
        setFullName("");
        setCompanyName("");
        setWhatsapp("");
        setEmail("");
        setPassword("");
        setIsSignUp(false); // shift to sign in
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050814]/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0A1128]/95 dark:bg-[#0A1128]/95 light:bg-white border border-yellow-500/20 rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-yellow-500 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-white text-3xl font-serif tracking-wider block leading-none">Bite</span>
          <span className="text-yellow-500 text-[9px] tracking-[0.35em] uppercase font-bold mt-1 block">Instruments</span>
          
          <h2 className="text-xl md:text-2xl font-bold text-gray-200 mt-6 font-serif">
            {isSignUp ? "B2B Registration" : t("sign_in_title")}
          </h2>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-xl text-xs text-red-200 bg-red-950/40 border border-red-500/20 leading-relaxed">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl text-xs text-green-200 bg-green-950/40 border border-green-500/20 leading-relaxed">
            {success}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Elite Groomers LLC"
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">WhatsApp / Phone Number</label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+1 555-0199"
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{isSignUp ? "Business Email" : "Email Address"}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 transition-all duration-300 mt-2"
          >
            {loading ? "Processing..." : isSignUp ? "Submit B2B Register" : t("login")}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-white/5 pt-6 text-xs text-gray-400">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => { setIsSignUp(false); setError(""); setSuccess(""); }}
                className="text-yellow-500 font-bold hover:underline"
              >
                {t("login")}
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => { setIsSignUp(true); setError(""); setSuccess(""); }}
                className="text-yellow-500 font-bold hover:underline"
              >
                {t("register")}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
