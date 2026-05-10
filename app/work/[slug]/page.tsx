import { notFound } from "next/navigation";
import { getWork, works } from "@/lib/works";
import type { ProblemItem, PullQuote, StatItem } from "@/lib/works";
import { siteUrl } from "@/lib/site";
import { isUnlockedHost } from "@/lib/host";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { MediaBlock } from "@/components/MediaBlock";
import { CaseStudyNav } from "@/components/CaseStudyNav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Drawer } from "@/components/Drawer";
import { WorkThumbnail } from "@/components/WorkThumbnail";
import { TransitionLink } from "@/components/TransitionLink";
import { Button } from "@/components/Button";

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

  const ogImage = {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: `${work.title} · Case study by Vishal Maurya`,
  };

  return {
    title: work.title,
    description: work.summary,
    alternates: { canonical: `/work/${slug}` },
    // Locked case studies (NDA work) stay out of search indexes even
    // though the URL is technically reachable.
    robots: work.locked ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: `${work.title} · Case study by Vishal Maurya`,
      description: work.summary,
      url: `${siteUrl}/work/${slug}`,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${work.title} · Vishal Maurya`,
      description: work.summary,
      images: [ogImage.url],
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

  // The "next project" rail skips locked entries on the public domain so
  // visitors don't land on an unlinked NDA case study from the rail.
  // On portfolio.* every case study is fair game.
  const unlockAll = await isUnlockedHost();
  const visibleWorks = unlockAll
    ? works
    : works.filter((w) => !w.locked || w.slug === slug);
  const visibleIndex = visibleWorks.findIndex((w) => w.slug === slug);
  const next = visibleWorks[(visibleIndex + 1) % visibleWorks.length];
  const isLive = work.status === "Live";

  const heroImage =
    work.heroMedia?.kind === "single" ? work.heroMedia.item.src : undefined;
  const posterImage = work.thumbnailPoster;
  const staticThumb =
    work.thumbnail && !work.thumbnail.endsWith(".mp4")
      ? work.thumbnail
      : undefined;
  const ogImage = heroImage ?? posterImage ?? staticThumb;

  const workSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.title,
    headline: work.title,
    description: work.summary,
    abstract: work.tagline,
    url: `${siteUrl}/work/${slug}`,
    inLanguage: "en",
    dateCreated: work.year,
    datePublished: work.year,
    genre: work.kind,
    creator: {
      "@type": "Person",
      name: "Vishal Maurya",
      url: siteUrl,
    },
    author: {
      "@type": "Person",
      name: "Vishal Maurya",
      url: siteUrl,
    },
    ...(ogImage ? { image: `${siteUrl}${ogImage}` } : {}),
    ...(work.liveUrl ? { sameAs: [work.liveUrl] } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workSchema) }}
      />
      <ScrollProgress />
      <Nav />
      <main id="main-content" className="flex flex-1 flex-col">
        {/* === Hero === */}
        <header>
          <Container>
            <div className="max-w-[760px]">
                <h1 className="text-balance text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.0] tracking-[-0.02em] text-ink">
                  {work.title}
                </h1>

                <p className="mt-6 max-w-[54ch] text-pretty text-[17px] leading-[1.6] text-ink-soft md:text-[18px]">
                  {work.summary}
                </p>

                {work.liveUrl && (
                  <div className="mt-8">
                    <Button
                      variant="yellow"
                      href={work.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="external"
                      data-cursor-label={`Visit ${work.liveLabel ?? new URL(work.liveUrl).hostname.replace(/^www\./, "")}`}
                    >
                      Try it live
                    </Button>
                  </div>
                )}

              </div>

            <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-4 md:mt-16 md:gap-x-12">
              <MetaItem label="Role" value={work.role} />
              <MetaItem label="Timeline" value={work.timeline} />
              <MetaItem label="Team" value={work.team} />
              <div className="flex flex-col gap-2.5">
                <dt className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                  <span
                    aria-hidden
                    className="h-[5px] w-[5px] rounded-[1px]"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                  Status
                </dt>
                <dd className="flex flex-col gap-1 text-[15.5px] font-medium leading-[1.4] text-ink">
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
              <div className="mt-14">
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
                  {work.sections.map((section, i) => (
                    <section
                      key={i}
                      id={`section-${i}`}
                      className="scroll-mt-28 md:scroll-mt-24"
                    >
                      <span className="text-[13px] font-medium text-[color:var(--color-accent)] md:text-[14px]">
                        {section.label}
                      </span>

                      <h2 className="mt-3 text-balance text-[24px] font-bold leading-[1.15] tracking-[-0.018em] text-ink md:mt-4 md:text-[28px]">
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

                          {section.bodyAfter && section.bodyAfter.length > 0 && (
                            <div className="mt-10 flex max-w-[62ch] flex-col gap-4 text-pretty text-[16px] leading-[1.7] text-ink-soft md:text-[15.5px]">
                              {section.bodyAfter.map((para, i) => (
                                <p key={i}>{para}</p>
                              ))}
                            </div>
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

                <div className="mt-24 pt-10 pb-24">
                  <TransitionLink
                    href={`/work/${next.slug}`}
                    className="group flex flex-col gap-6"
                    data-cursor="view-case-study"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-[13px] text-muted">
                        Next project
                      </span>
                      <span className="text-[13px] text-muted transition-colors group-hover:text-ink">
                        {next.title}
                      </span>
                    </div>

                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-bg-elevated shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
                      {next.thumbnail ? (
                        <WorkThumbnail
                          src={next.thumbnail}
                          poster={next.thumbnailPoster}
                          alt={`${next.title}: ${next.tagline}`}
                          className="transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-end p-8">
                          <span className="text-[12.5px] text-muted">
                            {next.title} · thumbnail pending
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[28px] font-medium leading-[1.15] tracking-[-0.01em] text-ink transition-colors duration-300 ease-out group-hover:text-ink-soft md:text-[34px]">
                        {next.title}
                      </span>
                      <p className="mt-2 max-w-[52ch] text-pretty text-[15.5px] leading-[1.55] text-ink-soft md:mt-3">
                        {next.tagline}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-7 gap-y-1.5 text-[14px] text-muted md:mt-3 md:text-[15px]">
                        <span>{next.kind}</span>
                        <span className="tabular-nums">{next.year}</span>
                      </div>
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
    <div className="flex flex-col gap-2.5">
      <dt className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
        <span
          aria-hidden
          className="h-[5px] w-[5px] rounded-[1px]"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
        {label}
      </dt>
      <dd className="text-[15.5px] font-medium leading-[1.4] text-ink">{value}</dd>
    </div>
  );
}

function StatRow({ items }: { items: StatItem[] }) {
  return (
    <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:mt-14 md:grid-cols-4 md:gap-x-12">
      {items.map((item, i) => {
        const accent =
          i % 2 === 0
            ? "var(--color-accent)"
            : "var(--color-yellow-edge)";
        return (
          <div key={i} className="flex flex-col gap-2.5">
            <dt
              className="whitespace-nowrap text-[40px] font-bold leading-[0.9] tracking-[-0.025em] tabular-nums md:text-[52px]"
              style={{ color: accent }}
            >
              {item.value}
            </dt>
            <dd className="max-w-[28ch] text-[12.5px] leading-[1.55] text-ink-soft md:text-[13px]">
              {item.label}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function PullQuoteBlock({ quote }: { quote: PullQuote }) {
  return (
    <figure className="mt-12 md:mt-14">
      <blockquote className="max-w-[24ch] text-balance text-[28px] font-bold leading-[1.2] tracking-[-0.018em] text-ink md:text-[36px]">
        <span
          aria-hidden
          className="mr-1.5 align-[-0.05em] text-[1.4em] leading-none"
          style={{ color: "var(--color-accent)" }}
        >
          &ldquo;
        </span>
        {quote.text}
        <span
          aria-hidden
          className="ml-0.5 align-[-0.4em] text-[1.4em] leading-none"
          style={{ color: "var(--color-accent)" }}
        >
          &rdquo;
        </span>
      </blockquote>
      <figcaption className="mt-5 text-[12.5px] text-muted">
        {quote.attribution}
      </figcaption>
    </figure>
  );
}

function ProblemGrid({ items }: { items: ProblemItem[] }) {
  return (
    <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:mt-14 md:gap-x-14 md:gap-y-12">
      {items.map((item, i) => {
        const accent =
          i % 2 === 0
            ? "var(--color-accent)"
            : "var(--color-yellow-edge)";
        return (
          <li key={i} className="flex flex-col">
            <span
              className="text-[48px] font-bold leading-[0.9] tracking-[-0.025em] tabular-nums md:text-[60px]"
              style={{ color: accent }}
            >
              {item.kicker}
            </span>
            <span className="mt-4 text-[17px] font-bold leading-[1.25] tracking-[-0.012em] text-ink md:mt-5 md:text-[18px]">
              {item.label}
            </span>
            <span className="mt-2 max-w-[34ch] text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">
              {item.body}
            </span>
          </li>
        );
      })}
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
      className="row-link group inline-flex w-fit items-baseline text-[13px] text-ink-soft transition-colors hover:text-ink"
    >
      <span className="row-title">{display}</span>
    </a>
  );
}
