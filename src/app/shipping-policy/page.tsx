import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Official Shipping Policy | BITE Instruments",
  description: "Read the official BITE Instruments shipping terms, dispatch handling rules, courier transit estimates, 1-year product warranty details, and our 30-day money-back satisfaction guarantee.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] w-full pt-32 pb-24 px-6 layout-ash-white">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-16 shadow-lg">
        <span className="text-[10px] font-black tracking-[0.4em] text-amber-600 uppercase mb-3 block">BITE Instruments Global Logistics</span>
        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4 tracking-wide font-extrabold">
          Shipping & Transit Policy
        </h1>
        <p className="text-slate-500 text-xs tracking-widest uppercase mb-12">Effective Date: June 2026</p>

        <div className="space-y-10 text-slate-700 font-light leading-relaxed">
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wider">
              1. Global Carrier & Logistics
            </h2>
            <p className="text-slate-600">
              To ensure secure delivery of our high-precision tools, all shipments are sent globally via 
              <strong className="text-slate-900 font-semibold"> DHL Express and FedEx Priority air courier </strong> 
              direct from our main Sialkot factory.
            </p>
          </section>

          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wider">
              2. Dispatch & Handling Times
            </h2>
            <p className="text-slate-600">
              For in-stock inventory items, please allow 
              <strong className="text-slate-900 font-semibold"> 2-4 business days </strong> 
              to perform our comprehensive quality inspection checks. This includes precision tension testing, blade alignment verification, quality certification, and protective oil sealing.
            </p>
          </section>

          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wider">
              3. Courier Transit Estimates
            </h2>
            <p className="text-slate-600">
              Once handed over to our premium courier partners, average delivery duration is 
              <strong className="text-slate-900 font-semibold"> 7-10 business days </strong> 
              worldwide, depending on direct flight routing and standard customs check-in clearances.
            </p>
          </section>

          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wider">
              4. 1-Year Factory-Backed Warranty
            </h2>
            <p className="text-slate-600">
              BITE Instruments proudly offers a 
              <strong className="text-slate-900 font-semibold"> 1-year factory-backed warranty </strong> 
              protecting your investment against structural steel defects, misaligned blades, or tension dial failures under professional usage guidelines.
            </p>
          </section>

          <section className="pb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wider">
              5. 30-Day Money-Back Guarantee
            </h2>
            <p className="text-slate-600">
              We stand behind our craftsmanship with a 
              <strong className="text-slate-900 font-semibold"> 30-day money-back satisfaction guarantee </strong>. 
              If the instruments do not meet your expectations, they may be returned for a full refund (please note: the importer/client covers all return courier transit fees).
            </p>
          </section>
        </div>

        <div className="mt-16 text-center border-t border-slate-100 pt-8">
          <Link href="/" className="inline-block px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all bg-amber-500 text-slate-950 hover:bg-amber-600">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
