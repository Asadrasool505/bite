import Link from "next/link";

export default function QualityPage() {
  return (
    <div className="min-h-screen bg-[#050814] w-full pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-8 tracking-wide">
          Quality Guarantee
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase mb-12">Last Updated: May 24, 2026</p>

        <div className="space-y-10 text-gray-300 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">1. Heritage of Manufacturing Excellence</h2>
            <p>
              BITE Instruments is dedicated to forging the highest-caliber beauty, grooming, and dental instruments in the industry. Combining Sialkot’s legendary craftsmanship with modern technical manufacturing innovations, we produce instruments that meet the precise requirements of master professionals worldwide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">2. Premium Alloys & Materials</h2>
            <p>
              The foundation of every BITE Instrument is its metallurgical integrity. We construct our instruments from carefully selected premium alloys:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 opacity-90">
              <li><strong>Japanese SUS440C & J2 Stainless Steel:</strong> Renowned for extreme hardness, superior edge retention, and outstanding rust resistance, these alloys are hand-forged for our professional shears and grooming collections.</li>
              <li><strong>Medical-Grade Austenitic Steel:</strong> Utilized for our professional beauty and dental lines, ensuring exceptional durability, sterilization tolerance, and complete chemical resistance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">3. ISO & CE Compliance Tracking</h2>
            <p>
              To maintain the highest levels of accuracy and reliability for our bulk international export partners, our Sialkot manufacturing facilities operate under comprehensive quality tracking programs:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 opacity-90">
              <li><strong>ISO 9001:2015 Certified:</strong> Ensuring our internal management, raw material sourcing, and factory processes conform to standard international quality protocols.</li>
              <li><strong>CE Marking Compliance:</strong> All instruments intended for dental and healthcare operations conform to standard European health, safety, and environmental protection regulations.</li>
              <li><strong>Batch Traceability:</strong> Every batch is tracked from raw ingot to shipping container, ensuring comprehensive material accountability.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">4. Precise Hand-Tuning & Alignment</h2>
            <p>
              While we utilize advanced computer-controlled machinery for structural consistency, every scissor blade, plier jaw, and shear edge is hand-honed and precision-aligned by master artisans in Sialkot. No instrument leaves our facility without passing a rigorous manual cutting test, ensuring a butter-smooth feel, perfect tension, and unmatched sharpness straight out of the box.
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
