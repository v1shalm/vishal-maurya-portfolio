import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Container } from "@/components/Container";
import { PixelsMasonry } from "@/components/PixelsMasonry";
import { type PixelsItem } from "@/components/PixelsTile";

export const metadata: Metadata = {
  title: "Pixels · Vishal Maurya",
  description: "Personal UI screens, explorations, and side quests.",
};

const items: PixelsItem[] = [
  {
    slug: "draggable-scroll",
    title: "Draggable scroll",
    kind: "Interaction study",
    year: "2026",
    images: [
      {
        src: "/Pixels/Principles4by3.mp4",
        alt: "Draggable scroll: a vertical jog wheel of 3D shapes spinning through design principles",
        width: 1200,
        height: 900,
      },
    ],
  },
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
    ],
  },
  {
    slug: "lumen",
    title: "Lumen",
    kind: "Research synthesis",
    year: "2025",
    images: [
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
    ],
  },
];

export default function PixelsPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex flex-1 flex-col">
        <section>
          <Container>
            <div className="max-w-[720px]">
              <h1 className="text-[clamp(3rem,9vw,5.25rem)] font-bold leading-[1.05] tracking-tight">
                <span className="hero-block hero-block--yellow">Pixels</span>
              </h1>

              <p className="mt-8 max-w-[48ch] text-pretty text-[17px] font-bold leading-[1.5] text-ink md:mt-10 md:text-[20px]">
                Interfaces without briefs. A sketchbook: some become
                products, most stay themselves.
              </p>
            </div>

            <section className="mt-16 md:mt-24">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-muted">
                  All · {items.length}
                </span>
                <span className="text-[13px] text-muted">2025</span>
              </div>

              <div className="mt-8 md:mt-12">
                <PixelsMasonry items={items} />
              </div>
            </section>
          </Container>
        </section>
      </main>
    </>
  );
}
