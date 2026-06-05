import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] w-full pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-16 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 font-black mb-4 tracking-wide">
          Refund &amp; Return Policy
        </h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-amber-500 to-amber-300 mb-6 rounded-full" />
        <p className="text-slate-600 text-sm tracking-widest uppercase mb-12 font-medium">Last Updated: May 16, 2026</p>

        <div className="space-y-10 text-slate-900 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">1. The Bite Instruments Guarantee</h2>
            <p>
              We stand behind the superior craftsmanship of every grooming tool forged in our Sialkot manufacturing facilities. If you are not completely satisfied with your purchase, we offer a comprehensive 30-day return window for unused products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">2. Conditions for Return</h2>
            <p className="mb-2">To be eligible for a return, the following conditions must be met:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The item must be unused and in the exact same condition that you received it.</li>
              <li>The item must be in the original packaging, including all protective casings, oils, and inserts.</li>
              <li>You must have the original receipt or proof of purchase.</li>
              <li>The return request must be initiated within 30 days of delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">3. Defects and Craftsmanship Issues</h2>
            <p>
              Because our instruments are handcrafted from premium Japanese steel, structural defects are extremely rare. However, if you receive a shear with a manufacturing defect (e.g., misaligned tension dial, blade imperfections out of the box), please contact us immediately. We will cover all return shipping costs for defective items and provide an expedited replacement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">4. Wholesale and B2B Returns</h2>
            <p>
              For our bulk distributor and wholesale partners, return terms may differ. Custom-engraved or specially commissioned batches are generally non-refundable unless there is a verifiable manufacturing defect across the batch. Please refer to your specific distributor agreement for details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">5. Refund Process</h2>
            <p>
              Once your return is received and inspected at our facility, we will send you an email to notify you of the approval or rejection of your refund. If approved, your refund will be processed securely, and a credit will automatically be applied to your credit card or original method of payment within 5-7 business days. Our commitment to data security ensures your financial information remains encrypted throughout this process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">6. Contact for Returns</h2>
            <p>
              To initiate a return, please contact our support team at <span className="text-amber-600 font-semibold">biteinstruments@gmail.com</span> with your order number and a brief explanation of the reason for return.
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