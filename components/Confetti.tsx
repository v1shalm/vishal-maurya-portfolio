"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";

/**
 * Confetti burst. Pure visual layer — call `<Confetti runId={n} />`
 * and bump `runId` to fire a new burst. Internally each burst spawns
 * 72 particles in a 7-shape mix (foil flakes, streamers, sparkles,
 * stars, hearts, lightning bolts, dots) drifting from top to bottom
 * with sway, drift, and per-particle spin.
 *
 * Originally lived inline in app/about/AboutContent.tsx as the
 * "type vishal" easter egg. Now shared so the footer can also fire
 * it when the email is copied to clipboard.
 */

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
  startX: number;
  size: number;
  color: string;
  edge: string;
  duration: number;
  delay: number;
  swayAmp: number;
  swayPhase: 1 | -1;
  drift: number;
  spin: number;
};

const PALETTE = [
  { color: "#fdf004", edge: "#dbd009" },
  { color: "#f91ca9", edge: "#d11589" },
  { color: "#ffffff", edge: "rgba(0,0,0,0.12)" },
  { color: "#0a0a0a", edge: "#000000" },
  { color: "#7cd3ff", edge: "#3aa9e0" },
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

const TOTAL_W = KIND_WEIGHTS.reduce((s, k) => s + k.weight, 0);

function pickKind(): ParticleKind {
  let r = Math.random() * TOTAL_W;
  for (const k of KIND_WEIGHTS) {
    r -= k.weight;
    if (r <= 0) return k.kind;
  }
  return "foil";
}

function makeBurst(count: number, seed: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const p = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    return {
      id: seed + i,
      kind: pickKind(),
      startX: Math.random() * 100,
      size: 9 + Math.random() * 16,
      color: p.color,
      edge: p.edge,
      duration: 2.6 + Math.random() * 2.8,
      // First ~20% of particles launch with zero delay so the burst
      // reads as instant; the rest cascade over the next ~250ms.
      delay: i < count * 0.2 ? 0 : Math.random() * 0.25,
      swayAmp: 28 + Math.random() * 60,
      swayPhase: (Math.random() > 0.5 ? 1 : -1) as 1 | -1,
      drift: (Math.random() - 0.5) * 180,
      spin: (240 + Math.random() * 720) * (Math.random() > 0.5 ? 1 : -1),
    };
  });
}

export function Confetti({
  runId,
  count = 72,
  durationMs = 6500,
}: {
  /** Bump this number to fire a new burst. Starting value 0 = no burst. */
  runId: number;
  count?: number;
  durationMs?: number;
}) {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  // Portal target only after mount so SSR doesn't try to touch document.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (runId <= 0) return;
    setParticles(makeBurst(count, Date.now()));
    setActive(true);
    const t = window.setTimeout(() => setActive(false), durationMs);
    return () => window.clearTimeout(t);
  }, [runId, count, durationMs]);

  if (!active || !mounted) return null;

  // Portal to document.body so the burst escapes whatever stacking
  // context its caller lives in (the footer wrapper is fixed at z-0
  // and would otherwise paint the confetti under the white page).
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {particles.map((p) => {
        const sx = p.swayAmp * p.swayPhase;
        return (
          <motion.span
            key={p.id}
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
              y: { ease: [0.4, 0, 0.7, 0.4], duration: p.duration },
              x: { ease: "easeInOut", duration: p.duration },
              rotate: { ease: "linear", duration: p.duration },
              opacity: {
                times: [0, 0.05, 0.5, 0.9, 1],
                duration: p.duration,
              },
            }}
          >
            <ConfettiShape p={p} />
          </motion.span>
        );
      })}
    </div>,
    document.body,
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
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
          }}
        />
      );
  }
}
