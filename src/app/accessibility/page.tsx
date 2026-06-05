import Link from "next/link";

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] w-full pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-16 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 font-black mb-4 tracking-wide">
          Accessibility Statement
        </h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-amber-500 to-amber-300 mb-6 rounded-full" />
        <p className="text-slate-600 text-sm tracking-widest uppercase mb-12 font-medium">Last Updated: May 24, 2026</p>

        <div className="space-y-10 text-slate-900 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">1. Commitment to Accessibility</h2>
            <p>At BITE Instruments, we are committed to ensuring digital accessibility for all users, including individuals with disabilities. We continuously audit and optimize our B2B e-commerce platform and digital experiences to offer a fluid, seamless interface for global distributors, wholesalers, and customers, regardless of physical or cognitive abilities.</p>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">2. Standards &amp; Guidelines</h2>
            <p>To help make our website a highly usable, accessible space, we aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These international benchmarks define ways to make web content more accessible to people with sensory, cognitive, and mobility needs.</p>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">3. Active Accessibility Measures</h2>
            <p>Our development team continuously integrates best practices in modern web accessibility:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong className="font-bold">Semantic HTML:</strong> Ensuring proper use of HTML5 elements and heading hierarchies to support screen readers and keyboards.</li>
              <li><strong className="font-bold">Interactive Contrast:</strong> Applying rich, high-contrast, harmonious colors that maintain legible text properties.</li>
              <li><strong className="font-bold">Keyboard Navigation:</strong> Structuring page links, product details, and B2B checkout menus to be fully keyboard-navigable and focus-visible.</li>
              <li><strong className="font-bold">Alt Text:</strong> Providing descriptive alt tags for product catalog photos and interface icon buttons.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-slate-900 font-bold mb-4">4. Feedback &amp; Contact</h2>
            <p>We welcome your feedback on the accessibility of BITE Instruments. If you encounter any accessibility barriers, please contact our digital support team at <span className="text-amber-600 font-semibold">biteinstruments@gmail.com</span>. We will work diligently to assist you and resolve any technical barriers promptly.</p>
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