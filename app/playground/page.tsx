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
  | { kind: "swatch"; color: string; ink: string; pattern?: string };

type Experiment = {
  slug: string;
  href: string;
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
    slug: "guest-card",
    href: "/playground/guest-card",
    title: "Guest card",
    subtext:
      "A tactile thank-you card tucked behind a pill bar. Pick a color, pick a pattern, sign, and drag the card down into the bar to send. Nothing is transmitted; the finished card downloads as a PNG.",
    tags: ["Motion", "Canvas", "Drag-to-send", "SVG → PNG"],
    status: "In progress",
    preview: {
      kind: "swatch",
      color: "#FF4A05",
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
        <section className="pt-20 md:pt-28">
          <Container>
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
              Playground
            </span>
            <h1 className="mt-5 max-w-[28ch] text-balance text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.08] tracking-[-0.018em] text-ink">
              Unfinished things, kept in the open.
            </h1>
            <p className="mt-5 max-w-[56ch] text-pretty text-[17px] leading-[1.6] text-ink-soft md:text-[18px]">
              Interaction studies and drafts that aren&rsquo;t ready for the
              main site. Some become features, most don&rsquo;t. None are
              indexed.
            </p>
          </Container>
        </section>

        <section className="mt-20 md:mt-28">
          <Container>
            <div className="flex items-baseline justify-between border-b border-line pb-5">
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
  return (
    <Link
      href={exp.href}
      className="group flex flex-col"
      data-cursor="view-case-study"
    >
      <PreviewTile preview={exp.preview} title={exp.title} />

      <div className="mt-5 flex items-start justify-between gap-6 md:mt-6">
        <h3 className="text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.012em] text-ink transition-colors duration-300 group-hover:text-ink-soft">
          {exp.title}
        </h3>
        <StatusChip status={exp.status} />
      </div>

      <p className="mt-3 max-w-[54ch] text-pretty text-[14.5px] leading-[1.6] text-ink-soft md:text-[15.5px]">
        {exp.subtext}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {exp.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-line px-2.5 py-1 text-[10.5px] uppercase tracking-[0.12em] text-muted transition-colors group-hover:border-line group-hover:text-ink-soft"
          >
            {tag}
          </span>
        ))}
      </div>
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
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-bg-elevated">
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

  // Swatch preview: flat tile that echoes the actual interaction.
  return (
    <div
      className="relative aspect-[3/2] w-full overflow-hidden"
      style={{ backgroundColor: preview.color }}
    >
      {preview.pattern && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: preview.pattern,
            backgroundRepeat: "repeat",
          }}
        />
      )}
      {/* Top-edge highlight for the paper feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.14), rgba(255,255,255,0))",
        }}
      />
      {/* Label in the corner, styled like the real card */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-7 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.01]"
        style={{ color: preview.ink }}
      >
        <span className="text-[10.5px] uppercase tracking-[0.22em] opacity-80">
          Guest card
        </span>
        <span
          className="text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.15]"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontWeight: 500,
          }}
        >
          {title.toLowerCase() === "guest card"
            ? "Thank you for visiting!"
            : title}
        </span>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: Experiment["status"] }) {
  const isLive = status === "In progress";
  return (
    <span className="shrink-0 whitespace-nowrap text-[10.5px] uppercase tracking-[0.14em] text-muted">
      <span
        aria-hidden
        className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
        style={{
          backgroundColor: isLive
            ? "var(--color-accent)"
            : "var(--color-line)",
        }}
      />
      {status}
    </span>
  );
}
