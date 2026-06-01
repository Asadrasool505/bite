import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#050814] w-full pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-8 tracking-wide">
          Shipping Policy
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase mb-12">Last Updated: May 24, 2026</p>

        <div className="space-y-10 text-gray-300 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">1. Global Logistics & Export Hub</h2>
            <p>
              BITE Instruments is a premium manufacturer and exporter of professional beauty, grooming, and dental instruments. All our orders are securely packaged and shipped directly from our primary export facility located in the **Small Industrial Estate, Sialkot, Pakistan**—the world's historic hub for high-quality metal instrument manufacturing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">2. Shipping Methods & Carriers</h2>
            <p>
              To accommodate the diverse logistics needs of our global distributors, wholesalers, and B2B partners, we offer flexible air and sea shipping models:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-3 opacity-90">
              <li><strong>Express Air Courier (DHL / FedEx):</strong> Recommended for sample orders, small wholesale batches, or urgent restocking. Typical transit time is 3 to 7 business days worldwide, complete with real-time end-to-end tracking.</li>
              <li><strong>Air Cargo:</strong> Suited for medium-to-large bulk shipments where speed is essential but shipping cost efficiency is required. Consignments are cleared and delivered to your designated international airport for customs release.</li>
              <li><strong>Sea Cargo (FCL / LCL):</strong> Designed for heavy, high-volume bulk sea shipments and container orders. We operate under flexible FOB (Free On Board), CIF (Cost, Insurance, and Freight), or Ex-Works terms based on your B2B purchase agreement.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">3. Lead Times & Order Dispatch</h2>
            <p>
              Our handcrafted instruments undergo careful tension checks, blade sharpening, and alignment adjustments before shipping:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 opacity-90">
              <li><strong>In-Stock Items:</strong> Dispatched within 2 to 5 business days from Sialkot.</li>
              <li><strong>Custom / Bulk B2B Orders:</strong> Lead times range from 3 to 6 weeks depending on batch volume, custom laser-branding requirements, and production schedules. Your account manager will specify the exact production timeline during the quote finalization.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">4. Customs, Duties & Documentation</h2>
            <p>
              As a certified exporter, BITE Instruments supplies all mandatory shipping documentation required for smooth customs clearance, including Commercial Invoices, Packing Lists, Certificates of Origin, and Bill of Lading / Airway Bills. Please note that the importer of record is responsible for all customs clearance fees, import duties, and local taxes within their respective country.
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
