import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050814] w-full pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-8 tracking-wide">
          Privacy Policy
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase mb-12">Last Updated: May 16, 2026</p>

        <div className="space-y-10 text-gray-300 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">1. Introduction</h2>
            <p>
              Welcome to Bite Instruments ("we," "our," or "us"). We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, purchase our handcrafted grooming tools from Sialkot, or engage with our B2B services. This policy complies with international data protection regulations, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">2. Data We Collect</h2>
            <p className="mb-2">We may collect and process the following types of personal data:</p>
            <ul className="list-disc pl-6 space-y-2 opacity-90">
              <li><strong>Identity Data:</strong> First name, last name, username, or similar identifier.</li>
              <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
              <li><strong>Financial Data:</strong> Bank account and payment card details (processed securely via third-party gateways).</li>
              <li><strong>Transaction Data:</strong> Details about payments and other details of products and services you have purchased from us.</li>
              <li><strong>Technical Data:</strong> Internet protocol (IP) address, your login data, browser type and version, time zone setting, and operating system.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">3. How We Use Your Data</h2>
            <p className="mb-2">We use your personal data only when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 opacity-90">
              <li>To process and deliver your order, including managing payments and collecting money owed to us.</li>
              <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
              <li>To administer and protect our business and this website (including troubleshooting, data analysis, testing, system maintenance, and support).</li>
              <li>To use data analytics to improve our website, products/services, marketing, customer relationships, and experiences.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions, and they are subject to a duty of confidentiality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">5. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements. We may retain your personal data for a longer period in the event of a complaint or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">6. Your Legal Rights (GDPR & CCPA)</h2>
            <p className="mb-2">Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
            <ul className="list-disc pl-6 space-y-2 opacity-90">
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data (the "right to be forgotten").</li>
              <li>Object to processing of your personal data.</li>
              <li>Request restriction of processing your personal data.</li>
              <li>Request transfer of your personal data.</li>
              <li>Right to withdraw consent.</li>
            </ul>
            <p className="mt-4">
              If you wish to exercise any of the rights set out above, please contact us at privacy@biteinstruments.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">7. Contact Us</h2>
            <p>
              For any questions regarding this Privacy Policy or our privacy practices, please contact our Data Protection Officer at:
            </p>
            <div className="mt-4 p-6 bg-[#0A1128] rounded-xl border border-white/5">
              <p className="text-white font-bold mb-1">Bite Instruments</p>
              <p className="opacity-80">Sialkot, Pakistan</p>
              <p className="opacity-80">Email: privacy@biteinstruments.com</p>
            </div>
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
