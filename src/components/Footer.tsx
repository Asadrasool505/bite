"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";

const PRODUCTS = [
  { label: "Pet Shears & Thinners", key: "pet_shears_thinners", href: "/blenders-thinning-scissors" },
  { label: "Straight Scissors", key: "straight-scissors", href: "/pet-straight-scissors" },
  { label: "Curved Scissors", key: "curved_scissors", href: "/curved-scissors" },
  { label: "Grooming Combs", key: "grooming_combs", href: "/pet-combs" },
];

const INFORMATION = [
  { label: "About Bite Instruments", key: "about_bite_instruments", href: "/about" },
  { label: "Sialkot Manufacturing", key: "wholesale_manufacturing", href: "/about" },
  { label: "Quality Guarantee", key: "quality_guarantee", href: "/quality" },
  { label: "Wholesale Inquiry", key: "wholesale_inquiry", href: "/contact" },
];

const CARE = [
  { label: "Contact Us", key: "contact", href: "/contact" },
  { label: "Distributor Application", key: "distributor_application", href: "/contact?intent=distributor" },
  { label: "Warranty & Returns", key: "warranty_returns", href: "/warranty" },
  { label: "Shipping Policy", key: "shipping_policy", href: "/shipping-policy" },
];

const UTILITY = [
  { label: "Privacy Policy", key: "privacy_policy", href: "/privacy-policy" },
  { label: "Terms of Service", key: "terms_of_service", href: "/terms-of-service" },
  { label: "Refund Policy", key: "refund_policy", href: "/refund-policy" },
  { label: "Accessibility", key: "accessibility", href: "/accessibility" },
];

/* ── Column heading ── */
function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-black tracking-[0.4em] uppercase mb-6 text-slate-900">
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
        className="text-slate-600 text-sm font-light tracking-wide transition-colors duration-200 hover:text-amber-500"
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
      className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-amber-500/50 hover:text-amber-500 transition-all duration-300 hover:-translate-y-1 bg-white"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const { setCatalogueOpen, t } = useApp();

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200">
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
            <ColHeading>{t("products")}</ColHeading>
            <ul className="space-y-3">
              {PRODUCTS.map((l) => <FooterLink key={l.label} href={l.href}>{t(l.key)}</FooterLink>)}
            </ul>
          </div>

          {/* COL 2 — INFORMATION */}
          <div>
            <ColHeading>{t("information")}</ColHeading>
            <ul className="space-y-3">
              {INFORMATION.map((l) => <FooterLink key={l.label} href={l.href}>{t(l.key)}</FooterLink>)}
            </ul>
          </div>

          {/* COL 3 — CUSTOMER CARE */}
          <div>
            <ColHeading>{t("customer_care")}</ColHeading>
            <ul className="space-y-3">
              {CARE.map((l) => <FooterLink key={l.label} href={l.href}>{t(l.key)}</FooterLink>)}
            </ul>
          </div>

          {/* COL 4 — CONNECT */}
          <div>
            <ColHeading>{t("connect_with_us")}</ColHeading>
            <p className="text-slate-600 text-xs mb-5 font-light tracking-wide leading-relaxed">
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

              {/* Pinterest */}
              <SocialBtn href="https://pinterest.com/biteinstruments" label="Pinterest">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </SocialBtn>

            </div>

            {/* Contact snippet */}
            <div className="mt-8 space-y-2">
              <p className="flex items-center gap-2 justify-center md:justify-start text-slate-600 text-xs">
                <span className="text-yellow-600">📍</span>
                Small Industrial Estate, Sialkot, Pakistan
              </p>
              <p className="flex items-center gap-2 justify-center md:justify-start text-slate-600 text-xs">
                <span className="text-yellow-600">✉️</span>
                <a href="mailto:biteinstruments@gmail.com" className="hover:text-amber-500 transition-colors">
                  biteinstruments@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2 justify-center md:justify-start text-slate-600 text-xs">
                <span className="text-yellow-600">🕐</span>
                Business Hours: 9:00 AM – 6:00 PM PKT (UTC+5)
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div
        className="w-full h-[1px] mx-auto"
        style={{ background: "linear-gradient(to right, transparent, rgba(15,23,42,0.1), transparent)" }}
      />

      <div className="py-10 flex flex-col items-center gap-4">
        {/* Wordmark */}
        <span className="text-2xl md:text-3xl font-extrabold tracking-[0.25em] uppercase text-slate-900 text-yellow-600">
          Bite Instruments
        </span>
        <span className="text-[10px] tracking-[0.4em] uppercase text-slate-500 font-light">
          Est. Sialkot · Premium Pet Grooming
        </span>

        {/* Responsive Parent Container for Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md px-6 sm:px-0">
          {/* Track Production Premium Button */}
          <Link
            href="/track-order"
            className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest text-[#0A1128] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 hover:animate-none cursor-pointer border border-yellow-300/30 mb-3 sm:mb-0"
            style={{ animation: "pulse 2s infinite" }}
          >
            {t("track_factory_production")}
          </Link>

          {/* Request B2B Catalogue Premium Button */}
          <button
            onClick={() => setCatalogueOpen(true)}
            className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-yellow-500/50 hover:text-amber-500 hover:shadow-[0_0_25px_rgba(250,204,21,0.2)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            {t("request_b2b_catalogue")}
          </button>
        </div>
      </div>

      {/* ── Divider ── */}
      <div
        className="w-full h-[1px]"
        style={{ background: "linear-gradient(to right, transparent, rgba(15,23,42,0.06), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Utility links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
          {UTILITY.map((u) => (
            <Link
              key={u.label}
              href={u.href}
              className="text-slate-500 text-[10px] tracking-wider uppercase hover:text-slate-800 transition-colors duration-200"
            >
              {u.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-slate-500 text-[10px] tracking-wide text-center md:text-right">
          © 2026 Bite Instruments. All rights reserved.{" "}
          <span className="text-slate-600">Handcrafted in Sialkot, Pakistan.</span>
        </p>
      </div>

    </footer>
  );
}
