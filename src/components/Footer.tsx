import Link from "next/link";

const PRODUCTS = [
  { label: "Pet Shears & Thinners", href: "/blenders-thinning-scissors" },
  { label: "Barber Shears", href: "/pet-straight-scissors" },
  { label: "Curved Scissors", href: "/curved-scissors" },
  { label: "Grooming Combs", href: "/pet-combs" },
];

const INFORMATION = [
  { label: "About Bite Instruments", href: "/about" },
  { label: "Sialkot Manufacturing", href: "/about" },
  { label: "Quality Guarantee", href: "/quality" },
  { label: "Wholesale Inquiry", href: "/contact" },
];

const CARE = [
  { label: "Contact Us", href: "/contact" },
  { label: "Distributor Application", href: "/contact" },
  { label: "Warranty & Returns", href: "/warranty" },
  { label: "Shipping Policy", href: "/shipping" },
];

const UTILITY = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Accessibility", href: "/accessibility" },
];

/* ── Column heading ── */
function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-black tracking-[0.4em] uppercase mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
      {children}
    </h3>
  );
}

/* ── Nav link ── */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-400 text-sm font-light tracking-wide transition-colors duration-200 hover:text-yellow-400"
      >
        {children}
      </Link>
    </li>
  );
}

/* ── Social icon button ── */
function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:border-yellow-500/50 hover:text-yellow-400 transition-all duration-300 hover:-translate-y-1"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        background: "linear-gradient(180deg, #050814 0%, #08102a 60%, #0A1640 100%)",
      }}
    >
      {/* ── Top border glow ── */}
      <div
        className="w-full h-[1px]"
        style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)" }}
      />

      {/* ════════════════════════════════════
          MAIN 4-COLUMN GRID
      ════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 text-center md:text-left">

          {/* COL 1 — PRODUCTS */}
          <div>
            <ColHeading>Products</ColHeading>
            <ul className="space-y-3">
              {PRODUCTS.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
            </ul>
          </div>

          {/* COL 2 — INFORMATION */}
          <div>
            <ColHeading>Information</ColHeading>
            <ul className="space-y-3">
              {INFORMATION.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
            </ul>
          </div>

          {/* COL 3 — CUSTOMER CARE */}
          <div>
            <ColHeading>Customer Care</ColHeading>
            <ul className="space-y-3">
              {CARE.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
            </ul>
          </div>

          {/* COL 4 — CONNECT */}
          <div>
            <ColHeading>Connect With Us</ColHeading>
            <p className="text-gray-500 text-xs mb-5 font-light tracking-wide leading-relaxed">
              Follow us for the latest collections, grooming tips, and wholesale news.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">

              {/* Facebook */}
              <SocialBtn href="https://web.facebook.com/biteinstrument" label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialBtn>

              {/* Instagram */}
              <SocialBtn href="https://www.instagram.com/biteinstruments/" label="Instagram">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </SocialBtn>

              {/* LinkedIn */}
              <SocialBtn href="https://linkedin.com/company/bite-instruments" label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </SocialBtn>

              {/* WhatsApp */}
              <SocialBtn href="https://wa.me/923196085514" label="WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.557 4.116 1.519 5.847L.057 23.882l6.197-1.625A11.932 11.932 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.894 0-3.668-.502-5.2-1.378l-.373-.218-3.879 1.017 1.035-3.78-.24-.387A9.972 9.972 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              </SocialBtn>

            </div>

            {/* Contact snippet */}
            <div className="mt-8 space-y-2">
              <p className="flex items-center gap-2 justify-center md:justify-start text-gray-500 text-xs">
                <span className="text-yellow-500">📍</span>
                Small Industrial Estate, Sialkot, Pakistan
              </p>
              <p className="flex items-center gap-2 justify-center md:justify-start text-gray-500 text-xs">
                <span className="text-yellow-500">✉️</span>
                <a href="mailto:biteinstruments@gmail.com" className="hover:text-yellow-400 transition-colors">
                  biteinstruments@gmail.com
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ════════════════════════════════════
          DIVIDER + CENTERED BRAND IDENTITY
      ════════════════════════════════════ */}
      <div
        className="w-full h-[1px] mx-auto"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }}
      />

      <div className="py-10 flex flex-col items-center gap-2">
        {/* Wordmark */}
        <span className="text-2xl md:text-3xl font-extrabold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
          Bite Instruments
        </span>
        <span className="text-[10px] tracking-[0.4em] uppercase text-gray-600 font-light">
          Est. Sialkot · Premium Pet Grooming
        </span>
      </div>

      {/* ════════════════════════════════════
          BOTTOM UTILITY BAR
      ════════════════════════════════════ */}
      <div
        className="w-full h-[1px]"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Utility links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
          {UTILITY.map((u) => (
            <Link
              key={u.label}
              href={u.href}
              className="text-gray-600 text-[10px] tracking-wider uppercase hover:text-gray-400 transition-colors duration-200"
            >
              {u.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-gray-600 text-[10px] tracking-wide text-center md:text-right">
          © 2026 Bite Instruments. All rights reserved.{" "}
          <span className="text-gray-700">Handcrafted in Sialkot, Pakistan.</span>
        </p>
      </div>

    </footer>
  );
}
