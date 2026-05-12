"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { SignatureLetters } from "@/components/SignatureLetters";
import { Wheel } from "@/components/draggable-scroller/Wheel";
import { StickerWord } from "@/components/StickerWord";
import { links } from "@/lib/links";
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
              2+ years across quick-commerce, healthtech, fintech, and
              brand.{" "}
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
              I take projects from the first whiteboard to the dev
              handoff.
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
                Looking for full-time product design roles.
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

            {/* Open to */}
            <p className="mt-16 text-[18px] leading-[1.8] text-ink-soft md:mt-20">
              I&rsquo;m best on consumer products built for Indian users:
              fintech, healthtech, commerce. If that&rsquo;s your team,{" "}
              <a href={links.email} className="link-accent" data-cursor="email">
                say hi
              </a>
              . Also on{" "}
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="link-accent" data-cursor="external">
                LinkedIn
              </a>
              ,{" "}
              <a href={links.dribbble} target="_blank" rel="noopener noreferrer" className="link-accent" data-cursor="external">
                Dribbble
              </a>
              , or grab{" "}
              <a href={links.resume} target="_blank" rel="noopener noreferrer" className="link-accent" data-cursor="external">
                my resume
              </a>
              .
            </p>

            {/* CTA + signature */}
            <div className="mt-12 flex flex-col items-start gap-6">
              <Button variant="yellow" href={links.email} data-cursor="email">
                Let&rsquo;s Connect
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-muted">
                  Yours,
                </span>
                <SignatureLetters />
              </div>
            </div>

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
      <Footer />
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

/* ── Easter egg ── */
type ParticleKind = "foil" | "streamer" | "sparkle" | "star" | "heart" | "bolt" | "dot";
type Particle = {
  id: number; kind: ParticleKind; startX: number; size: number;
  color: string; edge: string; duration: number; delay: number;
  swayAmp: number; swayPhase: 1 | -1; drift: number; spin: number;
};

const PALETTE = [
  { color: "#fdf004", edge: "#dbd009" }, { color: "#f91ca9", edge: "#d11589" },
  { color: "#ffffff", edge: "rgba(0,0,0,0.12)" }, { color: "#0a0a0a", edge: "#000000" },
  { color: "#7cd3ff", edge: "#3aa9e0" },
];
const KIND_WEIGHTS: Array<{ kind: ParticleKind; weight: number }> = [
  { kind: "foil", weight: 35 }, { kind: "streamer", weight: 18 }, { kind: "dot", weight: 14 },
  { kind: "sparkle", weight: 12 }, { kind: "star", weight: 8 }, { kind: "heart", weight: 7 }, { kind: "bolt", weight: 6 },
];
const TOTAL_W = KIND_WEIGHTS.reduce((s, k) => s + k.weight, 0);

function pickKind(): ParticleKind {
  let r = Math.random() * TOTAL_W;
  for (const k of KIND_WEIGHTS) { r -= k.weight; if (r <= 0) return k.kind; }
  return "foil";
}

function VishalEasterEgg() {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const buffer = useRef("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key.length !== 1) return;
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-6);
      if (buffer.current === "vishal") {
        play("confetti");
        const ps = Array.from({ length: 72 }, (_, i) => {
          const p = PALETTE[Math.floor(Math.random() * PALETTE.length)];
          return {
            id: Date.now() + i, kind: pickKind(),
            startX: Math.random() * 100, size: 9 + Math.random() * 16,
            color: p.color, edge: p.edge,
            duration: 2.6 + Math.random() * 2.8, delay: Math.random() * 0.9,
            swayAmp: 28 + Math.random() * 60,
            swayPhase: (Math.random() > 0.5 ? 1 : -1) as 1 | -1,
            drift: (Math.random() - 0.5) * 180,
            spin: (240 + Math.random() * 720) * (Math.random() > 0.5 ? 1 : -1),
          };
        });
        setParticles(ps); setActive(true); buffer.current = "";
        setTimeout(() => setActive(false), 6500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {particles.map((p) => {
        const sx = p.swayAmp * p.swayPhase;
        return (
          <motion.span
            key={p.id}
            className="absolute top-[-12vh] block leading-none will-change-transform"
            style={{ left: `${p.startX}vw` }}
            initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
            animate={{ y: "115vh", x: [0, sx, -sx * 0.65, sx * 0.45, p.drift], rotate: p.spin, opacity: [0, 1, 1, 1, 0] }}
            transition={{ duration: p.duration, delay: p.delay, y: { ease: [0.4, 0, 0.7, 0.4], duration: p.duration }, x: { ease: "easeInOut", duration: p.duration }, rotate: { ease: "linear", duration: p.duration }, opacity: { times: [0, 0.05, 0.5, 0.9, 1], duration: p.duration } }}
          >
            <ConfettiShape p={p} />
          </motion.span>
        );
      })}
    </div>
  );
}

function ConfettiShape({ p }: { p: Particle }) {
  switch (p.kind) {
    case "foil": return <span className="block rounded-[2px]" style={{ width: p.size * 1.6, height: p.size * 0.7, background: p.color, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 ${p.edge}` }} />;
    case "streamer": return <span className="block rounded-full" style={{ width: 3, height: p.size * 1.8, background: `linear-gradient(180deg, ${p.color}, ${p.edge})` }} />;
    case "sparkle": return <span className="block leading-none" style={{ fontSize: p.size * 1.3, color: p.color }}>✦</span>;
    case "star": return <span className="block leading-none" style={{ fontSize: p.size * 1.4, color: p.color }}>★</span>;
    case "heart": return (
      <span aria-hidden className="relative block" style={{ width: p.size * 1.2, height: p.size * 1.05 }}>
        <span className="absolute left-0 top-0 block rounded-full" style={{ width: p.size * 0.65, height: p.size * 0.65, background: "#f91ca9" }} />
        <span className="absolute right-0 top-0 block rounded-full" style={{ width: p.size * 0.65, height: p.size * 0.65, background: "#f91ca9" }} />
        <span className="absolute left-1/2 bottom-0 block -translate-x-1/2 rotate-45 rounded-[2px]" style={{ width: p.size * 0.78, height: p.size * 0.78, background: "#f91ca9" }} />
      </span>
    );
    case "bolt": return <span className="block leading-none" style={{ fontSize: p.size * 1.3, color: "#fdf004" }}>⚡</span>;
    case "dot": return <span className="block rounded-full" style={{ width: p.size * 0.7, height: p.size * 0.7, background: p.color, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)" }} />;
  }
}
