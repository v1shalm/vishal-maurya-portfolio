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
    slug: "dsp",
    title: "DSP",
    kind: "Mutual fund landing",
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
        <section className="pt-16 md:pt-24">
          <Container>
            <div className="max-w-[720px]">
              <h1 className="text-[13px] text-muted">
                Pixels
              </h1>

              <p className="mt-8 max-w-[54ch] text-pretty text-[17px] leading-[1.7] text-ink md:text-[18px]">
                Interfaces without briefs. A sketchbook: some become
                products, most stay themselves.
              </p>
            </div>

            <section className="mt-20 md:mt-24">
              <div className="flex items-baseline justify-between border-b border-line pb-5">
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
