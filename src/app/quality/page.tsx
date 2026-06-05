import Link from "next/link";

export default function QualityPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] w-full pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-16 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 font-black mb-4 tracking-wide">
          Quality Guarantee
        </h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-amber-500 to-amber-300 mb-6 rounded-full" />
        <p className="text-slate-600 text-sm tracking-widest uppercase mb-12 font-medium">Last Updated: May 24, 2026</p>

        <div className="space-y-10 text-slate-900 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">1. Heritage of Manufacturing Excellence</h2>
            <p>BITE Instruments is dedicated to forging the highest-caliber beauty, grooming, and dental instruments in the industry. Combining Sialkot&apos;s legendary craftsmanship with modern technical manufacturing innovations, we produce instruments that meet the precise requirements of master professionals worldwide.</p>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">2. Premium Alloys &amp; Materials</h2>
            <p>The foundation of every BITE Instrument is its metallurgical integrity. We construct our instruments from carefully selected premium alloys:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong className="font-bold">Japanese SUS440C &amp; J2 Stainless Steel:</strong> Renowned for extreme hardness, superior edge retention, and outstanding rust resistance.</li>
              <li><strong className="font-bold">Medical-Grade Austenitic Steel:</strong> Utilized for our professional beauty and dental lines, ensuring exceptional durability and sterilization tolerance.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">3. ISO &amp; CE Compliance Tracking</h2>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong className="font-bold">ISO 9001:2015 Certified:</strong> Internal management and factory processes conform to international quality protocols.</li>
              <li><strong className="font-bold">CE Marking Compliance:</strong> All dental and healthcare instruments conform to European health, safety, and environmental protection regulations.</li>
              <li><strong className="font-bold">Batch Traceability:</strong> Every batch is tracked from raw ingot to shipping container.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">4. Precise Hand-Tuning &amp; Alignment</h2>
            <p>Every scissor blade, plier jaw, and shear edge is hand-honed and precision-aligned by master artisans in Sialkot. No instrument leaves our facility without passing a rigorous manual cutting test, ensuring a butter-smooth feel, perfect tension, and unmatched sharpness straight out of the box.</p>
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