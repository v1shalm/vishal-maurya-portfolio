import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";

export const metadata = {
  title: "Not found",
  description: "This page wandered off. Try the index, or send a note.",
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section className="pt-24 md:pt-40">
          <Container>
            <div className="max-w-[58ch]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
                404 — Not found
              </span>

              <h1 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.015em] text-ink">
                This page wandered off.
              </h1>

              <p className="mt-8 text-[16px] leading-[1.75] text-ink-soft md:text-[18px]">
                Wrong address, broken link, or a page that moved while you
                weren&rsquo;t looking.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] leading-[1.75]">
                <Link href="/" className="link-accent">
                  Index
                </Link>
                <span aria-hidden className="text-line">
                  ·
                </span>
                <Link href="/#work" className="link-accent">
                  Selected work
                </Link>
                <span aria-hidden className="text-line">
                  ·
                </span>
                <Link href="/pixels" className="link-accent">
                  Pixels
                </Link>
                <span aria-hidden className="text-line">
                  ·
                </span>
                <a
                  href="mailto:vishalm.designs@gmail.com"
                  data-cursor="email"
                  className="link-accent"
                >
                  Email me
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
