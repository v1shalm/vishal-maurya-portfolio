import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { links } from "@/lib/links";

export const metadata: Metadata = {
  title: "About — Vishal Maurya",
  description:
    "A product designer based in Mumbai, currently at Pineapple Design Studio.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section className="pt-16 md:pt-24">
          <Container>
            <div className="max-w-[720px]">
              <h1 className="text-[11px] uppercase tracking-[0.18em] text-muted">
                About
              </h1>

              <div className="mt-8 flex max-w-[58ch] flex-col gap-5 text-[17px] leading-[1.7] text-ink md:text-[18px]">
                <p>
                  I&rsquo;m Vishal Maurya — a product designer based in
                  Mumbai. Currently at Pineapple Design Studio, where
                  I&rsquo;ve shipped consumer products in quick-commerce
                  (Nexus 247, Zilo) and healthtech (OutcomesAI).
                </p>
                <p>
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
              </div>

              <div className="mt-20 grid grid-cols-1 gap-10 border-t border-line pt-10 md:grid-cols-2 md:gap-12">
                <Block label="Now">
                  Sr. Associate UI Designer at Pineapple Design Studio.
                  Exploring in-house product roles, especially in
                  quick-commerce, food, and shopping.
                </Block>

                <Block label="Experience">
                  2.5+ years across eCommerce, AI-powered SaaS, and fintech.
                  Previously at Make It Grow and SpiceTrance.
                </Block>

                <Block label="Tools">
                  Figma for design. Framer and a bit of React for prototyping
                  and the site you&rsquo;re reading. Photoshop, Illustrator,
                  Lottie when a project needs them.
                </Block>

                <Block label="Reach">
                  <a
                    href={links.email}
                    className="link-accent"
                    data-cursor="email"
                  >
                    {links.emailDisplay}
                  </a>
                  <br />
                  <a
                    href={links.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="external"
                    className="transition-colors hover:text-ink"
                  >
                    Resume (PDF)
                  </a>
                  <br />
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="external"
                    className="transition-colors hover:text-ink"
                  >
                    LinkedIn
                  </a>
                  <br />
                  <a
                    href={links.dribbble}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="external"
                    className="transition-colors hover:text-ink"
                  >
                    Dribbble
                  </a>
                </Block>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      <p className="text-[14.5px] leading-[1.65] text-ink-soft">{children}</p>
    </div>
  );
}
