import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { type PixelsItem } from "@/components/PixelsTile";
import { ClientMarquee } from "@/components/ClientMarquee";
import { EmailLink } from "@/components/EmailLink";
import { HeroY2K } from "@/components/HeroY2K";
import { HomeWorkSection } from "@/components/HomeWorkSection";
import { HomePixelsSection } from "@/components/HomePixelsSection";
import { works } from "@/lib/works";
import { links } from "@/lib/links";

const clients: {
  name: string;
  logo?: string;
  heightClass?: string;
}[] = [
  {
    name: "Nexus 247",
    logo: "/logos/nexus-247.png",
    heightClass: "h-14 md:h-20",
  },
  {
    name: "OutcomesAI",
    logo: "/logos/outcomes-ai.png",
    heightClass: "h-14 md:h-20",
  },
  { name: "Zilo", logo: "/logos/zilo.png" },
  { name: "DSP Mutual Fund", logo: "/logos/dsp.png" },
  {
    name: "Alegra",
    logo: "/logos/alegra.png",
    heightClass: "h-10 md:h-14",
  },
  {
    name: "Briskpe",
    logo: "/logos/briskpe.png",
    heightClass: "h-10 md:h-14",
  },
];

const playground: PixelsItem[] = [
  {
    slug: "dsp",
    title: "DSP",
    kind: "GIFT City landing page",
    year: "2025",
    images: [
      {
        src: "/Pixels/dsp%20-%20Homepage.png",
        alt: "DSP Mutual Fund homepage: Invest in India's first retail offshore mutual fund from GIFT City",
        width: 4320,
        height: 2400,
      },
      {
        src: "/Pixels/dsp%20-%20into%20india.png",
        alt: "DSP: Invest Into India, tap into India's booming economy",
        width: 4320,
        height: 2400,
      },
      {
        src: "/Pixels/dsp-cards.png",
        alt: "DSP: Invest into India vs. Invest Globally, the two value props side-by-side",
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
        alt: "Lumen: ingestion hub, source input and knowledge base",
        width: 3024,
        height: 1964,
      },
      {
        src: "/Pixels/lumen%20verified%20insights.png",
        alt: "Lumen: verified insights, synthesized findings with confidence scores",
        width: 3024,
        height: 1964,
      },
    ],
  },
];

export default function Home() {
  return (
    <>
      <main id="main-content" className="flex flex-1 flex-col">
        <HeroY2K />

        {/* Client strip: infinite marquee (stays within the global container) */}
        <section className="pt-20 md:pt-28">
          <Container>
            <ClientMarquee clients={clients} />
          </Container>
        </section>

        {/* Work — locked entries are filtered out of the public listing. */}
        <HomeWorkSection works={works.filter((w) => !w.locked)} />

        {/* Pixels */}
        <HomePixelsSection items={playground} />

        {/* Contact */}
        <Reveal as="section" className="pt-36 md:pt-48">
          <Container>
            <div className="max-w-[800px]">
              <h2 className="text-balance text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
                Say hello.
              </h2>

              <div className="mt-8 md:mt-10">
                <EmailLink
                  email="vishalm.designs@gmail.com"
                  className="link-accent inline-flex items-baseline gap-2 text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.2] tracking-[-0.01em]"
                />
              </div>

              <p className="mt-10 max-w-[58ch] text-pretty text-[16px] leading-[1.7] text-ink-soft md:mt-12 md:text-[17px]">
                Or grab the{" "}
                <a
                  href={links.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="external"
                  data-cursor-label="Resume"
                  className="text-ink underline decoration-line decoration-1 underline-offset-4 transition-[color,text-decoration-color] hover:decoration-ink"
                >
                  resume
                </a>
                , find me on{" "}
                <a
                  href="https://www.linkedin.com/in/v1shalm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="external"
                  data-cursor-label="LinkedIn"
                  className="text-ink underline decoration-line decoration-1 underline-offset-4 transition-[color,text-decoration-color] hover:decoration-ink"
                >
                  LinkedIn
                </a>{" "}
                or{" "}
                <a
                  href="https://dribbble.com/V1shal"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="external"
                  data-cursor-label="Dribbble"
                  className="text-ink underline decoration-line decoration-1 underline-offset-4 transition-[color,text-decoration-color] hover:decoration-ink"
                >
                  Dribbble
                </a>
                .
              </p>
            </div>
          </Container>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
