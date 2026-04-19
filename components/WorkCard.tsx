import type { Work } from "@/lib/works";
import { WorkThumbnail } from "@/components/WorkThumbnail";
import { TransitionLink } from "@/components/TransitionLink";

export function WorkCard({ work }: { work: Work }) {
  const isLive = work.status === "Live";

  return (
    <TransitionLink
      href={`/work/${work.slug}`}
      className="group flex flex-col"
      data-cursor="view-case-study"
    >
      <div
        className="relative aspect-[3/2] w-full overflow-hidden bg-bg-elevated"
        style={{ viewTransitionName: `work-hero-${work.slug}` }}
      >
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

      <div className="mt-5 flex items-baseline justify-between gap-5 md:mt-6 md:gap-8">
        <p className="max-w-[40ch] text-pretty text-[16px] leading-[1.45] text-ink transition-colors duration-300 ease-out group-hover:text-ink-soft md:text-[17px]">
          {work.tagline}
        </p>
        <span className="shrink-0 text-[10.5px] uppercase tracking-[0.14em] text-muted tabular-nums">
          <span className="text-ink-soft">{work.title}</span>
          <span aria-hidden className="mx-1.5 text-line">
            ·
          </span>
          <span style={isLive ? { color: "var(--color-accent)" } : undefined}>
            {work.status}
          </span>{" "}
          {work.year}
        </span>
      </div>
    </TransitionLink>
  );
}
