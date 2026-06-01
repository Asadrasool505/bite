import Link from "next/link";

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[#050814] w-full pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-8 tracking-wide">
          Accessibility Statement
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase mb-12">Last Updated: May 24, 2026</p>

        <div className="space-y-10 text-gray-300 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">1. Commitment to Accessibility</h2>
            <p>
              At BITE Instruments, we are committed to ensuring digital accessibility for all users, including individuals with disabilities. We continuously audit and optimize our B2B e-commerce platform and digital experiences to offer a fluid, seamless interface for global distributors, wholesalers, and customers, regardless of physical or cognitive abilities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">2. Standards & Guidelines</h2>
            <p>
              To help make our website a highly usable, accessible space, we aim to conform to the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** standards. These international benchmarks define ways to make web content more accessible to people with sensory, cognitive, and mobility needs, thereby enhancing the digital experience for everyone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">3. Active Accessibility Measures</h2>
            <p>
              Our development team continuously integrates best practices in modern web accessibility:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 opacity-90">
              <li><strong>Semantic HTML:</strong> Ensuring proper use of HTML5 elements and heading hierarchies to support screen readers and keyboards.</li>
              <li><strong>Interactive Contrast:</strong> Applying rich, high-contrast, harmonious HSL tailored colors and gradients that maintain legible text properties.</li>
              <li><strong>Keyboard Navigation:</strong> Structuring page links, product details, and B2B checkout menus to be fully keyboard-navigable and focus-visible.</li>
              <li><strong>Alt Text:</strong> Providing descriptive alt tags for product catalog photos and interface icon buttons.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-yellow-500 mb-4">4. Feedback & Contact</h2>
            <p>
              We welcome your feedback on the accessibility of BITE Instruments. If you encounter any accessibility barriers, have questions, or require assistance with your B2B account quote request, please do not hesitate to contact our digital support team directly at **biteinstruments@gmail.com**. We will work diligently to assist you and resolve any technical barriers promptly.
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
