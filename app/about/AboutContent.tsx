"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Nav } from "@/components/Nav";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { SignatureLetters } from "@/components/SignatureLetters";
import { links } from "@/lib/links";
import { play } from "@/lib/sounds";

// Three case-study screenshots per project. Used by the hover-reveal
// fan above each inline project sticker.
const NEXUS_IMAGES = [
  "/works/nexus-247/homescreens.png",
  "/works/nexus-247/categories-plp-pdp.png",
  "/works/nexus-247/bag-coupon-tracking.png",
];
const ZILO_IMAGES = [
  "/works/zilo/homepage tall.png",
  "/works/zilo/looks tall.png",
  "/works/zilo/brands tall.png",
];
const OUTCOMES_IMAGES = [
  "/works/outcomes/a.png",
  "/works/outcomes/b.png",
  "/works/outcomes/e.png",
];

const STUDIO_PHOTOS = [
  { src: "/image1.jpg", alt: "Studio morning, Mumbai" },
  { src: "/image2.jpg", alt: "At the desk" },
  { src: "/image3.jpg", alt: "Out and about" },
];

export default function AboutContent() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col pb-20 md:pb-28">
        <Container>
          <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,380px)] md:items-start md:gap-12 lg:gap-16">
            {/* === LEFT COLUMN: all body content === */}
            <div className="flex flex-col">
              {/* Hero */}
              <div className="max-w-[640px] pb-4 md:pb-8">
                <h1 className="text-pretty text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-[1.65] tracking-[-0.012em] text-ink">
                  I&rsquo;m Vishal
                  <InlineAvatar src="/image1.jpg" alt="Vishal" />
                  . I design products that feel alive: quick-commerce at
                  Nexus 247
                  <InlineProject
                    src="/works/nexus-247.png"
                    alt="Nexus 247"
                    images={NEXUS_IMAGES}
                  />
                  and Zilo
                  <InlineProject
                    src="/works/zilo.png"
                    alt="Zilo"
                    images={ZILO_IMAGES}
                  />
                  , healthtech at OutcomesAI
                  <InlineProject
                    src="/works/outcomes/a.png"
                    alt="OutcomesAI"
                    images={OUTCOMES_IMAGES}
                  />
                  , all from Pineapple Design Studio in Mumbai. Built with
                  <InlinePill>AI</InlinePill>
                  in the loop, before Figma.
                </h1>
              </div>

              {/* What I Believe */}
              <div className="max-w-[640px] py-10 md:py-14">
                <SectionLabel color="yellow">What I Believe</SectionLabel>
                <p className="mt-6 text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-[1.2] tracking-[-0.012em] text-ink">
                  Design moves faster when you{" "}
                  <MarkerUnderline color="yellow">think</MarkerUnderline>{" "}
                  before you open Figma.
                </p>
                <p className="mt-6 text-[17px] leading-[1.65] text-ink-soft md:text-[18px]">
                  I don&rsquo;t use AI to bypass the work; I use it to
                  front-load the thinking. By stress-testing assumptions and
                  drafting problem frames early, I ensure the design phase
                  is spent on decisions that actually require a human
                  designer. My best moves usually involve{" "}
                  <MarkerUnderline color="magenta">
                    removing steps
                  </MarkerUnderline>
                  , not adding features.
                </p>
              </div>

              {/* AI-First Workflow */}
              <div className="max-w-[640px] py-10 md:py-14">
                <SectionLabel color="magenta">AI-First Workflow</SectionLabel>
                <ol className="mt-8 flex flex-col gap-4">
                  <Step
                    title="Pressure-Testing"
                    body="Using LLMs to poke holes in the initial brief and find edge cases before a single pixel is moved."
                  />
                  <Step
                    title="Logic-First Prototyping"
                    body={`Validating user flows through rapid AI-generated logic loops to see if the ‘math’ of the product checks out.`}
                  />
                  <Step
                    title="High-Fidelity Craft"
                    body={`Moving to Figma only once the direction is defended. This is where I focus on the system, the scale, and the ‘soul’ of the UI.`}
                  />
                </ol>
                <p className="mt-8 text-[18px] font-bold leading-[1.35] tracking-[-0.012em] text-ink md:text-[20px]">
                  Less time on the wrong thing. More time on the craft that
                  matters.
                </p>
              </div>

              {/* Lately */}
              <div className="max-w-[640px] py-10 md:py-14">
                <SectionLabel color="yellow">Lately</SectionLabel>
                <ul className="mt-8 flex flex-col gap-3 text-[17px] leading-[1.55] text-ink md:text-[18px]">
                  <Bullet color="pink">
                    Designing at Pineapple Design Studio
                  </Bullet>
                  <Bullet color="yellow">
                    Turning &ldquo;what if&rdquo; into &ldquo;shipped&rdquo;
                    with AI in the loop
                  </Bullet>
                  <Bullet color="pink">
                    Exploring personal UI concepts in{" "}
                    <Link href="/pixels" className="link-accent">
                      Pixels
                    </Link>
                  </Bullet>
                </ul>
              </div>

              {/* Camera Roll: photo stack inline (mobile) — desktop has the
                  sticky sidebar instead so we hide this on md+. */}
              <div className="max-w-[640px] py-10 md:hidden">
                <SectionLabel color="magenta">Camera Roll</SectionLabel>
                <div className="mt-10 flex justify-center">
                  <PhotoStack photos={STUDIO_PHOTOS} />
                </div>
              </div>

              {/* Open To + CTA + signature */}
              <div className="max-w-[640px] pt-10 md:pt-14">
                <SectionLabel color="yellow">Open To</SectionLabel>
                <p className="mt-6 text-[clamp(1.25rem,2.4vw,1.625rem)] font-bold leading-[1.3] tracking-[-0.012em] text-ink">
                  In-house product design roles, ideally consumer-facing,
                  in fintech, healthtech, or commerce, building for{" "}
                  <MarkerUnderline color="yellow">
                    Indian users
                  </MarkerUnderline>
                  .
                </p>
                <div className="mt-8">
                  <Button
                    variant="yellow"
                    href={links.email}
                    data-cursor="email"
                  >
                    Let&rsquo;s Connect
                  </Button>
                </div>

                <div className="mt-16 flex items-center gap-4 md:mt-20">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                    Yours,
                  </span>
                  <SignatureLetters />
                </div>
              </div>
            </div>

            {/* === RIGHT COLUMN: sticky polaroid sidebar (md+ only) === */}
            <aside className="hidden md:block">
              <div className="sticky top-24">
                <PhotoSidebar photos={STUDIO_PHOTOS} />
              </div>
            </aside>
          </div>
        </Container>
      </main>
      <VishalEasterEgg />
    </>
  );
}

