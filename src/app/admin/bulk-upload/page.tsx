"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BulkUploadAdmin() {
  const [jsonInput, setJsonInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!jsonInput.trim()) {
      setStatus("error");
      setMessage("Please paste some JSON data first.");
      return;
    }

    try {
      setStatus("loading");
      setMessage("Processing JSON data...");

      // Parse JSON
      const data = JSON.parse(jsonInput);
      const items = Array.isArray(data) ? data : [data];

      // Add branding to descriptions
      const brandedItems = items.map((item) => {
        let newDesc = item.description || "";
        if (!newDesc.includes("Bite Instruments")) {
          newDesc = newDesc.trim() + " Handcrafted by Bite Instruments, Sialkot.";
        }
        
        // Auto-generate ID if missing
        if (!item.id) {
            const slug = (item.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-');
            item.id = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
        }
        
        // Handle images array
        let imagesArray = item.images;
        if (!imagesArray && item.image_url) {
            imagesArray = [item.image_url];
        }

        return {
          ...item,
          description: newDesc,
          images: imagesArray || []
        };
      });

      // Insert into Supabase
      const { error } = await supabase.from("pet_products").insert(brandedItems);

      if (error) {
        throw new Error(error.message);
      }

      setStatus("success");
      setMessage("All Products Imported Successfully to Bite Instruments Database!");
      setJsonInput(""); // Clear on success
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setMessage(error.message || "Invalid JSON format or database error.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] w-full pt-24 pb-20 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
        <h1 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-2">
          Admin: Bulk Product Import
        </h1>
        <p className="text-gray-400 text-sm font-light mb-8">
          Paste an array of JSON objects representing your scraped products. The system will automatically inject the Bite Instruments branding and push them to the Supabase database.
        </p>

        {/* Text Area */}
        <div className="relative mb-6">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="[ { &quot;name&quot;: &quot;...&quot;, &quot;category&quot;: &quot;straight-shears&quot; } ]"
            className="w-full h-96 bg-[#0A1128] border border-white/10 text-gray-300 font-mono text-sm rounded-xl p-6 outline-none focus:border-yellow-500/50 transition-colors resize-y shadow-inner"
            spellCheck="false"
          />
        </div>

        {/* Status Message */}
        {status !== "idle" && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-medium border ${
              status === "error"
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : status === "success"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
            }`}
          >
            {status === "loading" && (
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-yellow-400 inline" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {message}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleUpload}
          disabled={status === "loading"}
          className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm text-[#0A1128] bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Uploading to Supabase..." : "Execute Bulk Upload"}
        </button>
      </div>
    </div>
  );
}
