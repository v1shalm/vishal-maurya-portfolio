import Link from "next/link";
import { TransitionLink } from "@/components/TransitionLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { WorkCard } from "@/components/WorkCard";
import { Reveal } from "@/components/Reveal";
import { PixelsTile, type PixelsItem } from "@/components/PixelsTile";
import { ClientMarquee } from "@/components/ClientMarquee";
import { EmailLink } from "@/components/EmailLink";
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
    slug: "dsp",
    title: "DSP",
    kind: "Mutual fund landing",
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
      <Nav />
      <main className="flex flex-1 flex-col">
        {/* Intro */}
        <section className="pt-24 md:pt-40">
          <Container>
            <div>
              <p className="max-w-[30ch] text-balance text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
                I&rsquo;m a product designer based in Mumbai. I design
                consumer products. Lately:{" "}
                <TransitionLink
                  href="/work/zilo"
                  className="underline decoration-line decoration-[1.5px] underline-offset-[0.14em] transition-[text-decoration-color] duration-200 hover:decoration-ink"
                >
                  quick-commerce
                </TransitionLink>
                ,{" "}
                <TransitionLink
                  href="/work/outcomes-ai"
                  className="underline decoration-line decoration-[1.5px] underline-offset-[0.14em] transition-[text-decoration-color] duration-200 hover:decoration-ink"
                >
                  healthtech
                </TransitionLink>
                , and interfaces that feel alive.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-12">
                <span className="inline-flex items-center gap-2.5 text-[17px] text-ink-soft md:text-[18px]">
                  <span aria-hidden className="status-dot" />
                  Open to product roles
                </span>
                <span
                  aria-hidden
                  className="hidden h-3 w-px bg-line sm:inline-block"
                />
                <span className="text-[17px] text-muted md:text-[18px]">
                  Currently at Pineapple Design Studio
                </span>
              </div>
            </div>

            {/* Client strip: infinite marquee (stays within the global container) */}
            <div className="mt-24 flex flex-col gap-7 md:mt-32 md:gap-8">
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
              <div className="flex items-baseline justify-between border-b border-line pb-5">
                <h2 className="text-[13px] text-muted">
                  Selected Work
                </h2>
                <span className="text-[13px] text-muted">
                  2023–2025
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
            <div className="flex items-baseline justify-between border-b border-line pb-5">
              <h2 className="text-[13px] text-muted">
                Pixels
              </h2>
              <Link
                href="/pixels"
                className="text-[13px] text-muted transition-colors hover:text-ink"
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
