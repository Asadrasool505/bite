import Link from "next/link";

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] w-full pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-16 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 font-black mb-4 tracking-wide">
          Warranty &amp; Returns
        </h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-amber-500 to-amber-300 mb-6 rounded-full" />
        <p className="text-slate-600 text-sm tracking-widest uppercase mb-12 font-medium">Last Updated: May 24, 2026</p>

        <div className="space-y-10 text-slate-900 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">1. The BITE Instruments 100% Guarantee</h2>
            <p>
              At BITE Instruments, we manufacture professional-grade beauty, grooming, and dental instruments built to stand the test of time. Every single tool forged in our Sialkot manufacturing facilities is subject to strict quality assurance processes and comes with a <strong className="text-amber-600">100% replacement guarantee</strong> against manufacturing defects in materials and craftsmanship.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">2. B2B International Bulk Orders</h2>
            <p>
              We understand that for our B2B export partners and distributors, instrument reliability is critical to your brand reputation and bottom line. If a batch contains items with defects (e.g., alignment issues, blade tension variances, material flaws), we guarantee full replacements or credit adjustments. Our B2B warranty is structured to ensure that international distributors face zero financial loss due to product defects.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">3. Professional Claims Process</h2>
            <p>
              To ensure a swift resolution for bulk international orders, we have established a highly professional claims workflow:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong className="text-slate-900 font-bold">Submission:</strong> Contact your B2B account manager or email our support desk at <strong className="text-amber-600">biteinstruments@gmail.com</strong> within 90 days of order receipt.</li>
              <li><strong className="text-slate-900 font-bold">Documentation:</strong> Provide photos or a brief video showing the defect, along with your original invoice and batch numbers.</li>
              <li><strong className="text-slate-900 font-bold">Inspection:</strong> Our quality assurance team in Sialkot will inspect the digital claim within 3 business days.</li>
              <li><strong className="text-slate-900 font-bold">Resolution:</strong> Approved replacement items will be manufactured immediately and shipped with your next cargo/shipment, or dispatched immediately via express DHL/FedEx if needed.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">4. Shipping &amp; Handling of Defective Items</h2>
            <p>
              For bulk orders, international return shipping of defective items is often cost-prohibitive. In most cases, we do not require the physical return of defective instruments, provided that proper photographic or video documentation is supplied. If physical inspection is requested, BITE Instruments will cover all return shipping costs.
            </p>
          </section>
        </div>

        <div className="mt-16 text-center border-t border-slate-200 pt-8">
          <Link href="/" className="inline-block px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}