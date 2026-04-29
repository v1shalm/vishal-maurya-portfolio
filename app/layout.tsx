import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/components/CommandPalette";
import { CommandPaletteTrigger } from "@/components/CommandPaletteTrigger";
import { SmartCursor } from "@/components/SmartCursor";
import { LenisProvider } from "@/components/LenisProvider";
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
  "Product designer in Mumbai. I design consumer products, lately in quick-commerce, healthtech, and interfaces that feel alive.";
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
      <body className="min-h-full flex flex-col bg-bg text-ink font-sans">
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
        {children}
      </body>
    </html>
  );
}
