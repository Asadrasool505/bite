import Link from "next/link";

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-[#050814] w-full pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-8 tracking-wide">
          Warranty & Returns
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase mb-12">Last Updated: May 24, 2026</p>

        <div className="space-y-10 text-gray-300 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">1. The BITE Instruments 100% Guarantee</h2>
            <p>
              At BITE Instruments, we manufacture professional-grade beauty, grooming, and dental instruments built to stand the test of time. Every single tool forged in our Sialkot manufacturing facilities is subject to strict quality assurance processes and comes with a <strong>100% replacement guarantee</strong> against manufacturing defects in materials and craftsmanship.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">2. B2B International Bulk Orders</h2>
            <p>
              We understand that for our B2B export partners and distributors, instrument reliability is critical to your brand reputation and bottom line. If a batch contains items with defects (e.g., alignment issues, blade tension variances, material flaws), we guarantee full replacements or credit adjustments. Our B2B warranty is structured to ensure that international distributors face zero financial loss due to product defects.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">3. Professional Claims Process</h2>
            <p>
              To ensure a swift resolution for bulk international orders, we have established a highly professional claims workflow:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 opacity-90">
              <li><strong>Submission:</strong> Contact your B2B account manager or email our support desk at <strong>biteinstruments@gmail.com</strong> within 90 days of order receipt.</li>
              <li><strong>Documentation:</strong> Provide photos or a brief video showing the defect, along with your original invoice and batch numbers.</li>
              <li><strong>Inspection:</strong> Our quality assurance team in Sialkot will inspect the digital claim within 3 business days.</li>
              <li><strong>Resolution:</strong> Approved replacement items will be manufactured immediately and shipped with your next cargo/shipment, or dispatched immediately via express DHL/FedEx if needed.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">4. Shipping & Handling of Defective Items</h2>
            <p>
              For bulk orders, international return shipping of defective items is often cost-prohibitive. In most cases, we do not require the physical return of defective instruments, provided that proper photographic or video documentation is supplied. If physical inspection is requested, BITE Instruments will cover all return shipping costs.
            </p>
          </section>
        </div>

        <div className="mt-16 text-center border-t border-white/10 pt-8">
          <Link href="/" className="inline-block px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:bg-white/10 text-yellow-500 border border-yellow-500">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
