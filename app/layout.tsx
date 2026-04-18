import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Loader } from "@/components/Loader";
import { CommandPalette } from "@/components/CommandPalette";
import { CommandPaletteTrigger } from "@/components/CommandPaletteTrigger";
import { SmartCursor } from "@/components/SmartCursor";

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

const siteUrl = "https://vishalmaurya.design";
const siteTitle = "Vishal Maurya — Product Designer";
const siteDescription =
  "Product designer in Mumbai. I design consumer products — lately in quick-commerce, healthtech, and interfaces that feel alive.";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s — Vishal Maurya",
  },
  description: siteDescription,
  applicationName: "Vishal Maurya",
  authors: [{ name: "Vishal Maurya", url: siteUrl }],
  creator: "Vishal Maurya",
  publisher: "Vishal Maurya",
  keywords: [
    "Vishal Maurya",
    "product designer",
    "UI designer",
    "UX designer",
    "Mumbai",
    "India",
    "quick-commerce",
    "healthtech",
    "consumer products",
    "portfolio",
    "Pineapple Design Studio",
    "Nexus 247",
    "OutcomesAI",
    "Zilo",
  ],
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
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@vishalmaurya",
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
  worksFor: {
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
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Loader />
        <CommandPalette />
        <CommandPaletteTrigger />
        <SmartCursor />
        {children}
      </body>
    </html>
  );
}
