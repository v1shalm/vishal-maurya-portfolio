import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { EmailLink } from "@/components/EmailLink";
import { HaloTitle } from "@/components/HaloTitle";
import { WorkThumbnail } from "@/components/WorkThumbnail";
import { works } from "@/lib/works";
import { links } from "@/lib/links";

export const metadata = {
  title: "Not found",
  description: "This page wandered off. Try the index, or send a note.",
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section>
          <Container>
            <div className="grid gap-12 md:grid-cols-[minmax(0,58ch)_1fr] md:items-start md:gap-16">
              <div>
              <span className="text-[12.5px] text-muted">
                404 · Not found
              </span>

              <h1 className="hero-y2k mt-6 flex flex-wrap text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[0.95] tracking-tight gap-x-[0.25em]">
                <span>This one</span>
                <HaloTitle text="got away." color="magenta" />
              </h1>

              <p className="mt-8 text-pretty text-[16px] leading-[1.75] text-ink-soft md:text-[18px]">
                No page lives at this address. Maybe the link bit-rotted,
                maybe something moved. Here&rsquo;s what you were probably
                after.
              </p>

              {/* Case studies: the most likely intent */}
              <ul className="mt-12 flex flex-col gap-3">
                {works.map((w) => (
                  <li key={w.slug}>
                    <Link
                      href={`/work/${w.slug}`}
                      data-cursor="view-case-study"
                      className="row-link group flex items-center gap-5 rounded-lg bg-bg-elevated p-4 md:gap-7 md:p-5"
                    >
                      <div className="relative aspect-[3/2] w-[120px] shrink-0 overflow-hidden rounded-md bg-bg md:w-[160px]">
                        {w.thumbnail ? (
                          <WorkThumbnail
                            src={w.thumbnail}
                            poster={w.thumbnailPoster}
                            alt={`${w.title}: ${w.tagline}`}
                            className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-end p-3">
                            <span className="text-[11.5px] text-muted">
                              {w.title}
                            </span>
                          </div>
                        )}
                      </div>

                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="row-title text-[18px] font-bold tracking-tight text-ink md:text-[20px]">
                          {w.title}
                        </span>
                        <span className="text-[13px] text-muted">
                          {w.kind} · {w.year}
                        </span>
                      </span>

                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] leading-[1.75] text-ink-soft">
                <span className="text-[12px] text-muted">
                  Or
                </span>
                <Link href="/" className="link-accent">
                  Index
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
                <Link href="/about" className="link-accent">
                  About
                </Link>
                <span aria-hidden className="text-line">
                  ·
                </span>
                <EmailLink
                  email={links.emailDisplay}
                  display="Email me"
                  className="link-accent"
                />
              </div>
              </div>

              {/* Right column: giant typographic 404 filling empty space */}
              <div
                aria-hidden
                className="hidden md:flex md:justify-end md:self-start md:pt-2"
              >
                <span
                  className="select-none font-medium leading-[0.82] tracking-[-0.055em]"
                  style={{
                    fontSize: "clamp(9rem, 18vw, 16rem)",
                    color: "var(--color-line)",
                  }}
                >
                  404
                </span>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
