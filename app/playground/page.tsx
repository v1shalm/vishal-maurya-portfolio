import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Container } from "@/components/Container";
import { HaloTitle } from "@/components/HaloTitle";

export const metadata: Metadata = {
  title: "Playground · Vishal Maurya",
  description: "Experiments, drafts, and in-progress interaction studies.",
  robots: { index: false, follow: false },
};

type Preview =
  | { kind: "image"; src: string; alt: string }
  | { kind: "swatch"; color: string; ink: string; pattern?: string }
  | { kind: "resume" };

type Experiment = {
  slug: string;
  href: string;
  /** Whether the href points to an external deployment / GitHub / live URL. */
  external?: boolean;
  title: string;
  subtext: string;
  tags: string[];
  status: "In progress" | "Draft" | "Shipped" | "Archived";
  preview: Preview;
};

// Inline SVG pattern (dots) for the guest-card preview tile so the playground
// card reads as what it actually is, without needing a bespoke screenshot.
const DOT_PATTERN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><circle cx='3' cy='3' r='1' fill='#fff' opacity='0.28'/></svg>",
)}")`;

const experiments: Experiment[] = [
  {
    slug: "resume-builder",
    href: "https://build-resume-vishal.vercel.app/",
    external: true,
    title: "Résumé Builder",
    subtext:
      "A keyboard-first résumé editor with a live A4 preview and ATS-safe PDF export. Drag rows, type into the canvas, swap themes, every interaction has a tactile audio cue and the preview updates in real time. Built open source on Next.js 15 + React 19.",
    tags: [
      "Next.js",
      "Motion",
      "PDF Export",
      "Audio Feedback",
      "Drag-to-reorder",
    ],
    status: "Shipped",
    preview: { kind: "resume" },
  },
  {
    slug: "guest-card",
    href: "/playground/guest-card",
    title: "Guest card",
    subtext:
      "A tactile thank-you card tucked behind a pill bar. Pick a color, pick a pattern, sign, and drag the card down into the bar to send. Nothing is transmitted; the finished card downloads as a PNG.",
    tags: ["Motion", "Canvas", "Drag-to-send", "SVG to PNG"],
    status: "In progress",
    preview: {
      kind: "swatch",
      color: "#f91ca9",
      ink: "#FFFFFF",
      pattern: DOT_PATTERN,
    },
  },
];

export default function PlaygroundPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section>
          <Container>
            <div className="max-w-[720px]">
              <h1 className="hero-y2k flex text-[clamp(2.75rem,7vw,5.25rem)] font-bold leading-[0.95] tracking-tight">
                <HaloTitle text="Playground" color="yellow" />
              </h1>

              <p className="mt-10 max-w-[48ch] text-pretty text-[18px] font-bold leading-[1.5] text-ink md:text-[20px]">
                Ongoing experiments where art, code, and design overlap.
                Kept in the open. Some ship, most stay here.
              </p>
            </div>
          </Container>
        </section>

        <section className="mt-20 md:mt-28">
          <Container>
            <div className="flex items-baseline justify-between">
              <h2 className="text-[13px] text-muted">Experiments</h2>
              <span className="text-[13px] text-muted">
                {experiments.length} live
              </span>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-14 md:mt-16 md:grid-cols-2 md:gap-y-20">
              {experiments.map((e) => (
                <ExperimentCard key={e.slug} exp={e} />
              ))}
            </div>
          </Container>
        </section>

        <div className="h-40 md:h-56" />
      </main>
    </>
  );
}

