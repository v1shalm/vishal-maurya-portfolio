import type { Work } from "@/lib/works";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { WorkThumbnail } from "@/components/WorkThumbnail";
import { TransitionLink } from "@/components/TransitionLink";

type Props = { works: Work[] };

/**
 * Selected Work section: 3 stacked full-width hero cards at 16:9,
 * image on top with title, tagline, and colour-blocked meta below.
 */
export function HomeWorkSection({ works }: Props) {
  return (
    <Reveal as="section" className="pt-20 md:pt-28">
      <div id="work">
        <Container>
          <SectionHeader title="Selected Work" />

          <div className="mt-12 flex flex-col gap-16 md:mt-20 md:gap-24">
            {works.map((work, i) => (
              <Reveal key={work.slug} delay={i * 80}>
                <TransitionLink
                  href={`/work/${work.slug}`}
                  className="group flex flex-col"
                  data-cursor="view-case-study"
                  data-cursor-label={work.locked ? "Under NDA" : undefined}
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-bg-elevated shadow-[0_0_0_1px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-active:translate-y-0 md:aspect-[16/10]">
                    {work.thumbnail ? (
                      <div
                        className="absolute inset-0"
                        style={
                          work.locked
                            ? { filter: "blur(22px) saturate(1.05)", transform: "scale(1.08)" }
                            : undefined
                        }
                      >
                        <WorkThumbnail
                          src={work.thumbnail}
                          poster={work.thumbnailPoster}
                          alt={`${work.title}: ${work.tagline}`}
                          className="transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-end p-10">
                        <span className="text-[13px] text-muted">
                          {work.title} · thumbnail pending
                        </span>
                      </div>
                    )}

                    {work.locked ? (
                      <>
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 bg-black/15"
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <span className="inline-flex items-center gap-2 rounded-full bg-bg/90 px-4 py-2 text-[13px] font-medium text-ink backdrop-blur-md shadow-[0_0_0_1px_rgba(0,0,0,0.06)] md:px-5 md:py-2.5 md:text-[14px]">
                            <LockGlyph />
                            Locked · NDA
                          </span>
                        </div>
                      </>
                    ) : null}
                  </div>

                  <div className="mt-6 flex max-w-[58ch] flex-col md:mt-8">
                    <p className="text-[22px] font-bold leading-[1.25] tracking-[-0.018em] text-ink md:text-[28px]">
                      {work.title}.
                    </p>
                    <p className="mt-2 text-pretty text-[16px] leading-[1.5] text-ink-soft transition-colors duration-300 ease-out group-hover:text-ink md:mt-3 md:text-[18px]">
                      {work.tagline}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-7 gap-y-1.5 text-[14px] text-muted md:mt-3 md:text-[15px]">
                      <span>{work.kind}</span>
                      <span className="tabular-nums">{work.year}</span>
                    </div>
                  </div>
                </TransitionLink>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>
    </Reveal>
  );
}

function LockGlyph() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 7V5a3.5 3.5 0 1 1 7 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="3"
        y="7"
        width="10"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