/* ---------- Section primitives ---------- */

/**
 * Canonical section heading. Single-color halo across every word of
 * the heading (like the reference: "Don't overthink it." in pink,
 * "Live in the moment." in black). Sections alternate the colour
 * across the page so the rhythm flows yellow → magenta → yellow → …
 *
 * For multi-color-per-word treatments (like the home page's
 * "Selected Work" with yellow+magenta), wire the JSX directly —
 * that's a different rhetorical move than this component.
 */
function SectionLabel({
  children,
  color = "yellow",
}: {
  children: string;
  color?: "yellow" | "magenta";
}) {
  const words = children.split(" ");
  return (
    <h2 className="hero-y2k flex flex-wrap items-center gap-[0.3em] text-[28px] font-bold leading-[1.1] tracking-tight">
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={`y-hl y-hl--${color}`}
          data-text={word}
        >
          {word}
        </span>
      ))}
    </h2>
  );
}

function Step({ title, body }: { title: string; body: string }) {
  return (
    <li className="text-[16px] leading-[1.55] md:text-[17px]">
      <span className="font-bold text-ink">{title}.</span>{" "}
      <span className="text-ink-soft">{body}</span>
    </li>
  );
}

function Bullet({
  children,
  color = "pink",
}: {
  children: React.ReactNode;
  color?: "pink" | "yellow";
}) {
  const bg =
    color === "yellow" ? "var(--color-yellow)" : "var(--color-accent)";
  const ring =
    color === "yellow" ? "var(--color-yellow-edge)" : "var(--color-accent-ink)";
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className="mt-[0.45em] inline-block h-2.5 w-2.5 shrink-0 rounded-[3px]"
        style={{
          background: bg,
          boxShadow: `inset 0 0 0 1px ${ring}, 0 1px 2px rgba(12,12,16,0.08)`,
        }}
      />
      <span>{children}</span>
    </li>
  );
}

/* ---------- Animated marker underline ----------
   Replaces the static y-underline CSS background with an inline SVG
   whose stroke is drawn-in with motion's pathLength when the wrapper
   first scrolls into view. Matches the v3 hand-drawn feel. */

