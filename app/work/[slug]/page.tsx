import { notFound } from "next/navigation";
import { getWork, works } from "@/lib/works";
import type { ProblemItem, PullQuote, StatItem } from "@/lib/works";
import { siteUrl } from "@/lib/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { MediaBlock } from "@/components/MediaBlock";
import { CaseStudyNav } from "@/components/CaseStudyNav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Drawer } from "@/components/Drawer";
import { WorkThumbnail } from "@/components/WorkThumbnail";
import { TransitionLink } from "@/components/TransitionLink";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};

  // Note: no explicit `images` here. Next.js auto-attaches the dynamic OG
  // card from ./opengraph-image.tsx, which renders the project title and
  // tagline on the brand orange background.
  return {
    title: work.title,
    description: work.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: "article",
      title: `${work.title} · Case study by Vishal Maurya`,
      description: work.summary,
      url: `${siteUrl}/work/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${work.title} · Vishal Maurya`,
      description: work.summary,
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const index = works.findIndex((w) => w.slug === slug);
  const next = works[(index + 1) % works.length];
  const isLive = work.status === "Live";

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main className="flex flex-1 flex-col">
        {/* === Hero === */}
        <header className="pt-16 md:pt-20">
          <Container>
            <div className="max-w-[760px]">
                <h1 className="text-balance text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.1] tracking-[-0.012em] text-ink">
                  {work.title}
                </h1>

                <p className="mt-5 max-w-[54ch] text-pretty text-[17px] leading-[1.6] text-ink-soft md:text-[18px]">
                  {work.summary}
                </p>

              </div>

            <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden border-y border-line bg-line sm:grid-cols-2 md:mt-16 md:grid-cols-4">
              <MetaItem label="Role" value={work.role} />
              <MetaItem label="Timeline" value={work.timeline} />
              <MetaItem label="Team" value={work.team} />
              <div className="flex flex-col gap-1.5 bg-bg px-5 py-6 md:px-7 md:py-7">
                <dt className="text-[12px] text-muted">
                  Status
                </dt>
                <dd className="flex flex-col gap-1 text-[14.5px] leading-[1.45] text-ink">
                  <span>
                    <span
                      style={
                        isLive ? { color: "var(--color-accent)" } : undefined
                      }
                    >
                      {work.status}
                    </span>{" "}
                    · {work.year}
                  </span>
                  {work.liveUrl && (
                    <LiveLink
                      href={work.liveUrl}
                      label={work.liveLabel}
                    />
                  )}
                </dd>
              </div>
            </dl>

            {work.heroMedia && (
              <div
                className="mt-14"
                style={{ viewTransitionName: `work-hero-${slug}` }}
              >
                <MediaBlock media={work.heroMedia} />
              </div>
            )}
          </Container>
        </header>

        {/* === Body === */}
        <div className="mt-20 md:mt-28">
          <Container>
            <div className="flex flex-col gap-12 md:flex-row md:gap-16">
              <aside className="hidden w-[180px] shrink-0 md:block">
                <div className="sticky top-24">
                  <CaseStudyNav sections={work.sections} />
                </div>
              </aside>

              <div className="w-full min-w-0 max-w-[720px]">
                <div className="flex flex-col gap-20 md:gap-24">
                  {work.sections.map((section) => (
                    <section
                      key={section.kicker}
                      id={`section-${section.kicker}`}
                      className="scroll-mt-28 md:scroll-mt-24"
                    >
                      <div className="flex items-center gap-3">
                        <span className="tabular-nums text-[12px] text-muted">
                          {section.kicker}
                        </span>
                        <span aria-hidden className="block h-px w-8 bg-line" />
                        <span className="text-[12.5px] text-ink-soft">
                          {section.label}
                        </span>
                      </div>

                      <h2 className="mt-5 text-balance text-[22px] font-medium leading-[1.3] tracking-[-0.005em] text-ink md:text-[26px]">
                        {section.title}
                      </h2>

                      {section.collapsible ? (
                        <div className="mt-8">
                          <Drawer
                            label={`See ${section.label.toLowerCase()}`}
                            hint={section.drawerHint}
                          >
                            <div className="flex max-w-[62ch] flex-col gap-4 text-pretty text-[16px] leading-[1.7] text-ink-soft md:text-[15.5px]">
                              {section.body.map((para, i) => (
                                <p key={i}>{para}</p>
                              ))}
                            </div>
                            {section.media && (
                              <div className="mt-10">
                                <MediaBlock media={section.media} />
                              </div>
                            )}
                          </Drawer>
                        </div>
                      ) : (
                        <>
                          <div className="mt-6 flex max-w-[62ch] flex-col gap-4 text-pretty text-[16px] leading-[1.7] text-ink-soft md:text-[15.5px]">
                            {section.body.map((para, i) => (
                              <p key={i}>{para}</p>
                            ))}
                          </div>

                          {section.stats && section.stats.length > 0 && (
                            <StatRow items={section.stats} />
                          )}

                          {section.pullQuote && (
                            <PullQuoteBlock quote={section.pullQuote} />
                          )}

                          {section.problems && section.problems.length > 0 && (
                            <ProblemGrid items={section.problems} />
                          )}

                          {section.media && (
                            <div className="mt-10">
                              <MediaBlock media={section.media} />
                            </div>
                          )}
                        </>
                      )}
                    </section>
                  ))}
                </div>

                <div className="mt-24 border-t border-line pt-10 pb-24">
                  <TransitionLink
                    href={`/work/${next.slug}`}
                    className="group flex flex-col gap-6"
                    data-cursor="view-case-study"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-[13px] text-muted">
                        Next project
                      </span>
                      <span
                        aria-hidden
                        className="text-[22px] leading-none text-muted transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-ink"
                      >
                        →
                      </span>
                    </div>

                    <div
                      className="relative aspect-[3/2] w-full overflow-hidden bg-bg-elevated"
                      style={{ viewTransitionName: `work-hero-${next.slug}` }}
                    >
                      {next.thumbnail ? (
                        <WorkThumbnail
                          src={next.thumbnail}
                          poster={next.thumbnailPoster}
                          alt={`${next.title}: ${next.tagline}`}
                          className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-end p-8">
                          <span className="text-[11px] text-muted">
                            {next.title} · thumbnail pending
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] text-muted">
                        {next.kind}
                        {" · "}
                        <span
                          style={
                            next.status === "Live"
                              ? { color: "var(--color-accent)" }
                              : undefined
                          }
                        >
                          {next.status}
                        </span>{" "}
                        {next.year}
                      </span>
                      <span className="text-[28px] font-medium leading-[1.15] tracking-[-0.01em] text-ink transition-colors group-hover:text-ink-soft md:text-[34px]">
                        {next.title}
                      </span>
                      <p className="mt-1 max-w-[52ch] text-[15.5px] leading-[1.55] text-ink-soft md:text-[15.5px]">
                        {next.tagline}
                      </p>
                    </div>
                  </TransitionLink>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 bg-bg px-5 py-6 md:px-7 md:py-7">
      <dt className="text-[12px] text-muted">
        {label}
      </dt>
      <dd className="text-[14.5px] leading-[1.45] text-ink">{value}</dd>
    </div>
  );
}

