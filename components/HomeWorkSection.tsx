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
    <Reveal as="section" className="pt-36 md:pt-48">
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
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-bg-elevated transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
                    {work.thumbnail ? (
                      <WorkThumbnail
                        src={work.thumbnail}
                        poster={work.thumbnailPoster}
                        alt={`${work.title}: ${work.tagline}`}
                        className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-end p-10">
                        <span className="text-[13px] text-muted">
                          {work.title} · thumbnail pending
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col gap-1.5 md:mt-8 md:flex-row md:items-baseline md:justify-between md:gap-10">
                    <div className="flex flex-col gap-1.5 md:max-w-[58ch]">
                      <p className="text-[22px] font-bold leading-[1.25] tracking-[-0.018em] text-ink md:text-[28px]">
                        {work.title}.
                      </p>
                      <p className="text-pretty text-[16px] leading-[1.5] text-ink-soft transition-colors duration-300 ease-out group-hover:text-ink md:text-[18px]">
                        {work.tagline}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 text-[13px] md:text-[14px]">
                      <span
                        className="inline-flex items-center rounded-md px-2.5 py-1 font-bold tracking-tight text-white"
                        style={{ background: "var(--color-block-purple)" }}
                      >
                        {work.kind}
                      </span>
                      <span
                        className="inline-flex items-center rounded-md px-2.5 py-1 font-bold tracking-tight tabular-nums text-white"
                        style={{ background: "var(--color-block-orange)" }}
                      >
                        {work.year}
                      </span>
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
