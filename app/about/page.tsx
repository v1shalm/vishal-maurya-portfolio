import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Container } from "@/components/Container";
import { AboutStrip, type AboutStripItem } from "@/components/AboutStrip";
import { EmailLink } from "@/components/EmailLink";
import { links } from "@/lib/links";

export const metadata: Metadata = {
  title: "About — Vishal Maurya",
  description:
    "A product designer based in Mumbai, currently at Pineapple Design Studio.",
};

// Placeholder tiles until real photos are dropped in. Varied aspects give the
// strip visual rhythm; swap the `src` in and the tile uses the photo.
const stripItems: AboutStripItem[] = [
  { alt: "Studio morning — Mumbai", aspect: "3/4" },
  { alt: "Pineapple desk", aspect: "4/5" },
  { alt: "Sketching", aspect: "3/2" },
  { alt: "Out and about", aspect: "4/5" },
  { alt: "Workshop bench", aspect: "3/4" },
  { alt: "Home setup", aspect: "3/2" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col md:h-[100dvh] md:overflow-hidden">
      <Nav />
      <main className="flex flex-1 min-h-0 flex-col">
        <section className="flex flex-1 min-h-0">
          <Container className="flex min-h-0 flex-1 flex-col py-10 md:py-12">
            {/*
              Mobile: stack — text then a fixed-height strip.
              md+: 60/40 grid, cells stretch so the strip matches the text
              column height; strip uses absolute positioning inside its cell
              so horizontal-scroll doesn't disturb layout.
            */}
            <div className="flex flex-col gap-12 md:grid md:min-h-0 md:flex-1 md:grid-cols-[60fr_40fr] md:items-stretch md:gap-10 lg:gap-14">
              <div className="flex min-h-0 flex-col">
                <h1 className="text-[11px] uppercase tracking-[0.18em] text-muted">
                  About
                </h1>

                <div className="mt-8 flex flex-col gap-12 md:mt-10 md:min-h-0 md:flex-1 md:justify-between md:gap-8">
                  <Row label="Hi, I'm Vishal">
                    <p>
                      I&rsquo;m a product designer based in Mumbai. Currently
                      at Pineapple Design Studio, where I&rsquo;ve shipped
                      consumer products in quick-commerce (Nexus 247, Zilo)
                      and healthtech (OutcomesAI).
                    </p>
                    <p className="mt-4">
                      I&rsquo;m exploring a move to an in-house product team —
                      ideally at a consumer-facing company building for Indian
                      users. If you&rsquo;re hiring for product design,{" "}
                      <a
                        href={links.email}
                        className="link-accent"
                        data-cursor="email"
                      >
                        I&rsquo;d love to talk
                      </a>
                      .
                    </p>
                  </Row>

                  <Row label="What I'm up to">
                    <ul className="flex flex-col gap-1.5">
                      <li>
                        Designing at{" "}
                        <span className="text-ink">
                          Pineapple Design Studio
                        </span>
                      </li>
                      <li className="text-ink-soft">
                        and freelancing on the side
                      </li>
                      <li className="text-ink-soft">
                        and tinkering with personal UI in{" "}
                        <a href="/pixels" className="link-accent">
                          Pixels
                        </a>
                      </li>
                    </ul>
                    <p className="mt-4 text-ink-soft">
                      For the long form,{" "}
                      <a
                        href={links.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="external"
                        data-cursor-label="Open resume"
                        className="link-accent"
                      >
                        my resume (PDF)
                      </a>
                      .
                    </p>
                  </Row>

                  <Row label="Elsewhere">
                    <ul className="flex flex-col gap-1.5">
                      <li>
                        <EmailLink
                          email={links.emailDisplay}
                          className="link-accent"
                        />
                      </li>
                      <li>
                        <a
                          href={links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="external"
                          data-cursor-label="Open LinkedIn"
                          className="link-accent"
                        >
                          LinkedIn
                        </a>
                      </li>
                      <li>
                        <a
                          href={links.dribbble}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="external"
                          data-cursor-label="Open Dribbble"
                          className="link-accent"
                        >
                          Dribbble
                        </a>
                      </li>
                    </ul>
                  </Row>
                </div>
              </div>

              {/* Strip cell — fills the grid row height on md+ */}
              <div className="relative h-[clamp(260px,60vw,420px)] min-h-0 md:h-auto">
                <div className="absolute inset-0">
                  <AboutStrip items={stripItems} />
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 md:grid md:grid-cols-[8.5rem_1fr] md:gap-8">
      <span className="pt-[3px] text-[10.5px] uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      <div className="text-[15px] leading-[1.65] text-ink md:text-[15.5px]">
        {children}
      </div>
    </div>
  );
}
