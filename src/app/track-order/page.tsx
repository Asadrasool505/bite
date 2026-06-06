"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabaseClient";

export default function TrackOrderPage() {
  const { t } = useApp();
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [simulatedDays, setSimulatedDays] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Determine stage based on elapsed days
  const getStage = (days: number) => {
    if (days >= 0 && days <= 3) return 1;
    if (days >= 4 && days <= 7) return 2;
    if (days >= 8 && days <= 10) return 3;
    if (days >= 11 && days <= 13) return 4;
    return 5;
  };

  const currentStage = getStage(isSimulating ? simulatedDays : (orderData ? Math.floor((Date.now() - new Date(orderData.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0));
  const elapsedDays = isSimulating ? simulatedDays : (orderData ? Math.floor((Date.now() - new Date(orderData.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setLoading(true);
    setErrorMsg("");
    setOrderData(null);
    setIsSimulating(false);

    try {
      // Clean ID lookup: remove # prefix if entered
      const cleanedId = trackingId.replace("#", "").trim();
      const digitsOnly = cleanedId.replace(/[^0-9]/g, "");
      
      // Dynamic fallback in case Supabase is offline or unconfigured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("Supabase credentials missing. Activating high-fidelity local tracking simulation.");
        setErrorMsg(t("tracking_not_found"));
        setIsSimulating(true);
        setSimulatedDays(5);
        setLoading(false);
        return;
      }

      if (!digitsOnly) {
        setErrorMsg("Please enter a valid tracking reference containing numbers.");
        setIsSimulating(true);
        setSimulatedDays(5);
        setLoading(false);
        return;
      }

      const dbId = Number(digitsOnly);

      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", dbId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setOrderData(data);
      } else {
        // Safe demo fallback when searched ID does not exist in DB
        setErrorMsg(t("tracking_not_found"));
        setIsSimulating(true);
        setSimulatedDays(5); // Default to a realistic active stage 2
      }
    } catch (err) {
      console.warn("Sialkot factory server offline or lookup failed. Initializing simulation mode.", err);
      setErrorMsg(t("tracking_not_found"));
      setIsSimulating(true);
      setSimulatedDays(5);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <p className="text-[10px] font-black tracking-[0.4em] text-amber-600 uppercase mb-3">📦 B2B FACTORY LOGISTICS</p>
          <h1 className="text-3xl md:text-5xl font-serif text-slate-900 font-black tracking-wide mb-4">
            {t("track_order_title")}
          </h1>
          <p className="text-slate-900 text-sm font-light max-w-xl mx-auto leading-relaxed">
            Monitor real-time handcrafting, heat treatment, custom laser branding, and quality assurance processes directly from our Sialkot factory.
          </p>
        </div>

        {/* Enter ID Search Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-8">
          <form onSubmit={handleTrackSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                required
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder={t("tracking_id_placeholder")}
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-5 py-4 text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-amber-500 text-slate-950 hover:bg-amber-600 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] font-black uppercase tracking-widest text-xs rounded-xl transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Locating..." : t("track_button")}
            </button>
          </form>

          {/* Feedback/Error notices */}
          {errorMsg && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs rounded-xl leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}
        </div>

        {/* Timeline Status Display */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm">
          
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200 flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Active Order</p>
              <h3 className="text-slate-900 font-mono font-black text-lg mt-1 select-all">
                {orderData 
                  ? (String(orderData.id).length > 13 
                      ? `BITE-${String(orderData.id).slice(0, 13)}-${String(orderData.id).slice(13)}` 
                      : `BITE-${orderData.id}`)
                  : `DEMO-SIMULATOR-098`}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Production Progress</p>
              <h3 className="text-amber-600 font-black text-sm mt-1 uppercase tracking-wider">
                {elapsedDays} Days Elapsed (Stage {currentStage})
              </h3>
            </div>
          </div>

          {/* Dynamic Interactive Timeline Progress Bar */}
          <div className="relative mb-12 mt-6">
            <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-200 -translate-y-1/2 rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-[3px] bg-gradient-to-r from-amber-500 to-amber-300 -translate-y-1/2 rounded-full transition-all duration-700" 
              style={{ width: `${(currentStage - 1) * 25}%` }}
            />

            <div className="relative flex justify-between">
              {[1, 2, 3, 4, 5].map((stageNum) => (
                <div key={stageNum} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border font-black text-xs transition-all duration-500 ${
                      currentStage >= stageNum 
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]" 
                        : "bg-slate-100 text-slate-900 border-slate-300"
                    }`}
                  >
                    {stageNum}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details list of Stages */}
          <div className="space-y-6">
            
            {/* Stage 1 */}
            <div className={`p-5 rounded-xl border transition-all duration-300 ${
              currentStage === 1 
                ? "bg-amber-500/10 border-amber-500/30" 
                : currentStage > 1 
                  ? "bg-slate-50 border-slate-200 opacity-70" 
                  : "bg-slate-50 border-slate-200 opacity-40"
            }`}>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-amber-600 flex items-center gap-2">
                <span>{t("stage_1_title")}</span>
                {currentStage === 1 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-amber-500 text-slate-950">Active</span>}
              </h4>
              <p className="text-xs text-slate-900 font-light leading-relaxed">{t("stage_1_desc")}</p>
            </div>

            {/* Stage 2 */}
            <div className={`p-5 rounded-xl border transition-all duration-300 ${
              currentStage === 2 
                ? "bg-amber-500/10 border-amber-500/30" 
                : currentStage > 2 
                  ? "bg-slate-50 border-slate-200 opacity-70" 
                  : "bg-slate-50 border-slate-200 opacity-40"
            }`}>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-amber-600 flex items-center gap-2">
                <span>{t("stage_2_title")}</span>
                {currentStage === 2 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-amber-500 text-slate-950">Active</span>}
              </h4>
              <p className="text-xs text-slate-900 font-light leading-relaxed">{t("stage_2_desc")}</p>
            </div>

            {/* Stage 3 */}
            <div className={`p-5 rounded-xl border transition-all duration-300 ${
              currentStage === 3 
                ? "bg-amber-500/10 border-amber-500/30" 
                : currentStage > 3 
                  ? "bg-slate-50 border-slate-200 opacity-70" 
                  : "bg-slate-50 border-slate-200 opacity-40"
            }`}>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-amber-600 flex items-center gap-2">
                <span>{t("stage_3_title")}</span>
                {currentStage === 3 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-amber-500 text-slate-950">Active</span>}
              </h4>
              <p className="text-xs text-slate-900 font-light leading-relaxed">{t("stage_3_desc")}</p>
            </div>

            {/* Stage 4 */}
            <div className={`p-5 rounded-xl border transition-all duration-300 ${
              currentStage === 4 
                ? "bg-amber-500/10 border-amber-500/30" 
                : currentStage > 4 
                  ? "bg-slate-50 border-slate-200 opacity-70" 
                  : "bg-slate-50 border-slate-200 opacity-40"
            }`}>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-amber-600 flex items-center gap-2">
                <span>{t("stage_4_title")}</span>
                {currentStage === 4 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-amber-500 text-slate-950">Active</span>}
              </h4>
              <p className="text-xs text-slate-900 font-light leading-relaxed">{t("stage_4_desc")}</p>
            </div>

            {/* Stage 5 */}
            <div className={`p-5 rounded-xl border transition-all duration-300 ${
              currentStage === 5 
                ? "bg-amber-500/10 border-amber-500/30" 
                : "bg-slate-50 border-slate-200 opacity-40"
            }`}>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-amber-600 flex items-center gap-2">
                <span>{t("stage_5_title")}</span>
                {currentStage === 5 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-amber-500 text-slate-950">Active</span>}
              </h4>
              <p className="text-xs text-slate-900 font-light leading-relaxed">{t("stage_5_desc")}</p>
            </div>

          </div>

          {/* Interactive B2B Simulator Slider */}
          {isSimulating && (
            <div className="mt-10 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-center">
              <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mb-3">🛠️ Factory Auditing &amp; Tracking Simulation Mode</p>
              <p className="text-xs text-slate-900 font-light leading-relaxed mb-4">
                You are in interactive simulation mode. Drag the timeline controller to audit production milestones day-by-day.
              </p>
              <div className="flex flex-col gap-2 max-w-md mx-auto">
                <input 
                  type="range" 
                  min="0" 
                  max="16" 
                  value={simulatedDays}
                  onChange={(e) => setSimulatedDays(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-900 mt-1 uppercase font-bold tracking-wider">
                  <span>Day 0 (Order Placed)</span>
                  <span>Day 8 (Engraving)</span>
                  <span>Day 14+ (Dispatched)</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}