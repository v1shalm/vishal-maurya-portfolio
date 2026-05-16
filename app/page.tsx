import { Container } from "@/components/Container";
import { type PixelsItem } from "@/components/PixelsTile";
import { ClientMarquee } from "@/components/ClientMarquee";
import { HeroY2K } from "@/components/HeroY2K";
import { HomeWorkSection } from "@/components/HomeWorkSection";
import { HomePixelsSection } from "@/components/HomePixelsSection";
import { works } from "@/lib/works";
import { isUnlockedHost } from "@/lib/host";

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

export default async function Home() {
  const unlockAll = await isUnlockedHost();
  const visibleWorks = unlockAll ? works : works.filter((w) => !w.locked);

  return (
    <>
      <main id="main-content" className="flex flex-1 flex-col">
        <HeroY2K unlocked={unlockAll} />

        {/* Client strip: infinite marquee (stays within the global container) */}
        <section className="pt-20 md:pt-28">
          <Container>
            <ClientMarquee clients={clients} />
          </Container>
        </section>

        {/* Work — locked entries hidden on public domain, visible on
           the portfolio.* subdomain. */}
        <HomeWorkSection works={visibleWorks} />

        {/* Pixels */}
        <HomePixelsSection items={playground} />

        {/* Contact section removed — the reveal footer is the only
           contact surface, so this used to repeat the email + socials. */}
      </main>
    </>
  );
}
