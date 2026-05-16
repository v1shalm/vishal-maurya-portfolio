"use client";

import { useEffect, useRef, useState } from "react";
import { Letters, type LettersHandle } from "@kumailnanji/letters";

/* The Letters lib draws to SVG/canvas and needs a real colour string —
   CSS variables don't resolve in SVG paint attributes — so we read the
   token at mount and fall back to the literal pink (matches the value
   of --color-pink in globals.css) for the SSR pass. */
const FALLBACK_PINK = "#f91ca9";

/**
 * Animated "Vishal" signature.
 *
 * Behaviour:
 * - Does not autoplay or loop. Draws once when it first scrolls into
 *   view via IntersectionObserver, then sits still.
 * - On hover (or focus), restarts the draw — but only if the current
 *   draw has finished. Mid-stroke hovers are ignored so the line
 *   doesn't snap back to start while it's still being written.
 */
export function SignatureLetters({ className = "" }: { className?: string }) {
  const ref = useRef<LettersHandle>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [color, setColor] = useState(FALLBACK_PINK);
  const playingRef = useRef(false);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-pink")
      .trim();
    if (resolved) setColor(resolved);
  }, []);

  // Trigger one draw the first time the signature scrolls into view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasPlayedRef.current) {
            hasPlayedRef.current = true;
            ref.current?.replay();
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function tryReplay() {
    // Block replays while a draw is mid-stroke; let the current one
    // finish, then the next pointer event can restart it.
    if (playingRef.current) return;
    ref.current?.replay();
  }

  return (
    <span
      ref={wrapRef}
      role="img"
      aria-label="Vishal signature"
      onMouseEnter={tryReplay}
      onFocus={tryReplay}
      tabIndex={0}
      className={`inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--color-pink)] ${className}`.trim()}
      style={{ lineHeight: 0 }}
    >
      <Letters
        ref={ref}
        text="Vishal"
        color={color}
        strokeWidth={2}
        onPlayingChange={(playing) => {
          playingRef.current = playing;
        }}
        className="block h-16 w-auto md:h-24"
        style={{ display: "block" }}
      />
    </span>
  );
}
