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
import FactoryWelcomePopup from "@/components/FactoryWelcomePopup";
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
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1455871425875970');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1455871425875970&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="min-h-full flex flex-col bg-[#F4F5F7] text-foreground overflow-x-hidden transition-colors duration-300">
        <AppProvider initialLanguage={initialLanguage}>
          <CartProvider>
            <FactoryWelcomePopup />
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
