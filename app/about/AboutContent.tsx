"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Container } from "@/components/Container";
import { Wheel } from "@/components/draggable-scroller/Wheel";
import { StickerWord } from "@/components/StickerWord";
import { Confetti } from "@/components/Confetti";
import { play } from "@/lib/sounds";

const STRIP_PHOTOS = [
  { src: "/image1.jpg", alt: "Studio morning, Mumbai", aspect: "3/4" },
  { src: "/image2.jpg", alt: "At the desk", aspect: "4/5" },
  { src: "/image3.jpg", alt: "Out and about", aspect: "3/2" },
];

export default function AboutContent({
  unlocked = false,
}: {
  /** True on the portfolio.* subdomain. Reveals the current-employer
   *  line so it doesn't leak onto the public apex domain. */
  unlocked?: boolean;
}) {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex flex-1 flex-col pb-4 md:pb-6">
        <Container>
          <div className="max-w-[760px]">

            {/* Headline */}
            <h1 className="text-balance text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
              I&rsquo;m Vishal. I design products people actually use.
            </h1>

            {/* Intro */}
            <p className="mt-8 text-[18px] leading-[1.8] text-ink-soft">
              I started as a{" "}
              <StickerWord sticker="code">frontend developer</StickerWord>,
              building interfaces from the engineering side. I kept
              dragging conversations back to the decisions behind them.
              Why this button goes here. Why this flow loses people
              halfway through. I switched to{" "}
              <StickerWord sticker="cursor">product design</StickerWord>.
            </p>

            <p className="mt-5 text-[18px] leading-[1.8] text-ink-soft">
              2.5 years at a design studio, 0-to-1 work on client
              projects across quick commerce, healthtech, SaaS, and
              fintech.{" "}
              {unlocked ? (
                <>
                  Currently at{" "}
                  <StickerWord sticker="pineapple">
                    Pineapple Design Studio
                  </StickerWord>{" "}
                  in Mumbai.
                </>
              ) : (
                <>Based in Mumbai.</>
              )}{" "}
              I run the project from brief to ship.
            </p>

            <p className="mt-5 text-[18px] leading-[1.8] text-ink-soft">
              AI forward. I write specs and{" "}
              <StickerWord sticker="ai">build the prototype</StickerWord>{" "}
              the same afternoon. Small tools I use, flows I want to
              feel before I hand them off.
            </p>

            <p className="mt-5 text-[18px] leading-[1.8] text-ink-soft">
              When I&rsquo;m not working: losing{" "}
              <StickerWord sticker="crosshair">Valorant</StickerWord>{" "}
              matches and blaming everyone else, building playlists for
              moods that don&rsquo;t have names, watching design videos at{" "}
              <StickerWord sticker="moon">1am</StickerWord>.
            </p>

            {/* Lately */}
            <p className="mt-10 text-[18px] leading-[1.8] text-ink-soft">
              Right now:
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <BulletItem color="pink">
                Looking for senior product design roles, full-time.
              </BulletItem>
              <BulletItem color="yellow">
                Prototyping flows in Claude before I open Figma.
              </BulletItem>
              <BulletItem color="pink">
                Sketching UI ideas in{" "}
                <Link href="/pixels" className="link-accent">
                  Pixels
                </Link>
                .
              </BulletItem>
            </ul>

            {/* How I think about design — heading stays in prose column,
                wheel breaks out via negative right margin so the curve has
                room without being clipped by the 760px column. */}
            <div className="mt-16 md:mt-20">
              <h2 className="text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
                How I think about design.
              </h2>
              <p className="mt-4 text-[16px] leading-[1.7] text-muted md:text-[17px]">
                Drag, flick, or scroll to spin.
              </p>
              <div className="wheel-breakout mt-10 md:mt-14">
                <Wheel />
              </div>
            </div>

            {/* Positioning line. Contact links live in the footer, so
               this paragraph keeps the "what teams I'm a fit for"
               statement without repeating the email + socials. */}
            <p className="mt-16 text-[18px] leading-[1.8] text-ink-soft md:mt-20">
              I&rsquo;m best on consumer products built for Indian users:
              fintech, healthtech, quick commerce.
            </p>

          </div>

          {/* Photo strip — polaroid frames */}
          <div className="mt-16 md:mt-20">
            {/* py-4 gives rotated cards room so they don't get clipped */}
            <div className="no-scrollbar flex items-end gap-4 overflow-x-auto py-4 pb-8 md:gap-5">
              {STRIP_PHOTOS.map((photo, i) => {
                const tilts = [-2, 1.5, -1, 2, -1.5];
                const tilt = tilts[i % tilts.length];
                const h = photo.aspect === "3/2" ? { mobile: 120, desktop: 160 } : { mobile: 160, desktop: 210 };
                const [w, ht] = photo.aspect.split("/").map(Number);
                return (
                  <motion.div
                    key={i}
                    className="flex-none bg-white p-2.5 pb-7 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.18),0_2px_8px_-2px_rgba(0,0,0,0.10)] ring-1 ring-black/5 md:p-3 md:pb-9"
                    style={{ transformOrigin: "center bottom" }}
                    initial={false}
                    animate={{ rotate: tilt, scale: 1 }}
                    whileHover={{ rotate: 0, scale: 1.05 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div
                      className="relative overflow-hidden bg-bg-elevated"
                      style={{
                        width: `calc(${w} / ${ht} * ${h.mobile}px)`,
                        height: `${h.mobile}px`,
                      }}
                    >
                      {photo.src && (
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(max-width: 768px) 45vw, 22vw"
                          className="object-cover"
                          draggable={false}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </Container>
      </main>
      <VishalEasterEgg />
    </>
  );
}

/* ── Bullet item ── */
function BulletItem({ children, color = "pink" }: { children: React.ReactNode; color?: "pink" | "yellow" }) {
  const bg = color === "yellow" ? "var(--color-yellow)" : "var(--color-accent)";
  const ring = color === "yellow" ? "var(--color-yellow-edge)" : "var(--color-accent-ink)";
  return (
    <li className="flex items-start gap-2.5 text-[18px] leading-[1.8] text-ink-soft">
      <span
        aria-hidden
        className="mt-[0.52em] h-[7px] w-[7px] shrink-0 rounded-[2px]"
        style={{ background: bg, boxShadow: `inset 0 0 0 1px ${ring}` }}
      />
      <span>{children}</span>
    </li>
  );
}

/* ── Easter egg: type "vishal" anywhere on the about page to fire a
   shared confetti burst. ── */
function VishalEasterEgg() {
  const [runId, setRunId] = useState(0);
  const buffer = useRef("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key.length !== 1) return;
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-6);
      if (buffer.current === "vishal") {
        play("confetti");
        setRunId((n) => n + 1);
        buffer.current = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <Confetti runId={runId} />;
}
