"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface CatalogueRequest {
  id: number;
  client_name: string;
  company_name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface SampleRequest {
  id: number;
  client_name: string;
  company_name: string;
  email: string;
  phone: string;
  courier_account: string | null;
  product_details: string | null;
  created_at: string;
}

interface QuoteRequest {
  id: number;
  quote_reference: string;
  client_name: string;
  company_name: string;
  email: string;
  phone: string;
  cart_items: Array<{ name: string; price: number; quantity: number; sku?: string }>;
  custom_branding_text: string | null;
  created_at: string;
}

interface ProductionOrder {
  id: number;
  client_name: string;
  company_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  items: any;
  created_at: string;
}

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<"catalog" | "samples" | "quotes" | "tracked">("catalog");

  // Real-time Data States
  const [catalogRequests, setCatalogRequests] = useState<CatalogueRequest[]>([]);
  const [sampleRequests, setSampleRequests] = useState<SampleRequest[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [trackedOrders, setTrackedOrders] = useState<ProductionOrder[]>([]);
  
  // Loading & Action States
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Production Tracker Form Modal State
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [generatedTrackingCode, setGeneratedTrackingCode] = useState<number>(0);
  const [customDestination, setCustomDestination] = useState("");
  const [customStartDate, setCustomStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [registeringTracker, setRegisteringTracker] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  // Authenticate Admin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        // Store simple token in sessionStorage
        sessionStorage.setItem("bite_admin_token", data.token);
      } else {
        setAuthError(data.error || "Access Denied: Incorrect password.");
      }
    } catch (err) {
      setAuthError("Network failure verifying credentials.");
    } finally {
      setVerifying(false);
    }
  };

  // Fetch all Supabase data rows
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Catalogue Requests
      const { data: catData, error: catErr } = await supabase
        .from("catalogue_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (!catErr && catData) setCatalogRequests(catData);

      // 2. Fetch Sample Requests
      const { data: sampleData, error: sampleErr } = await supabase
        .from("sample_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (!sampleErr && sampleData) setSampleRequests(sampleData);

      // 3. Fetch Quote Requests
      const { data: quoteData, error: quoteErr } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (!quoteErr && quoteData) setQuoteRequests(quoteData);

      // 4. Fetch Tracked Orders (from 'quotes' table)
      const { data: trackData, error: trackErr } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });
      if (!trackErr && trackData) setTrackedOrders(trackData);

    } catch (error) {
      console.error("Error fetching administrative data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check existing session
  useEffect(() => {
    setMounted(true);
    const token = sessionStorage.getItem("bite_admin_token");
    if (token === "bite_admin_secure_session_2026") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  // Open Issue Tracker Form
  const openTrackerModal = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    // Generate numeric tracking code fitting in BIGINT quotes.id: e.g. 202600 + index or random 4 digits
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCodeNum = Number(`2026${randomSuffix}`);
    setGeneratedTrackingCode(trackingCodeNum);
    setCustomDestination("United States"); // default
    setCustomStartDate(new Date().toISOString().split("T")[0]);
    setActionSuccessMsg("");
  };

  // Submit Issue Production Tracker to Supabase quotes table
  const handleRegisterTracker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;
    setRegisteringTracker(true);

    try {
      const { error } = await supabase.from("quotes").insert([
        {
          id: generatedTrackingCode,
          client_name: selectedQuote.client_name,
          company_name: selectedQuote.company_name || 'Retailer / Individual',
          email: selectedQuote.email,
          phone: selectedQuote.phone,
          shipping_address: customDestination || "Global Export",
          items: selectedQuote.cart_items,
          created_at: new Date(customStartDate).toISOString(),
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      setActionSuccessMsg(`Success! Order #${generatedTrackingCode} registered in the Sialkot Factory database! Client can now track it live at /track-order.`);
      fetchAllData(); // Refresh list to show newly tracked items
      
      // Auto close modal after brief delay
      setTimeout(() => {
        setSelectedQuote(null);
      }, 3000);
    } catch (err: any) {
      alert(`Factory Registry Error: ${err.message}`);
    } finally {
      setRegisteringTracker(false);
    }
  };

  // Log out Admin
  const handleLogout = () => {
    sessionStorage.removeItem("bite_admin_token");
    setIsAuthenticated(false);
    setPassword("");
  };

  // Calculate total price of cart items
  const calculateTotal = (items: any[]) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
  };

  // Mount guard to prevent SSR hydration warnings from locale/date mismatches
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col justify-center items-center p-6 relative overflow-hidden">
        <svg className="animate-spin h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  // Password Gating Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col justify-center items-center p-6 relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <span className="text-[10px] font-black tracking-[0.4em] text-yellow-500 uppercase mb-3 block">🔒 Secure Administrative Access</span>
            <h1 className="text-3xl font-serif text-white tracking-wide mb-2">Bite Portal Cockpit</h1>
            <p className="text-gray-400 text-xs font-light">
              Authorized personnel only. Please input the Sialkot administrator access code.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Access Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••••••••••••••"
                className="w-full bg-[#0A1128]/70 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-500 outline-none transition-all font-mono tracking-widest text-center"
              />
            </div>

            {authError && (
              <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-xl text-center font-medium">
                ❌ {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs text-[#0A1128] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] active:translate-y-px hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
            >
              {verifying ? "Authorizing Entry..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-28 pb-20 px-6 md:px-12 transition-colors duration-300 ${isDarkMode ? "bg-[#050814] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 md:pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-yellow-500 text-[#0A1128] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Global Executive Division</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Live Sync Active</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-wide">
            B2B Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">Control Panel</span>
          </h1>
          <p className={`text-xs font-light mt-2 ${isDarkMode ? "text-gray-400" : "text-slate-600"}`}>
            Comprehensive real-time tracking, quality evaluation requests, and custom Sialkot factory production workflow automation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh button */}
          <button 
            onClick={fetchAllData}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              isDarkMode 
                ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            🔄 Refresh Data
          </button>

          {/* Theme switcher */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              isDarkMode 
                ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* Logout button */}
          <button 
            onClick={handleLogout}
            className="px-4 py-2.5 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all"
          >
            🔒 Logout
          </button>
        </div>
      </div>

      {/* METRIC COUNTER CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className={`p-6 border rounded-2xl transition-all ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Catalog Requests</span>
            <span className="text-xl">📋</span>
          </div>
          <h3 className="text-3xl font-bold font-mono">{catalogRequests.length}</h3>
          <p className={`text-[10px] mt-1 uppercase font-bold tracking-wider ${isDarkMode ? "text-gray-500" : "text-slate-400"}`}>Active inquiries in database</p>
        </div>

        <div className={`p-6 border rounded-2xl transition-all ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Evaluation Samples</span>
            <span className="text-xl">📦</span>
          </div>
          <h3 className="text-3xl font-bold font-mono">{sampleRequests.length}</h3>
          <p className={`text-[10px] mt-1 uppercase font-bold tracking-wider ${isDarkMode ? "text-gray-500" : "text-slate-400"}`}>Complimentary leads logged</p>
        </div>

        <div className={`p-6 border rounded-2xl transition-all ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Cart Quotes</span>
            <span className="text-xl">💰</span>
          </div>
          <h3 className="text-3xl font-bold font-mono">{quoteRequests.length}</h3>
          <p className={`text-[10px] mt-1 uppercase font-bold tracking-wider ${isDarkMode ? "text-gray-500" : "text-slate-400"}`}>B2B Quotes to convert</p>
        </div>

        <div className={`p-6 border rounded-2xl transition-all ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Tracked Orders</span>
            <span className="text-xl">⚙️</span>
          </div>
          <h3 className="text-3xl font-bold font-mono text-emerald-400">{trackedOrders.length}</h3>
          <p className={`text-[10px] mt-1 uppercase font-bold tracking-wider ${isDarkMode ? "text-gray-500" : "text-slate-400"}`}>Live factory timelines</p>
        </div>
      </div>

      {/* THREE-TAB DATA GRID SECTION */}
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`py-4 px-6 border-b-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "catalog"
                ? "border-yellow-500 text-yellow-500 bg-yellow-500/5"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            📋 Catalogue Inquiries ({catalogRequests.length})
          </button>
          
          <button
            onClick={() => setActiveTab("samples")}
            className={`py-4 px-6 border-b-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "samples"
                ? "border-yellow-500 text-yellow-500 bg-yellow-500/5"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            📦 Free Samples ({sampleRequests.length})
          </button>
          
          <button
            onClick={() => setActiveTab("quotes")}
            className={`py-4 px-6 border-b-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "quotes"
                ? "border-yellow-500 text-yellow-500 bg-yellow-500/5"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            💰 Wholesale Cart Quotes ({quoteRequests.length})
          </button>

          <button
            onClick={() => setActiveTab("tracked")}
            className={`py-4 px-6 border-b-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "tracked"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            ⚙️ Active Factory Orders ({trackedOrders.length})
          </button>
        </div>

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="py-20 text-center flex flex-col justify-center items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400 text-xs font-light uppercase tracking-widest">Fetching rows from Supabase Cloud Grid...</p>
          </div>
        ) : (
          <div className="relative">
            
            {/* TAB 1: CATALOGUE INQUIRIES */}
            {activeTab === "catalog" && (
              <div className={`border rounded-2xl overflow-hidden ${isDarkMode ? "bg-[#0A1128]/50 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b font-black uppercase tracking-widest ${isDarkMode ? "bg-white/5 border-white/10 text-gray-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                        <th className="p-4">Date Submitted</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Company Name</th>
                        <th className="p-4">Country</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">WhatsApp/Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {catalogRequests.map((req) => (
                        <tr key={req.id} className={`hover:bg-yellow-500/5 transition-colors ${!isDarkMode && "divide-slate-100"}`}>
                          <td className="p-4 font-mono font-medium text-gray-500">
                            {new Date(req.created_at).toLocaleString()}
                          </td>
                          <td className="p-4 font-bold">{req.client_name}</td>
                          <td className="p-4">{req.company_name}</td>
                          <td className="p-4 text-yellow-500 font-bold">International (B2B)</td>
                          <td className="p-4">
                            <a href={`mailto:${req.email}`} className="text-blue-400 hover:underline">{req.email}</a>
                          </td>
                          <td className="p-4 font-mono">{req.phone}</td>
                        </tr>
                      ))}
                      {catalogRequests.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-gray-500 uppercase tracking-wider font-light">
                            No catalogue requests logged in database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: FREE SAMPLE REQUESTS */}
            {activeTab === "samples" && (
              <div className={`border rounded-2xl overflow-hidden ${isDarkMode ? "bg-[#0A1128]/50 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b font-black uppercase tracking-widest ${isDarkMode ? "bg-white/5 border-white/10 text-gray-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                        <th className="p-4">Date</th>
                        <th className="p-4">Buyer Name</th>
                        <th className="p-4">Company Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">FedEx/DHL Account</th>
                        <th className="p-4">Requested Item Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sampleRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-yellow-500/5 transition-colors">
                          <td className="p-4 font-mono text-gray-500">
                            {new Date(req.created_at).toLocaleString()}
                          </td>
                          <td className="p-4 font-bold">{req.client_name}</td>
                          <td className="p-4">{req.company_name}</td>
                          <td className="p-4">
                            <a href={`mailto:${req.email}`} className="text-blue-400 hover:underline">{req.email}</a>
                          </td>
                          <td className="p-4 font-mono">{req.phone || "N/A"}</td>
                          <td className="p-4">
                            {req.courier_account ? (
                              <span className="px-2.5 py-1 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-mono font-bold uppercase tracking-wider text-[10px]">
                                {req.courier_account}
                              </span>
                            ) : (
                              <span className="text-gray-500 italic">Freight Coordination Needed</span>
                            )}
                          </td>
                          <td className="p-4 max-w-xs truncate" title={req.product_details || "N/A"}>
                            {req.product_details || "N/A"}
                          </td>
                        </tr>
                      ))}
                      {sampleRequests.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-gray-500 uppercase tracking-wider font-light">
                            No complimentary sample requests in database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: WHOLESALE CART QUOTES */}
            {activeTab === "quotes" && (
              <div className={`border rounded-2xl overflow-hidden ${isDarkMode ? "bg-[#0A1128]/50 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b font-black uppercase tracking-widest ${isDarkMode ? "bg-white/5 border-white/10 text-gray-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                        <th className="p-4">Date</th>
                        <th className="p-4">Quote Ref</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Cart Items Payload</th>
                        <th className="p-4">Contract Value</th>
                        <th className="p-4">Laser Engraving Text</th>
                        <th className="p-4 text-center">Automation Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {quoteRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-yellow-500/5 transition-colors">
                          <td className="p-4 font-mono text-gray-500">
                            {new Date(req.created_at).toLocaleString()}
                          </td>
                          <td className="p-4 font-mono font-black text-yellow-500 uppercase">
                            #{req.quote_reference}
                          </td>
                          <td className="p-4">
                            <div className="font-bold">{req.client_name}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{req.company_name}</div>
                            <div className="text-[10px] text-gray-400 mt-1">{req.email} | {req.phone}</div>
                          </td>
                          <td className="p-4 max-w-xs">
                            <div className="space-y-1">
                              {req.cart_items && Array.isArray(req.cart_items) ? (
                                req.cart_items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between gap-4 text-[10px] border-b border-white/5 pb-0.5">
                                    <span className="truncate text-gray-300 font-light" title={item.name}>{item.name}</span>
                                    <span className="font-bold text-gray-500">x{item.quantity}</span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-500">Empty Payload</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-mono font-extrabold text-sm text-yellow-400">
                            ${calculateTotal(req.cart_items).toFixed(2)}
                          </td>
                          <td className="p-4 italic max-w-[150px] truncate" title={req.custom_branding_text || "None"}>
                            {req.custom_branding_text ? (
                              <span className="text-yellow-100 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 text-[10px]">
                                🖋️ "{req.custom_branding_text}"
                              </span>
                            ) : (
                              <span className="text-gray-500">Standard (None)</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => openTrackerModal(req)}
                              className="px-3.5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] text-[#0A1128] font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all cursor-pointer"
                            >
                              ⚙️ Issue Production Tracker
                            </button>
                          </td>
                        </tr>
                      ))}
                      {quoteRequests.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-gray-500 uppercase tracking-wider font-light">
                            No wholesale quotes submitted in database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: ACTIVE FACTORY ORDERS */}
            {activeTab === "tracked" && (
              <div className={`border rounded-2xl overflow-hidden ${isDarkMode ? "bg-[#0A1128]/50 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b font-black uppercase tracking-widest ${isDarkMode ? "bg-white/5 border-white/10 text-gray-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                        <th className="p-4">Tracking Code</th>
                        <th className="p-4">Client / Company Name</th>
                        <th className="p-4">Destination Country</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Products Quantity</th>
                        <th className="p-4">Tracking Timeline Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {trackedOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-emerald-500/5 transition-colors">
                          <td className="p-4 font-mono font-black text-emerald-400 uppercase">
                            BITE-2026-{String(ord.id).slice(-4)}
                            <div className="text-[9px] text-gray-500 font-mono mt-0.5">Raw DB ID: #{ord.id}</div>
                          </td>
                          <td className="p-4 font-bold">
                            {ord.client_name}
                            <span className="block text-[10px] text-gray-500 font-light mt-0.5">{ord.company_name}</span>
                          </td>
                          <td className="p-4 font-bold text-yellow-500">{ord.shipping_address || "Global Delivery"}</td>
                          <td className="p-4">
                            <div>{ord.email}</div>
                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">{ord.phone}</div>
                          </td>
                          <td className="p-4 font-mono">
                            {Array.isArray(ord.items) 
                              ? ord.items.reduce((sum: number, it: any) => sum + (it.quantity || 0), 0)
                              : "Custom Bulk order"
                            } Items
                          </td>
                          <td className="p-4">
                            <a
                              href={`/track-order?id=${ord.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 rounded-lg font-bold uppercase tracking-widest text-[9px] transition-all"
                            >
                              🌐 Track Live Milestones ➔
                            </a>
                          </td>
                        </tr>
                      ))}
                      {trackedOrders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-gray-500 uppercase tracking-wider font-light">
                            No active production orders registered in factory.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* AUTOMATION DIALOG MODAL (ISSUE PRODUCTION TRACKER FORM) */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#02040a]/90 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0A1128] border border-white/10 rounded-3xl p-8 shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="text-[9px] bg-yellow-500/15 text-yellow-500 font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                ⚙️ Sialkot Automated Workflow Engine
              </span>
              <h2 className="text-2xl font-serif text-white tracking-wide mt-3 mb-2">Issue Production Tracker</h2>
              <p className="text-gray-400 text-xs font-light">
                Initialize B2B handforging, heat treatment, custom engraving studio parameters, and push the live tracker to the client portal.
              </p>
            </div>

            {actionSuccessMsg ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-xs leading-relaxed space-y-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <span className="font-bold uppercase tracking-widest text-[10px]">Registry Successful!</span>
                </div>
                <p>{actionSuccessMsg}</p>
                <div className="font-mono bg-[#050814] p-3 rounded-xl border border-white/5 text-[10px] text-gray-500 text-center">
                  Live URL: /track-order?id={generatedTrackingCode}
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterTracker} className="space-y-5 text-xs">
                
                {/* Meta data display */}
                <div className="bg-[#050814]/70 border border-white/5 rounded-2xl p-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider block">Customer</span>
                    <strong className="text-white text-xs">{selectedQuote.client_name}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider block">Quote Contract Value</span>
                    <strong className="text-yellow-500 text-xs">${calculateTotal(selectedQuote.cart_items).toFixed(2)} USD</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider block">Quote Ref</span>
                    <strong className="text-white font-mono text-xs">#{selectedQuote.quote_reference}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider block">Custom Brand Request</span>
                    <strong className="text-yellow-400 text-xs italic">
                      {selectedQuote.custom_branding_text ? `"${selectedQuote.custom_branding_text}"` : "Standard Plain Shears"}
                    </strong>
                  </div>
                </div>

                {/* Tracking Code Auto Generator */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Auto Generated Unique BIGINT Tracking ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled
                      value={`BITE-2026-${String(generatedTrackingCode).slice(-4)} (DB Row: #${generatedTrackingCode})`}
                      className="w-full bg-[#050814] border border-white/10 rounded-xl px-4 py-3.5 text-yellow-500 font-mono font-bold text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                        setGeneratedTrackingCode(Number(`2026${randomSuffix}`));
                      }}
                      className="px-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold uppercase cursor-pointer"
                    >
                      🔄 Regenerate
                    </button>
                  </div>
                </div>

                {/* Edit Destination */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Destination Address (Country / City)</label>
                  <input
                    type="text"
                    required
                    value={customDestination}
                    onChange={(e) => setCustomDestination(e.target.value)}
                    placeholder="e.g. United States, Texas Office"
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none"
                  />
                </div>

                {/* Edit Custom Timeline Start Date */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Milestone Clock Commencement Date</label>
                  <input
                    type="date"
                    required
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none font-mono"
                  />
                  <p className="text-[10px] text-gray-500 font-light italic">
                    Modifying this date will adjust the "Days Elapsed" timeline on the factory tracker client interface.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => setSelectedQuote(null)}
                    className="w-1/2 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white rounded-xl font-black uppercase tracking-widest text-gray-400 cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={registeringTracker}
                    className="w-1/2 py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-[#0A1128] font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer text-center disabled:opacity-50"
                  >
                    {registeringTracker ? "Registering in DB..." : "Confirm & Launch Tracker 🚀"}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
