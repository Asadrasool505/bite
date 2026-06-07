import type { Metadata } from "next";
import "./globals.css";

// Mock fonts to prevent compile errors during offline builds without network access
const geistSans = {
  variable: "font-sans",
};

const geistMono = {
  variable: "font-mono",
};

export const metadata: Metadata = {
  title: "Bite Instruments | Professional Wholesale Pet Grooming Shears",
  description: "Official factory direct supplier of premium B2B pet grooming shears, clippers, and accessories. Exporting world-class Sialkot-crafted grooming tools globally.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  }
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CartProvider } from "@/context/CartContext";
import { AppProvider } from "@/context/AppContext";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedLang = cookieStore.get("bite_instruments_lang")?.value || "en";
  const initialLanguage = ["en", "zh", "ja", "ar", "ru", "de", "fr", "es"].includes(savedLang)
    ? (savedLang as any)
    : "en";

  return (
    <html suppressHydrationWarning={true}
      lang={initialLanguage}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden dark`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full flex flex-col bg-[#F4F5F7] text-foreground overflow-x-hidden transition-colors duration-300">
        <AppProvider initialLanguage={initialLanguage}>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <FloatingWhatsApp />
          </CartProvider>
        </AppProvider>
      </body>
    </html>
  );
}