function StatRow({ items }: { items: StatItem[] }) {
  return (
    <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 border-y border-line py-8 md:grid-cols-4 md:gap-x-8 md:gap-y-8">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-2">
          <dt className="text-[28px] font-medium leading-none tracking-[-0.02em] text-ink md:text-[32px]">
            {item.value}
          </dt>
          <dd className="text-[12px] leading-[1.5] text-muted">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}

function PullQuoteBlock({ quote }: { quote: PullQuote }) {
  return (
    <figure className="mt-10 border-l border-line pl-6 md:mt-12 md:pl-8">
      <blockquote className="text-[22px] font-medium italic leading-[1.4] tracking-[-0.005em] text-ink md:text-[26px]">
        <span
          aria-hidden
          className="mr-1 font-normal not-italic"
          style={{ color: "var(--color-accent)" }}
        >
          &ldquo;
        </span>
        {quote.text}
        <span
          aria-hidden
          className="ml-0.5 font-normal not-italic"
          style={{ color: "var(--color-accent)" }}
        >
          &rdquo;
        </span>
      </blockquote>
      <figcaption className="mt-4 text-[12.5px] text-muted">
        {quote.attribution}
      </figcaption>
    </figure>
  );
}

function ProblemGrid({ items }: { items: ProblemItem[] }) {
  return (
    <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex flex-col gap-3 bg-bg p-6 md:p-7"
        >
          <span className="text-[12px] text-muted tabular-nums">
            Problem {item.kicker}
          </span>
          <span className="text-[17px] font-medium leading-[1.3] tracking-[-0.005em] text-ink md:text-[18px]">
            {item.label}
          </span>
          <span className="text-[14px] leading-[1.55] text-ink-soft">
            {item.body}
          </span>
        </li>
      ))}
    </ul>
  );
}

function LiveLink({ href, label }: { href: string; label?: string }) {
  // Derive hostname when no explicit label is set (strip www., trailing slash).
  const display =
    label ??
    (() => {
      try {
        return new URL(href).hostname.replace(/^www\./, "");
      } catch {
        return href;
      }
    })();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="external"
      data-cursor-label={`Visit ${display}`}
      className="row-link group inline-flex w-fit items-baseline gap-1.5 text-[13px] text-ink-soft transition-colors hover:text-ink"
    >
      <span className="row-title">{display}</span>
      <span
        aria-hidden
        className="row-arrow text-[11px] leading-none text-muted transition-colors group-hover:text-ink"
      >
        ↗
      </span>
    </a>
  );
}