const MARKER_PATHS = {
  yellow: "M2 6 C 20 3, 35 9, 50 5 C 65 1, 80 8, 98 5",
  magenta: "M2 5 C 18 8, 32 3, 50 6 C 68 9, 82 4, 98 6",
} as const;

function MarkerUnderline({
  children,
  color = "yellow",
}: {
  children: React.ReactNode;
  color?: "yellow" | "magenta";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const stroke = color === "yellow" ? "#fdf004" : "#f91ca9";

  return (
    <span
      ref={ref}
      className="relative inline-block pb-[0.18em]"
    >
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[0.32em] w-full"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
      >
        <motion.path
          d={MARKER_PATHS[color]}
          stroke={stroke}
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? 1 : 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </span>
  );
}

/* ---------- Sticky photo sidebar ----------
   Three polaroids stacked with overlap so the whole group fits inside
   one viewport for sticky positioning. Subtle hover spreads them apart
   so the bottom photos peek out without leaving the column. */

function PhotoSidebar({
  photos,
}: {
  photos: { src: string; alt: string }[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-cycle through photos every 4.5s. Pauses while hovered or
  // when a dot is clicked (briefly, so manual nav doesn't immediately
  // get overridden by the next tick).
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 4500);
    return () => clearInterval(id);
  }, [paused, photos.length]);

  const current = photos[index];

  return (
    <div
      className="flex flex-col gap-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Polaroid carousel — one photo at a time, soft crossfade + scale
          on swap, slight resting tilt for the polaroid feel. */}
      <div className="relative aspect-[4/5] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.src}
            initial={{ opacity: 0, scale: 0.96, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            exit={{ opacity: 0, scale: 0.96, rotate: 1 }}
            transition={{
              duration: 0.55,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="absolute inset-0 overflow-hidden rounded-2xl bg-white p-3 shadow-[0_30px_60px_-18px_rgba(0,0,0,0.30),0_6px_14px_-4px_rgba(0,0,0,0.10)] ring-1 ring-black/5"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[12px]">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="380px"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination dots */}
      <div
        role="tablist"
        aria-label="Studio photo carousel"
        className="flex items-center justify-center gap-2"
      >
        {photos.map((p, i) => {
          const active = i === index;
          return (
            <button
              key={p.src}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Show photo ${i + 1}: ${p.alt}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                active ? "w-6" : "w-1.5"
              }`}
              style={{
                backgroundColor: active
                  ? "var(--color-accent)"
                  : "var(--color-line)",
              }}
            />
          );
        })}
      </div>

      {/* Caption */}
      <p className="text-center text-[12.5px] text-muted">{current.alt}</p>
    </div>
  );
}

/* ---------- Polaroid photo stack ----------
   Three photos overlaid at slight rotations. On hover, they spread
   horizontally with bigger rotations. Reuses the iOS-style tween
   easing the rest of the site uses. */

function PhotoStack({
  photos,
}: {
  photos: { src: string; alt: string }[];
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative h-[240px] w-full max-w-[440px] cursor-pointer md:h-[280px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="group"
      aria-label="Studio photos. Hover to spread."
    >
      {photos.slice(0, 3).map((p, i) => {
        const offset = i - 1; // -1, 0, 1
        return (
          <motion.div
            key={p.src}
            className="absolute left-1/2 top-1/2 h-[200px] w-[160px] overflow-hidden rounded-[12px] bg-white p-2 shadow-[0_18px_36px_-12px_rgba(0,0,0,0.32),0_4px_10px_-2px_rgba(0,0,0,0.12)] ring-1 ring-black/5 md:h-[240px] md:w-[180px]"
            initial={false}
            animate={{
              x: hovered ? offset * 170 : offset * 8,
              y: hovered && offset === 0 ? -8 : 0,
              rotate: hovered ? offset * 8 : offset * 4,
            }}
            transition={{
              type: "tween",
              duration: 0.55,
              ease: [0.32, 0.72, 0, 1],
              delay: hovered ? Math.abs(offset) * 0.05 : 0,
            }}
            style={{
              translateX: "-50%",
              translateY: "-50%",
              zIndex: offset === 0 ? 2 : 1,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[6px]">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="180px"
                className="object-cover"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------- "vishal" easter egg ----------
   Listens globally for the keystrokes spelling "vishal". On match,
   plays the success chime and rains Y2K-style confetti — a mix of
   foil rectangles, streamer ribbons, sparkles, hearts, stars, bolts,
   and dots in the brand palette. Each particle has its own size, fall
   duration, sway amplitude, rotation speed, and drift, so the rain
   feels physical (gravity + air resistance) instead of mechanical. */

type ParticleKind =
  | "foil"
  | "streamer"
  | "sparkle"
  | "star"
  | "heart"
  | "bolt"
  | "dot";

type Particle = {
  id: number;
  kind: ParticleKind;
  startX: number; // vw 0..100
  size: number; // base px size
  color: string;
  edge: string; // darker edge for ring
  duration: number;
  delay: number;
  swayAmp: number; // px
  swayPhase: 1 | -1; // first sway direction
  drift: number; // overall horizontal drift in px
  spin: number; // total rotation in deg
};

const PARTICLE_PALETTE: Array<{ color: string; edge: string }> = [
  { color: "#fdf004", edge: "#dbd009" }, // yellow
  { color: "#f91ca9", edge: "#d11589" }, // pink
  { color: "#ffffff", edge: "rgba(0,0,0,0.12)" }, // white foil
  { color: "#0a0a0a", edge: "#000000" }, // black foil
  { color: "#7cd3ff", edge: "#3aa9e0" }, // sky (small accent)
];

const KIND_WEIGHTS: Array<{ kind: ParticleKind; weight: number }> = [
  { kind: "foil", weight: 35 },
  { kind: "streamer", weight: 18 },
  { kind: "dot", weight: 14 },
  { kind: "sparkle", weight: 12 },
  { kind: "star", weight: 8 },
  { kind: "heart", weight: 7 },
  { kind: "bolt", weight: 6 },
];

const TOTAL_WEIGHT = KIND_WEIGHTS.reduce((s, k) => s + k.weight, 0);

function pickKind(): ParticleKind {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const k of KIND_WEIGHTS) {
    r -= k.weight;
    if (r <= 0) return k.kind;
  }
  return "foil";
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const palette = PARTICLE_PALETTE[
      Math.floor(Math.random() * PARTICLE_PALETTE.length)
    ];
    return {
      id: Date.now() + i,
      kind: pickKind(),
      startX: Math.random() * 100,
      size: 9 + Math.random() * 16,
      color: palette.color,
      edge: palette.edge,
      duration: 2.6 + Math.random() * 2.8,
      delay: Math.random() * 0.9,
      swayAmp: 28 + Math.random() * 60,
      swayPhase: Math.random() > 0.5 ? 1 : -1,
      drift: (Math.random() - 0.5) * 180,
      spin: (240 + Math.random() * 720) * (Math.random() > 0.5 ? 1 : -1),
    };
  });
}

function VishalEasterEgg() {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const buffer = useRef("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }
      if (e.key.length !== 1) return;
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-6);
      if (buffer.current === "vishal") {
        play("confetti");
        setParticles(generateParticles(72));
        setActive(true);
        buffer.current = "";
        setTimeout(() => setActive(false), 6500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {particles.map((p) => (
        <ConfettiPiece key={p.id} p={p} />
      ))}
    </div>
  );
}

function ConfettiPiece({ p }: { p: Particle }) {
  // Multi-keyframe sway gives the side-to-side flutter of real
  // confetti. Y axis uses an ease-in curve so falling accelerates
  // like gravity (slow at top, faster at bottom).
  const sx = p.swayAmp * p.swayPhase;
  return (
    <motion.span
      className="absolute top-[-12vh] block leading-none will-change-transform"
      style={{ left: `${p.startX}vw` }}
      initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
      animate={{
        y: "115vh",
        x: [0, sx, -sx * 0.65, sx * 0.45, p.drift],
        rotate: p.spin,
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{
        duration: p.duration,
        delay: p.delay,
        y: { ease: [0.4, 0, 0.7, 0.4], duration: p.duration }, // gravity-ish
        x: { ease: "easeInOut", duration: p.duration },
        rotate: { ease: "linear", duration: p.duration },
        opacity: { times: [0, 0.05, 0.5, 0.9, 1], duration: p.duration },
      }}
    >
      <ConfettiShape p={p} />
    </motion.span>
  );
}

function ConfettiShape({ p }: { p: Particle }) {
  switch (p.kind) {
    case "foil":
      return (
        <span
          className="block rounded-[2px]"
          style={{
            width: p.size * 1.6,
            height: p.size * 0.7,
            background: p.color,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 ${p.edge}`,
          }}
        />
      );
    case "streamer":
      return (
        <span
          className="block rounded-full"
          style={{
            width: 3,
            height: p.size * 1.8,
            background: `linear-gradient(180deg, ${p.color}, ${p.edge})`,
          }}
        />
      );
    case "sparkle":
      return (
        <span
          className="block leading-none"
          style={{ fontSize: p.size * 1.3, color: p.color }}
        >
          ✦
        </span>
      );
    case "star":
      return (
        <span
          className="block leading-none"
          style={{ fontSize: p.size * 1.4, color: p.color }}
        >
          ★
        </span>
      );
    case "heart":
      // Two stacked circles + a square = a fat pixel heart in pink.
      return (
        <span
          aria-hidden
          className="relative block"
          style={{ width: p.size * 1.2, height: p.size * 1.05 }}
        >
          <span
            className="absolute left-0 top-0 block rounded-full"
            style={{
              width: p.size * 0.65,
              height: p.size * 0.65,
              background: "#f91ca9",
            }}
          />
          <span
            className="absolute right-0 top-0 block rounded-full"
            style={{
              width: p.size * 0.65,
              height: p.size * 0.65,
              background: "#f91ca9",
            }}
          />
          <span
            className="absolute left-1/2 bottom-0 block -translate-x-1/2 rotate-45 rounded-[2px]"
            style={{
              width: p.size * 0.78,
              height: p.size * 0.78,
              background: "#f91ca9",
            }}
          />
        </span>
      );
    case "bolt":
      return (
        <span
          className="block leading-none"
          style={{ fontSize: p.size * 1.3, color: "#fdf004" }}
        >
          ⚡
        </span>
      );
    case "dot":
      return (
        <span
          className="block rounded-full"
          style={{
            width: p.size * 0.7,
            height: p.size * 0.7,
            background: p.color,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45)`,
          }}
        />
      );
  }
}

/* ---------- Inline sticker primitives ---------- */

function InlineAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative mx-[0.28em] inline-block h-[1.15em] w-[1.15em] overflow-hidden rounded-full align-middle shadow-[0_4px_10px_rgba(0,0,0,0.18)] ring-2 ring-white">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="56px"
        className="object-cover"
      />
    </span>
  );
}

function InlineProject({
  src,
  alt,
  images,
}: {
  src: string;
  alt: string;
  images: string[];
}) {
  const poses: Array<{ tilt: number; lift: number }> = [
    { tilt: -8, lift: 0 },
    { tilt: 0, lift: -10 },
    { tilt: 8, lift: 0 },
  ];

  return (
    <span className="proj-trigger relative mx-[0.28em] inline-block align-middle">
      <span
        className="relative inline-block h-[1.15em] w-[1.15em] overflow-hidden rounded-[0.22em] align-middle shadow-[0_4px_10px_rgba(0,0,0,0.18)] ring-1 ring-black/10"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="56px"
          className="object-cover object-center"
        />
      </span>

      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 flex -translate-x-1/2 items-end gap-1.5"
      >
        {images.slice(0, 3).map((src, i) => {
          const pose = poses[i] ?? poses[1];
          return (
            <span
              key={src}
              className="proj-thumb relative block h-[120px] w-[88px] origin-bottom overflow-hidden rounded-[10px] bg-white shadow-[0_18px_36px_-12px_rgba(0,0,0,0.32),0_4px_10px_-2px_rgba(0,0,0,0.12)] ring-1 ring-black/5"
              style={
                {
                  "--tilt": `${pose.tilt}deg`,
                  "--lift": `${pose.lift}px`,
                  transitionDelay: `${i * 60}ms`,
                } as React.CSSProperties
              }
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="88px"
                className="object-cover object-top"
              />
            </span>
          );
        })}
      </span>
    </span>
  );
}

function InlinePill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="mx-[0.28em] inline-flex items-center gap-[0.18em] rounded-full px-[0.55em] py-[0.12em] align-middle text-white shadow-[0_4px_10px_-2px_rgba(249,28,169,0.45)]"
      style={{
        backgroundColor: "var(--color-accent)",
        fontSize: "0.6em",
        verticalAlign: "0.06em",
      }}
    >
      <span aria-hidden className="text-[1.1em] leading-none">
        ✦
      </span>
      <span className="font-bold uppercase tracking-[0.04em] leading-none">
        {children}
      </span>
    </span>
  );
}
