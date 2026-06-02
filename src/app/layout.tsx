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
  title: "Bite Instruments",
  description: "Luxury Web Application for Bite Instruments",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  }
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <html
      lang={initialLanguage}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden dark`}
    >
      <body className="min-h-full flex flex-col bg-navy text-foreground overflow-x-hidden transition-colors duration-300">
        <AppProvider initialLanguage={initialLanguage}>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </AppProvider>
      </body>
    </html>
  );
}
