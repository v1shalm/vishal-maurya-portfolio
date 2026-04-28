import type { Work } from "@/lib/works";
import { WorkThumbnail } from "@/components/WorkThumbnail";
import { TransitionLink } from "@/components/TransitionLink";

export function WorkCard({ work }: { work: Work }) {
  return (
    <TransitionLink
      href={`/work/${work.slug}`}
      className="group flex flex-col"
      data-cursor="view-case-study"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-bg-elevated transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
        {work.thumbnail ? (
          <WorkThumbnail
            src={work.thumbnail}
            poster={work.thumbnailPoster}
            alt={`${work.title}: ${work.tagline}`}
            className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-10">
            <span className="text-[13px] text-muted">
              {work.title} · thumbnail pending
            </span>
          </div>
        )}
      </div>

      {/* Three-line stack: project name, tagline, then category · year. */}
      <div className="mt-5 flex flex-col md:mt-7">
        {/* Line 1 — project name */}
        <p className="text-[18px] font-bold leading-[1.3] tracking-[-0.012em] text-ink md:text-[20px]">
          {work.title}.
        </p>

        {/* Line 2 — tagline */}
        <p className="mt-1.5 max-w-[52ch] text-pretty text-[16px] leading-[1.5] text-ink-soft transition-colors duration-300 ease-out group-hover:text-ink md:text-[17px]">
          {work.tagline}
        </p>

        {/* Line 3 — category · year */}
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted md:text-[14px]">
          <span>{work.kind}</span>
          <span className="text-line-soft">·</span>
          <span className="tabular-nums">{work.year}</span>
        </div>
      </div>
    </TransitionLink>
  );
}
