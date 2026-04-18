import Link from "next/link";
import { notFound } from "next/navigation";
import { getWork, works } from "@/lib/works";
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

  // Prefer a still-image poster for social previews (video thumbnails won't embed)
  const poster =
    work.thumbnailPoster ??
    (work.thumbnail && !/\.(mp4|webm|mov)$/i.test(work.thumbnail)
      ? work.thumbnail
      : undefined);

  return {
    title: work.title,
    description: work.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: "article",
      title: `${work.title} — Case study by Vishal Maurya`,
      description: work.summary,
      url: `${siteUrl}/work/${slug}`,
      images: poster ? [{ url: poster, alt: work.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${work.title} — Vishal Maurya`,
      description: work.summary,
      images: poster ? [poster] : undefined,
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
        {/* ——— Hero ——— */}
        <header className="pt-16 md:pt-20">
          <Container>
            <div className="max-w-[760px]">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted">
                  <Link
                    href="/#work"
                    className="transition-colors hover:text-ink"
                  >
                    ← Index
                  </Link>
                  <span aria-hidden>/</span>
                  <span>{work.kind}</span>
                </div>

                <h1 className="mt-8 text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.1] tracking-[-0.012em] text-ink">
                  {work.title}
                </h1>

                <p className="mt-5 max-w-[54ch] text-[17px] leading-[1.6] text-ink-soft md:text-[18px]">
                  {work.summary}
                </p>

                <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-line py-6 text-[13.5px] md:grid-cols-4 md:gap-x-10">
                  <MetaItem label="Role" value={work.role} />
                  <MetaItem label="Timeline" value={work.timeline} />
                  <MetaItem label="Team" value={work.team} />
                  <div className="flex flex-col gap-1.5">
                    <dt className="text-[10.5px] uppercase tracking-[0.18em] text-muted">
                      Status
                    </dt>
                    <dd className="text-ink">
                      <span
                        style={
                          isLive ? { color: "var(--color-accent)" } : undefined
                        }
                      >
                        {work.status}
                      </span>{" "}
                      · {work.year}
                    </dd>
                  </div>
                </dl>
              </div>

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

        {/* ——— Body ——— */}
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
                        <span className="tabular-nums text-[11px] text-muted">
                          {section.kicker}
                        </span>
                        <span aria-hidden className="block h-px w-6 bg-line" />
                        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                          {section.label}
                        </span>
                      </div>

                      <h2 className="mt-5 text-[22px] font-medium leading-[1.3] tracking-[-0.005em] text-ink md:text-[26px]">
                        {section.title}
                      </h2>

                      {section.collapsible ? (
                        <div className="mt-8">
                          <Drawer
                            label={`See ${section.label.toLowerCase()}`}
                            hint={section.drawerHint}
                          >
                            <div className="flex max-w-[62ch] flex-col gap-4 text-[16px] leading-[1.7] text-ink-soft md:text-[15.5px]">
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
                          <div className="mt-6 flex max-w-[62ch] flex-col gap-4 text-[16px] leading-[1.7] text-ink-soft md:text-[15.5px]">
                            {section.body.map((para, i) => (
                              <p key={i}>{para}</p>
                            ))}
                          </div>

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
                      <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
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
                          alt={`${next.title} — ${next.tagline}`}
                          className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-end p-8">
                          <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
                            {next.title} — thumbnail pending
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
                        {next.kind}
                        {" — "}
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
    <div className="flex flex-col gap-1.5">
      <dt className="text-[10.5px] uppercase tracking-[0.18em] text-muted">
        {label}
      </dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
