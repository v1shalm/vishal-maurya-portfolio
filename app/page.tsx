import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { WorkCard } from "@/components/WorkCard";
import { Reveal } from "@/components/Reveal";
import { PixelsTile, type PixelsItem } from "@/components/PixelsTile";
import { ClientMarquee } from "@/components/ClientMarquee";
import { works } from "@/lib/works";

const clients: {
  name: string;
  logo?: string;
  heightClass?: string;
}[] = [
  {
    name: "Nexus 247",
    logo: "/logos/nexus-247.png",
    heightClass: "h-12 md:h-16",
  },
  {
    name: "OutcomesAI",
    logo: "/logos/outcomes-ai.png",
    heightClass: "h-12 md:h-16",
  },
  { name: "Zilo", logo: "/logos/zilo.png" },
  { name: "DSP Mutual Fund", logo: "/logos/dsp.png" },
  {
    name: "Alegra",
    logo: "/logos/alegra.png",
    heightClass: "h-8 md:h-11",
  },
  {
    name: "Briskpe",
    logo: "/logos/briskpe.png",
    heightClass: "h-8 md:h-11",
  },
  {
    name: "Inato",
    logo: "/logos/inato.png",
    heightClass: "h-8 md:h-11",
  },
];

const playground: PixelsItem[] = [
  {
    slug: "lumen",
    title: "Lumen",
    kind: "Research synthesis",
    year: "2025",
    images: [
      {
        src: "/Pixels/lumen%20command%20center.png",
        alt: "Lumen — command center, workspace chat with synthesis agent",
        width: 3024,
        height: 1964,
      },
      {
        src: "/Pixels/lumen%20ingestion%20hub.png",
        alt: "Lumen — ingestion hub, source input and knowledge base",
        width: 3024,
        height: 1964,
      },
      {
        src: "/Pixels/lumen%20verified%20insights.png",
        alt: "Lumen — verified insights, synthesized findings with confidence scores",
        width: 3024,
        height: 1964,
      },
      {
        src: "/Pixels/lumen%20verified%20insights%20modal.png",
        alt: "Lumen — insight dossier modal, evidence registry and metadata",
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
        alt: "DSP Mutual Fund — homepage, Invest in India's first retail offshore mutual fund from GIFT City",
        width: 4320,
        height: 2400,
      },
      {
        src: "/Pixels/dsp%20-%20into%20india.png",
        alt: "DSP — Invest Into India, tap into India's booming economy",
        width: 4320,
        height: 2400,
      },
      {
        src: "/Pixels/dsp-%20Outside%20India.png",
        alt: "DSP — Invest Globally, access global markets via the GIFT City platform",
        width: 4320,
        height: 2400,
      },
      {
        src: "/Pixels/dsp-cards.png",
        alt: "DSP — Invest into India vs. Invest Globally, the two value props side-by-side",
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
        alt: "Providence — concept UI",
        width: 2880,
        height: 1400,
      },
    ],
  },
];

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        {/* Intro */}
        <section className="pt-24 md:pt-40">
          <Container>
            <div className="max-w-[58ch]">
              <p className="text-[17px] leading-[1.75] text-ink md:text-[18px]">
                I&rsquo;m a product designer based in Mumbai. I design
                consumer products. Lately: quick-commerce, healthtech, and
                interfaces that feel alive.
              </p>
              <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft">
                Currently at Pineapple Design Studio. Open to product roles.
              </p>
            </div>

            {/* Client strip — infinite marquee (stays within the global container) */}
            <div className="mt-24 flex flex-col gap-5 md:mt-32">
              <span className="whitespace-nowrap text-[10.5px] uppercase tracking-[0.18em] text-muted">
                Worked with
              </span>
              <ClientMarquee clients={clients} />
            </div>
          </Container>
        </section>

        {/* Work */}
        <Reveal as="section" className="pt-36 md:pt-48">
          {/* Work section wrapper — single reveal for the heading + card grid */}
          <div id="work">
            <Container>
              <div className="flex items-baseline justify-between border-b border-line pb-4">
                <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted">
                  Selected Work
                </h2>
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
                  2023 — 2025
                </span>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-16 md:mt-20 md:grid-cols-2 md:gap-y-28">
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
            <div className="flex items-baseline justify-between border-b border-line pb-4">
              <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted">
                Pixels
              </h2>
              <Link
                href="/pixels"
                className="text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
              >
                All →
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-16 md:mt-20 md:grid-cols-2 md:gap-y-28">
              {playground.map((item, i) => (
                <Reveal key={item.slug} delay={i * 80}>
                  <PixelsTile item={item} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Reveal>

        {/* Contact */}
        <Reveal as="section" className="pt-36 md:pt-48">
          <Container>
            <div className="max-w-[58ch] text-[15px] leading-[1.8]">
              <p className="text-ink-soft">
                Say hello —{" "}
                <a
                  href="mailto:vishalm.designs@gmail.com"
                  className="link-accent"
                  data-cursor="email"
                >
                  vishalm.designs@gmail.com
                </a>
              </p>
              <p className="mt-2 text-muted">
                Or grab the{" "}
                <a
                  href="https://drive.google.com/file/d/1H9CUwS7UnFzxy1oD_wa5A7KJ4P_i45ch/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="external"
                  className="transition-colors hover:text-ink"
                >
                  resume
                </a>
                , find me on{" "}
                <a
                  href="https://www.linkedin.com/in/v1shalm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="external"
                  className="transition-colors hover:text-ink"
                >
                  LinkedIn
                </a>{" "}
                or{" "}
                <a
                  href="https://dribbble.com/V1shal"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="external"
                  className="transition-colors hover:text-ink"
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
