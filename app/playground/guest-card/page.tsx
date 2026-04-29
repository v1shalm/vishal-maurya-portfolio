import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Container } from "@/components/Container";
import { GuestCard } from "@/components/GuestCard";

export const metadata: Metadata = {
  title: "Guest card · Playground",
  description:
    "Tactile thank-you card interaction. Pick a color, sign, drag to send.",
  robots: { index: false, follow: false },
};

export default function GuestCardPlaygroundPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Nav />
      <main id="main-content" className="flex flex-1 flex-col">
        <section>
          <Container>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 text-[12.5px] text-muted transition-colors hover:text-ink"
            >
              Back to Playground
            </Link>
            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
              <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
                Guest card
              </h1>
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted">
                In progress
              </span>
            </div>
            <p className="mt-4 max-w-[56ch] text-pretty text-[15.5px] leading-[1.6] text-ink-soft md:text-[16.5px]">
              A tactile thank-you card tucked behind a pill bar. Tap the peek
              to open, pick a color and pattern, sign, then drag the card down
              into the bar to send. Nothing is transmitted; you can download
              the finished card as a PNG.
            </p>

            <ul className="mt-8 grid gap-1.5 text-[13.5px] text-ink-soft">
              <li>
                <span className="text-muted">Library:</span> Motion (framer-motion v12)
              </li>
              <li>
                <span className="text-muted">Drag:</span> Motion drag with
                elastic constraints + hit-test against the pill
              </li>
              <li>
                <span className="text-muted">Signature:</span> HTML canvas,
                pointer events, DPR-scaled
              </li>
              <li>
                <span className="text-muted">Output:</span> Client-side SVG to
                PNG via canvas, downloaded locally
              </li>
            </ul>
          </Container>
        </section>

        {/* Spacer so the peek lands near the bottom of the viewport */}
        <div className="flex-1" />
      </main>

      {/* Guest card renders its own peek + modal. Sits at the bottom of the
          flex column via flex-1 spacer above. */}
      <GuestCard />
    </div>
  );
}
