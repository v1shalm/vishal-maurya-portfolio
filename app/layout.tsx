import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/components/CommandPalette";
import { CommandPaletteTrigger } from "@/components/CommandPaletteTrigger";
import { SmartCursor } from "@/components/SmartCursor";
import { LenisProvider } from "@/components/LenisProvider";
import { Footer } from "@/components/Footer";
import { siteUrl } from "@/lib/site";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteTitle = "Vishal Maurya · Product Designer";
const siteDescription =
  "AI-forward product designer in Mumbai. 2.5 years across quick commerce, healthtech, and fintech.";
const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: siteTitle,
};

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s · Vishal Maurya",
  },
  description: siteDescription,
  applicationName: "Vishal Maurya",
  authors: [{ name: "Vishal Maurya", url: siteUrl }],
  creator: "Vishal Maurya",
  publisher: "Vishal Maurya",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Vishal Maurya",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@v1shal0",
    images: [ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Portfolio",
};

export const viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vishal Maurya",
  jobTitle: "Product Designer",
  url: siteUrl,
  email: "mailto:vishalm.designs@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "Organization",
    name: "Pineapple Design Studio",
  },
  sameAs: [
    "https://www.linkedin.com/in/v1shalm/",
    "https://dribbble.com/V1shal",
  ],
  knowsAbout: [
    "Product design",
    "UI design",
    "Quick-commerce",
    "Healthtech",
    "Consumer products",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full font-sans text-ink"
        // Body background is ink. The page (`children`) is a white
        // layer stacked above the fixed Footer; as you scroll past
        // the page's last section, its rounded bottom edge lifts off
        // and reveals the footer underneath.
        style={{ background: "#0a0a0a" }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-[14px] focus:font-semibold focus:text-bg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <LenisProvider />
        <CommandPalette />
        <CommandPaletteTrigger />
        <SmartCursor />

        {/* Fixed footer layer. Sits at the bottom of the viewport,
           behind the page. The body's black bg lets the footer
           content read against it. Height adapts via CSS variable so
           the page wrapper's bottom margin can match it exactly. */}
        <div
          className="fixed inset-x-0 bottom-0 z-0"
          style={{
            // 560px / 68vh ceiling on mobile so the footer doesn't
            // crowd short viewports; 640px / 58vh on tablet+ where
            // horizontal space lets the email + signature breathe.
            height: "var(--reveal-h)",
          }}
        >
          <Footer />
        </div>

        {/* Page content layer. White surface with rounded bottom
           corners. The bottom margin matches the reveal height so
           the scroll runway and reveal area stay in sync. Mobile
           uses a smaller radius so it doesn't crop tile content
           sitting near the page's bottom edge. */}
        <div
          className="relative z-10 min-h-screen rounded-b-[14px] bg-bg pb-10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.28)] md:rounded-b-[32px] md:pb-0"
          style={{ marginBottom: "var(--reveal-h)" }}
        >
          {children}
        </div>

        <style>{`
          :root { --reveal-h: min(440px, 56vh); }
          @media (min-width: 768px) {
            :root { --reveal-h: min(640px, 58vh); }
          }
        `}</style>

      </body>
    </html>
  );
}
