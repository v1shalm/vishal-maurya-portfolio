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
            alt={`${work.title} — ${work.tagline}`}
            className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-10">
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
              {work.title} — thumbnail pending
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:mt-10">
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
          <span>{work.kind}</span>
          <span aria-hidden> — </span>
          <span style={isLive ? { color: "var(--color-accent)" } : undefined}>
            {work.status}
          </span>{" "}
          <span>{work.year}</span>
        </span>

        <span className="text-[22px] font-medium leading-[1.2] tracking-[-0.01em] text-ink transition-colors group-hover:text-ink-soft md:text-[30px]">
          {work.title}
        </span>

        <p className="max-w-[52ch] text-[16px] leading-[1.55] text-ink-soft md:text-[16px]">
          {work.tagline}
        </p>
      </div>
    </TransitionLink>
  );
}
