import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PixelsTile, type PixelsItem } from "@/components/PixelsTile";

export const metadata: Metadata = {
  title: "Pixels · Vishal Maurya",
  description: "Personal UI screens, explorations, and side quests.",
};

const items: PixelsItem[] = [
  {
    slug: "dsp",
    title: "DSP",
    kind: "GIFT City landing page",
    year: "2025",
    images: [
      {
        src: "/Pixels/dsp%20-%20Homepage.png",
        alt: "DSP homepage: first retail offshore mutual fund from GIFT City",
        width: 4320,
        height: 2400,
      },
      {
        src: "/Pixels/dsp%20-%20into%20india.png",
        alt: "DSP: Invest Into India",
        width: 4320,
        height: 2400,
      },
      {
        src: "/Pixels/dsp-%20Outside%20India.png",
        alt: "DSP: Invest Globally",
        width: 4320,
        height: 2400,
      },
      {
        src: "/Pixels/dsp-cards.png",
        alt: "DSP: Invest into India vs. Invest Globally",
        width: 3840,
        height: 2160,
      },
    ],
  },
  {
    slug: "vero-moda",
    title: "Vero Moda",
    kind: "Brand POC · Fashion AI",
    year: "2025",
    // Eight micro-interactions explored during a 5–7 day proof-of-concept
    // for Vero Moda. Mix of mobile UI (vertical) and full-canvas mockups
    // (16:9). Lead slide drives the tile aspect; videos lazy-play.
    images: [
      {
        src: "/Pixels/vero%20moda/Outfit-Breakdown(1).mp4",
        alt: "Outfit breakdown: tap a look to see the items that built it",
        width: 1920,
        height: 1072,
      },
      {
        src: "/Pixels/vero%20moda/Virtual-Tryon.mp4",
        alt: "Virtual try-on: see clothes on yourself before you order",
        width: 1528,
        height: 1080,
      },
      {
        src: "/Pixels/vero%20moda/Fabric%20Intelligence.mp4",
        alt: "Fabric intelligence: AI surfaces the material composition story",
        width: 1920,
        height: 1080,
      },
      {
        src: "/Pixels/vero%20moda/Image-On-Hover.mp4",
        alt: "Image-on-hover: a richer second-shot reveal on product cards",
        width: 1920,
        height: 1080,
      },
      {
        src: "/Pixels/vero%20moda/Influencer-Closet.mp4",
        alt: "Influencer closet: shop the outfits from creators you follow",
        width: 780,
        height: 1080,
      },
      {
        src: "/Pixels/vero%20moda/Ai%20Assitant.mp4",
        alt: "AI assistant: conversational discovery built into the nav",
        width: 780,
        height: 1080,
      },
      {
        src: "/Pixels/vero%20moda/Shuffle.mp4",
        alt: "Shuffle: tinder-style outfit discovery",
        width: 764,
        height: 1080,
      },
      {
        src: "/Pixels/vero%20moda/Hamburger-Menu-Gifs.mp4",
        alt: "Hamburger menu: editorial reveal pattern with motion",
        width: 780,
        height: 1080,
      },
    ],
  },
  {
    slug: "lumen",
    title: "Lumen",
    kind: "Research synthesis",
    year: "2025",
    images: [
      {
        src: "/Pixels/lumen%20command%20center.png",
        alt: "Lumen: command center",
        width: 3024,
        height: 1964,
      },
      {
        src: "/Pixels/lumen%20ingestion%20hub.png",
        alt: "Lumen: ingestion hub",
        width: 3024,
        height: 1964,
      },
      {
        src: "/Pixels/lumen%20verified%20insights.png",
        alt: "Lumen: verified insights",
        width: 3024,
        height: 1964,
      },
      {
        src: "/Pixels/lumen%20verified%20insights%20modal.png",
        alt: "Lumen: insight dossier modal",
        width: 3024,
        height: 1964,
      },
    ],
  },
  {
    slug: "providence",
    title: "Providence",
    kind: "Concept UI",
    year: "2025",
    images: [
      {
        src: "/works/providence.png",
        alt: "Providence concept UI",
        width: 2880,
        height: 1400,
      },
    ],
  },
];

export default function PixelsPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section>
          <Container>
            <div className="max-w-[720px]">
              <h1 className="hero-y2k flex text-[clamp(2.75rem,7vw,5.25rem)] font-bold leading-[0.95] tracking-tight">
                <span className="y-hl y-hl--magenta" data-text="Pixels">
                  Pixels
                </span>
              </h1>

              <p className="mt-10 max-w-[48ch] text-pretty text-[18px] font-bold leading-[1.5] text-ink md:text-[20px]">
                Interfaces without briefs. A{" "}
                <span className="hero-y2k">
                  <span className="y-underline y-underline--yellow">
                    sketchbook
                  </span>
                </span>
                : some become products, most stay themselves.
              </p>
            </div>

            <section className="mt-20 md:mt-24">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-muted">
                  All · {items.length}
                </span>
                <span className="text-[13px] text-muted">
                  2025
                </span>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-16 md:mt-20 md:grid-cols-2 md:gap-y-28">
                {items.map((item, i) => (
                  <Reveal key={item.slug} delay={i * 80}>
                    <PixelsTile item={item} />
                  </Reveal>
                ))}
              </div>
            </section>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
