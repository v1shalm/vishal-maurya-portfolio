import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { WorkCard } from "@/components/WorkCard";
import { Reveal } from "@/components/Reveal";
import { PixelsTile, type PixelsItem } from "@/components/PixelsTile";
import { ClientMarquee } from "@/components/ClientMarquee";
import { EmailLink } from "@/components/EmailLink";
import { HeroY2K } from "@/components/HeroY2K";
import { works } from "@/lib/works";

const clients: {
  name: string;
  logo?: string;
  heightClass?: string;
}[] = [
  {
    name: "Nexus 247",
    logo: "/logos/nexus-247.png",
    heightClass: "h-16 md:h-24",
  },
  {
    name: "OutcomesAI",
    logo: "/logos/outcomes-ai.png",
    heightClass: "h-16 md:h-24",
  },
  { name: "Zilo", logo: "/logos/zilo.png" },
  { name: "DSP Mutual Fund", logo: "/logos/dsp.png" },
  {
    name: "Alegra",
    logo: "/logos/alegra.png",
    heightClass: "h-11 md:h-16",
  },
  {
    name: "Briskpe",
    logo: "/logos/briskpe.png",
    heightClass: "h-11 md:h-16",
  },
  {
    name: "Inato",
    logo: "/logos/inato.png",
    heightClass: "h-11 md:h-16",
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
        src: "/Pixels/dsp-%20Outside%20India.png",
        alt: "DSP: Invest Globally, access global markets via the GIFT City platform",
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
        alt: "Lumen: command center, workspace chat with synthesis agent",
        width: 3024,
        height: 1964,
      },
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
      {
        src: "/Pixels/lumen%20verified%20insights%20modal.png",
        alt: "Lumen: insight dossier modal, evidence registry and metadata",
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

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <HeroY2K />

        {/* Client strip: infinite marquee (stays within the global container) */}
        <section className="pt-20 md:pt-28">
          <Container>
            <div className="flex flex-col gap-7 md:gap-8">
              <span className="whitespace-nowrap text-[13px] text-muted">
                Worked with
              </span>
              <ClientMarquee clients={clients} />
            </div>
          </Container>
        </section>

        {/* Work */}
        <Reveal as="section" className="pt-36 md:pt-48">
          {/* Work section wrapper: single reveal for the heading + card grid */}
          <div id="work">
            <Container>
              <div className="flex items-baseline justify-between">
                <h2 className="hero-y2k text-[28px] font-bold tracking-tight flex gap-[0.25em]">
                  <span className="y-hl y-hl--yellow" data-text="Selected">Selected</span>
                  <span className="y-hl y-hl--magenta" data-text="Work">Work</span>
                </h2>
                <span className="text-[13px] text-muted">
                  2023–2025
                </span>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-16 md:mt-20 md:grid-cols-2 md:gap-y-24">
                {works.map((work, i) => (
                  <Reveal key={work.slug} delay={i * 80}>
                    <WorkCard work={work} />
                  </Reveal>
                ))}
              </div>
            </Container>
          </div>
        </Reveal>

        {/* Pixels */}
        <Reveal as="section" className="pt-36 md:pt-48">
          <Container>
            <div className="flex items-baseline justify-between">
              <h2 className="hero-y2k text-[28px] font-bold tracking-tight">
                <span className="y-hl y-hl--magenta" data-text="Pixels">Pixels</span>
              </h2>
              <Link
                href="/pixels"
                className="text-[13px] text-muted transition-colors hover:text-ink"
              >
                All
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-16 md:mt-20 md:grid-cols-2 md:gap-y-24">
              {playground.map((item, i) => (
                <Reveal key={item.slug} delay={i * 80}>
                  <PixelsTile
                    item={item}
                    priority={item.slug === "dsp"}
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </Reveal>

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
                  href="https://drive.google.com/file/d/1H9CUwS7UnFzxy1oD_wa5A7KJ4P_i45ch/view?usp=drive_link"
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
