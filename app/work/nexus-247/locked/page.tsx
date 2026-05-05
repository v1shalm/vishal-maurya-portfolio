import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { UnlockForm } from "@/components/UnlockForm";
import { getWork } from "@/lib/works";
import { links } from "@/lib/links";

const SLUG = "nexus-247";

export const metadata: Metadata = {
  title: "Nexus 247 (locked)",
  description: "This case study is under NDA. Enter the password or request access.",
  robots: { index: false, follow: false },
};

export default function NexusLockedPage() {
  const work = getWork(SLUG);
  const requestSubject = encodeURIComponent("Case study access: Nexus 247");
  const requestBody = encodeURIComponent(
    "Hi Vishal,\n\nI'd like access to the Nexus 247 case study. A bit about me / what I'm working on:\n\n"
  );
  const mailto = `mailto:${links.emailDisplay}?subject=${requestSubject}&body=${requestBody}`;

  return (
    <>
      <Nav />
      <main id="main-content" className="flex flex-1 flex-col">
        <section>
          <Container>
            <div className="grid gap-12 md:grid-cols-[minmax(0,52ch)_1fr] md:items-start md:gap-16">
              <div>
                <span className="text-[12.5px] text-muted">
                  Under NDA · Locked
                </span>

                <h1 className="mt-6 text-balance text-[clamp(2.5rem,7vw,4rem)] font-bold leading-[1.05] tracking-tight text-ink">
                  {work?.title ?? "Nexus 247"} is locked.
                </h1>

                <p className="mt-8 max-w-[52ch] text-pretty text-[16px] leading-[1.7] text-ink-soft md:text-[18px]">
                  This case study is under NDA. If you have the password,
                  enter it below to read the full study. Otherwise, send a
                  short note and I&rsquo;ll share access where I can.
                </p>

                <div className="mt-10 max-w-[360px]">
                  <UnlockForm slug={SLUG} />
                </div>

                <div className="mt-8 text-[14px] leading-[1.7] text-ink-soft">
                  <span className="text-muted">Or </span>
                  <a
                    href={mailto}
                    data-cursor="external"
                    data-cursor-label="Email"
                    className="link-accent"
                  >
                    request access by email
                  </a>
                  <span className="text-muted">.</span>
                </div>
              </div>

              <div className="hidden md:flex md:items-start md:justify-end md:self-start md:pt-2">
                <div
                  aria-hidden
                  className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-2xl bg-bg-elevated shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"
                >
                  {work?.thumbnailPoster ? (
                    <Image
                      src={work.thumbnailPoster}
                      alt=""
                      fill
                      sizes="420px"
                      quality={92}
                      className="object-cover"
                      style={{ filter: "blur(18px) saturate(1.05)", transform: "scale(1.08)" }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full bg-bg/85 px-4 py-2 text-[13px] font-medium tracking-wide text-ink backdrop-blur">
                      Locked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
