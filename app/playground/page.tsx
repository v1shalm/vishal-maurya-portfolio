import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Playground · Vishal Maurya",
  description: "Experiments, drafts, and in-progress interaction studies.",
  robots: { index: false, follow: false },
};

type Preview =
  | { kind: "image"; src: string; alt: string }
  | { kind: "swatch"; color: string; ink: string; pattern?: string }
  | { kind: "resume" }
  | { kind: "wheel" };

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
      "Keyboard-first résumé editor with a live A4 preview and ATS-safe PDF export. Drag to reorder, type into the canvas, swap themes. Every action plays a click. Open source on Next.js 15 and React 19.",
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
    status: "Shipped",
    preview: {
      kind: "swatch",
      color: "#f91ca9",
      ink: "#FFFFFF",
      pattern: DOT_PATTERN,
    },
  },
  {
    slug: "draggable-scroller",
    href: "/playground/draggable-scroller",
    title: "Draggable scroller",
    subtext:
      "A jog wheel for picking from a list. Shapes ride a curve, the knob tilts like a compass between rows, and the click sounds track how fast you scroll.",
    tags: ["Pointer events", "Inertia", "Spring snap", "Audio feedback"],
    status: "Shipped",
    preview: { kind: "wheel" },
  },
];

export default function PlaygroundPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex flex-1 flex-col">
        <section>
          <Container>
            <div className="max-w-[720px]">
              <h1 className="text-[clamp(3rem,9vw,5.25rem)] font-bold leading-[1.05] tracking-tight">
                <span className="hero-block hero-block--yellow">Playground</span>
              </h1>

              <p className="mt-8 max-w-[48ch] text-pretty text-[17px] font-bold leading-[1.5] text-ink md:mt-10 md:text-[20px]">
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

      {/* Three-line stack matching PixelsTile across the site:
          title, subtext, then category and status on a single meta line. */}
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

  if (preview.kind === "wheel") {
    return (
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-bg-elevated shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
        <Image
          src="/playground/Draggable-scroller.png"
          alt="Draggable scroller: a vertical jog wheel of 3D shapes spinning through design principles"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          quality={92}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  return <GuestCardPreview />;
}

/**
 * Believable UI mock for the Guest card experiment. Shows the real app
 * structure: card preview at top, color picker row, pattern picker row,
 * signature line, and a "drag to send" pill bar at the bottom that
 * hints at the gesture. No tilt, no abstract decoration: reads as a
 * compact app frame inside the tile.
 */
function GuestCardPreview() {
  const colors = [
    { hex: "#f91ca9", active: true },
    { hex: "#fdf004", active: false },
    { hex: "#26b7ff", active: false },
    { hex: "#15c95b", active: false },
    { hex: "#ff8b2e", active: false },
  ];
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-bg-elevated shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
      {/* App frame: rounded inner panel inset from the tile edge */}
      <div className="absolute inset-3 flex flex-col gap-2.5 rounded-xl bg-white p-3 shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(249,28,169,0.18)] ring-1 ring-black/5 md:inset-5 md:gap-3 md:p-4">
        {/* Card preview */}
        <div
          className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-lg p-3 md:p-4"
          style={{ background: "#f91ca9" }}
        >
          {/* Dot pattern */}
          <span
            aria-hidden
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
                "<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14'><circle cx='2' cy='2' r='1' fill='%23ffffff' opacity='0.5'/></svg>",
              )}")`,
              backgroundRepeat: "repeat",
            }}
          />
          <span className="relative text-[8px] font-bold uppercase tracking-[0.2em] text-white/80 md:text-[9px]">
            Guest card · 01
          </span>
          <span className="relative text-[clamp(0.875rem,1.7vw,1.125rem)] font-bold leading-[1.1] tracking-[-0.012em] text-white">
            Thank you
            <br />
            for visiting.
          </span>
          {/* Signature curve */}
          <svg
            aria-hidden
            className="relative h-4 w-16 md:h-5 md:w-20"
            viewBox="0 0 80 18"
            fill="none"
          >
            <path
              d="M2 13 C 10 3, 18 16, 26 9 S 46 3, 56 11 S 74 5, 78 9"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Picker rows */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {colors.map((c) => (
            <span
              key={c.hex}
              aria-hidden
              className="block h-3.5 w-3.5 shrink-0 rounded-full md:h-4 md:w-4"
              style={{
                background: c.hex,
                boxShadow: c.active
                  ? "0 0 0 2px var(--color-bg), 0 0 0 3.5px #1a1810"
                  : "0 0 0 1px rgba(0,0,0,0.08)",
              }}
            />
          ))}
          <span
            aria-hidden
            className="ml-auto h-2.5 w-12 rounded-full bg-line md:h-3 md:w-16"
          />
        </div>

        {/* Drag-to-send pill bar */}
        <div className="relative flex h-8 items-center overflow-hidden rounded-full bg-bg-elevated md:h-9">
          <span
            aria-hidden
            className="absolute left-1 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full md:h-7 md:w-7"
            style={{
              background: "#1a1810",
              boxShadow:
                "0 2px 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            <svg
              aria-hidden
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M6 2v8M3 7l3 3 3-3"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="ml-10 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted md:ml-12 md:text-[11px]">
            Drag to send
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Believable UI mock for the Résumé Builder. Two-pane editor: left
 * panel shows section list with a drag handle on the active row,
 * right panel shows a compact A4 preview with mock content bars. A
 * "PDF" pill sits top-right and a "⌘ K" chip sits bottom-left to
 * signal the keyboard-first claim. No tilt, no decorative wash.
 */
function ResumePreview() {
  const sections = [
    { label: "Header", active: false },
    { label: "Experience", active: true },
    { label: "Education", active: false },
    { label: "Skills", active: false },
  ];
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-bg-elevated shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
      {/* App frame: two columns inside an inset card */}
      <div className="absolute inset-3 flex gap-2.5 rounded-xl bg-white p-2.5 shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(219,208,9,0.22)] ring-1 ring-black/5 md:inset-5 md:gap-3 md:p-3">
        {/* Left: section list */}
        <div className="flex w-[36%] flex-col gap-1 md:gap-1.5">
          <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-muted md:text-[9px]">
            Sections
          </span>
          {sections.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-1.5 rounded-md px-1.5 py-1 md:gap-2 md:px-2 md:py-1.5"
              style={
                s.active
                  ? {
                      background: "var(--color-yellow)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.08)",
                    }
                  : undefined
              }
            >
              {/* Drag handle dots */}
              <span
                aria-hidden
                className={`flex flex-col gap-[2px] ${s.active ? "text-ink" : "text-muted"}`}
              >
                <span className="block h-[2px] w-[2px] rounded-full bg-current" />
                <span className="block h-[2px] w-[2px] rounded-full bg-current" />
                <span className="block h-[2px] w-[2px] rounded-full bg-current" />
              </span>
              <span
                className={`text-[10px] font-semibold tracking-tight md:text-[11px] ${
                  s.active ? "text-ink" : "text-ink-soft"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
          <span className="mt-auto text-[8px] font-medium uppercase tracking-[0.16em] text-muted md:text-[9px]">
            A4 · PDF
          </span>
        </div>

        {/* Right: A4 preview */}
        <div className="relative flex-1 overflow-hidden rounded-md bg-white p-2.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] md:p-3.5">
          {/* Name bar */}
          <div className="h-1.5 w-3/5 rounded-sm bg-ink md:h-2" />
          <div className="mt-1 h-1 w-2/5 rounded-sm bg-muted/60" />

          {/* Experience section header */}
          <div className="mt-2.5 flex items-center gap-1 md:mt-3">
            <span
              aria-hidden
              className="h-[6px] w-[6px] rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            <div className="h-[2px] w-1/3 rounded-sm bg-ink-soft/60" />
          </div>
          <div className="mt-1.5 space-y-[3px]">
            <div className="h-[2px] w-full rounded-sm bg-line" />
            <div className="h-[2px] w-[88%] rounded-sm bg-line" />
            <div className="h-[2px] w-[72%] rounded-sm bg-line" />
          </div>

          {/* Education section */}
          <div className="mt-2.5 flex items-center gap-1 md:mt-3">
            <span
              aria-hidden
              className="h-[6px] w-[6px] rounded-full"
              style={{ background: "var(--color-yellow-edge)" }}
            />
            <div className="h-[2px] w-1/4 rounded-sm bg-ink-soft/60" />
          </div>
          <div className="mt-1.5 space-y-[3px]">
            <div className="h-[2px] w-full rounded-sm bg-line" />
            <div className="h-[2px] w-[80%] rounded-sm bg-line" />
          </div>

          {/* Skills section */}
          <div className="mt-2.5 flex items-center gap-1 md:mt-3">
            <span
              aria-hidden
              className="h-[6px] w-[6px] rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            <div className="h-[2px] w-1/4 rounded-sm bg-ink-soft/60" />
          </div>
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

      {/* Keyboard chip bottom-left signals "keyboard-first" */}
      <span
        aria-hidden
        className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[9px] font-bold tracking-tight text-ink shadow-[0_2px_6px_-2px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.06)] md:text-[10px]"
      >
        <kbd className="font-sans tabular-nums">⌘</kbd>
        <span aria-hidden className="text-ink/40">+</span>
        <kbd className="font-sans">K</kbd>
      </span>
    </div>
  );
}