function ExperimentCard({ exp }: { exp: Experiment }) {
  const isLive = exp.status === "In progress" || exp.status === "Shipped";

  const cardBody = (
    <>
      <PreviewTile preview={exp.preview} title={exp.title} />

      {/* Three-line stack matching WorkCard / PixelsTile across the site:
          title → subtext → category · status. */}
      <div className="mt-5 flex flex-col md:mt-7">
        <p className="text-[18px] font-bold leading-[1.3] tracking-[-0.012em] text-ink md:text-[20px]">
          {exp.title}.
        </p>

        <p className="mt-1.5 max-w-[52ch] text-pretty text-[16px] leading-[1.5] text-ink-soft transition-colors duration-300 ease-out group-hover:text-ink md:text-[17px]">
          {exp.subtext}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted md:text-[14px]">
          <span>{exp.tags[0]}</span>
          <span className="text-line-soft">·</span>
          <span
            className={isLive ? "font-semibold" : ""}
            style={isLive ? { color: "var(--color-accent)" } : undefined}
          >
            {exp.status}
          </span>
        </div>
      </div>
    </>
  );

  // External (live deployment / GitHub) opens in new tab; internal routes
  // use Next's Link for client navigation.
  if (exp.external) {
    return (
      <a
        href={exp.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col"
        data-cursor="external"
        data-cursor-label="Open live site"
      >
        {cardBody}
      </a>
    );
  }

  return (
    <Link
      href={exp.href}
      className="group flex flex-col"
      data-cursor="view-case-study"
    >
      {cardBody}
    </Link>
  );
}

function PreviewTile({
  preview,
  title,
}: {
  preview: Preview;
  title: string;
}) {
  if (preview.kind === "image") {
    return (
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-bg-elevated">
        <Image
          src={preview.src}
          alt={preview.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  if (preview.kind === "resume") {
    return <ResumePreview />;
  }

  // Mini guest-card mockup that hints at what the experiment actually is:
  // a tilted card on a soft pink wash, with a hand-drawn signature curve.
  // Replaces the flat orange swatch + italic serif type from v2.
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-pink-100 via-pink-50 to-yellow-50">
      {/* Subtle dot grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18'><circle cx='3' cy='3' r='1' fill='%23f91ca9' opacity='0.18'/></svg>",
          )}")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Tilted mini-card preview */}
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
        <div
          className="flex w-[min(75%,300px)] -rotate-[3deg] flex-col gap-2 rounded-2xl bg-white p-5 shadow-[0_28px_56px_-16px_rgba(249,28,169,0.4),0_8px_16px_-4px_rgba(0,0,0,0.08)] ring-1 ring-pink-100/60 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-[1deg] group-hover:scale-[1.04] md:p-6"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-pink-600">
            Hello,
          </span>
          <span className="text-[clamp(1.125rem,2.2vw,1.625rem)] font-bold leading-[1.05] tracking-[-0.018em] text-ink">
            Thank you for visiting.
          </span>
          {/* Hand-drawn signature scribble */}
          <svg
            aria-hidden
            className="mt-3 h-6 w-24"
            viewBox="0 0 96 24"
            fill="none"
          >
            <path
              d="M2 18 C 12 4, 22 22, 32 12 S 56 4, 68 16 S 90 6, 94 12"
              stroke="#f91ca9"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/**
 * Mini A4 résumé mockup. Light yellow wash background, with a tilted
 * white paper card showing mock content bars: a bold name row, a smaller
 * role row, then three small "section" groups separated by gaps.
 * Hovers to a softer rotation and a slight scale.
 */
function ResumePreview() {
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      {/* Faint grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><path d='M0 0H20M0 0V20' stroke='%23dbd009' stroke-width='0.5' opacity='0.3'/></svg>",
          )}")`,
          backgroundRepeat: "repeat",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
        <div
          className="aspect-[1/1.3] w-[42%] -rotate-[3deg] overflow-hidden rounded-[6px] bg-white p-4 shadow-[0_28px_56px_-16px_rgba(219,208,9,0.5),0_8px_18px_-4px_rgba(0,0,0,0.10)] ring-1 ring-black/5 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-[1deg] group-hover:scale-[1.04] md:w-[44%]"
        >
          {/* Name bar */}
          <div className="h-2 w-3/5 rounded-sm bg-ink" />
          <div className="mt-1 h-1 w-2/5 rounded-sm bg-muted/60" />

          {/* Section 1 */}
          <div className="mt-3 h-[2px] w-1/4 rounded-sm bg-[color:var(--color-accent)]" />
          <div className="mt-1.5 space-y-[3px]">
            <div className="h-[2px] w-full rounded-sm bg-line" />
            <div className="h-[2px] w-[88%] rounded-sm bg-line" />
            <div className="h-[2px] w-[72%] rounded-sm bg-line" />
          </div>

          {/* Section 2 */}
          <div className="mt-3 h-[2px] w-1/4 rounded-sm bg-[color:var(--color-yellow-edge)]" />
          <div className="mt-1.5 space-y-[3px]">
            <div className="h-[2px] w-full rounded-sm bg-line" />
            <div className="h-[2px] w-[80%] rounded-sm bg-line" />
            <div className="h-[2px] w-[64%] rounded-sm bg-line" />
          </div>

          {/* Section 3 */}
          <div className="mt-3 h-[2px] w-1/4 rounded-sm bg-[color:var(--color-accent)]" />
          <div className="mt-1.5 space-y-[3px]">
            <div className="h-[2px] w-[90%] rounded-sm bg-line" />
            <div className="h-[2px] w-[68%] rounded-sm bg-line" />
          </div>
        </div>
      </div>

      {/* PDF-export tag in the corner */}
      <span
        aria-hidden
        className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_4px_10px_-2px_rgba(0,0,0,0.3)]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-yellow)]" />
        PDF
      </span>
    </div>
  );
}
