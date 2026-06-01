import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050814] w-full pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-8 tracking-wide">
          Refund & Return Policy
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase mb-12">Last Updated: May 16, 2026</p>

        <div className="space-y-10 text-gray-300 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">1. The Bite Instruments Guarantee</h2>
            <p>
              We stand behind the superior craftsmanship of every grooming tool forged in our Sialkot manufacturing facilities. If you are not completely satisfied with your purchase, we offer a comprehensive 30-day return window for unused products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">2. Conditions for Return</h2>
            <p className="mb-2">To be eligible for a return, the following conditions must be met:</p>
            <ul className="list-disc pl-6 space-y-2 opacity-90">
              <li>The item must be unused and in the exact same condition that you received it.</li>
              <li>The item must be in the original packaging, including all protective casings, oils, and inserts.</li>
              <li>You must have the original receipt or proof of purchase.</li>
              <li>The return request must be initiated within 30 days of delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">3. Defects and Craftsmanship Issues</h2>
            <p>
              Because our instruments are handcrafted from premium Japanese steel, structural defects are extremely rare. However, if you receive a shear with a manufacturing defect (e.g., misaligned tension dial, blade imperfections out of the box), please contact us immediately. We will cover all return shipping costs for defective items and provide an expedited replacement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">4. Wholesale and B2B Returns</h2>
            <p>
              For our bulk distributor and wholesale partners, return terms may differ. Custom-engraved or specially commissioned batches are generally non-refundable unless there is a verifiable manufacturing defect across the batch. Please refer to your specific distributor agreement for details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">5. Refund Process</h2>
            <p>
              Once your return is received and inspected at our facility, we will send you an email to notify you of the approval or rejection of your refund. If approved, your refund will be processed securely, and a credit will automatically be applied to your credit card or original method of payment within 5-7 business days. Our commitment to data security ensures your financial information remains encrypted throughout this process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">6. Contact for Returns</h2>
            <p>
              To initiate a return, please contact our support team at <strong>biteinstruments@gmail.com</strong> with your order number and a brief explanation of the reason for return.
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
