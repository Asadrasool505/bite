import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] w-full pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-16 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 font-black mb-4 tracking-wide">
          Terms of Service
        </h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-amber-500 to-amber-300 mb-6 rounded-full" />
        <p className="text-slate-600 text-sm tracking-widest uppercase mb-12 font-medium">Last Updated: May 16, 2026</p>

        <div className="space-y-10 text-slate-900 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using the Bite Instruments website and our B2B e-commerce platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. Bite Instruments specializes in providing premium handcrafted grooming tools manufactured in Sialkot.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">2. Products and Pricing</h2>
            <p className="mb-2">
              All products listed on our website are subject to availability. We reserve the right to limit the quantities of any products that we offer.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Prices for our products are subject to change without notice.</li>
              <li>We make every effort to display as accurately as possible the colors and images of our products.</li>
              <li>We reserve the right to modify or discontinue any product at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">3. B2B Wholesale and Distribution</h2>
            <p>
              Purchases made for wholesale or distribution are subject to separate master service agreements. Minimum order quantities (MOQs) may apply to wholesale orders. Bite Instruments retains all intellectual property rights to the designs and branding of its grooming tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">4. Data Security &amp; Privacy</h2>
            <p>
              At Bite Instruments, we are fiercely committed to your data security. We employ industry-standard encryption protocols for all transactions and communications. Your use of the website is also governed by our Privacy Policy, which details how we collect, safeguard, and use your information in compliance with international standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">5. Intellectual Property</h2>
            <p>
              All content included on this site, such as text, graphics, logos, images, audio clips, digital downloads, and software, is the property of Bite Instruments or its content suppliers and protected by international copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">6. Limitation of Liability</h2>
            <p>
              Bite Instruments shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or website. Our grooming tools are professional-grade instruments and must be handled with appropriate care and training.
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