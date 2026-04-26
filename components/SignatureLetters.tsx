"use client";

import { useEffect, useRef, useState } from "react";
import { Letters, type LettersHandle } from "@kumailnanji/letters";

/* The Letters lib draws to SVG/canvas and needs a real colour string —
   CSS variables don't resolve in SVG paint attributes — so we read the
   token at mount and fall back to the literal pink (matches the value
   of --color-pink in globals.css) for the SSR pass. */
const FALLBACK_PINK = "#f91ca9";

export function SignatureLetters({ className = "" }: { className?: string }) {
  const ref = useRef<LettersHandle>(null);
  const [color, setColor] = useState(FALLBACK_PINK);

  useEffect(() => {
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-pink")
      .trim();
    if (resolved) setColor(resolved);
  }, []);

  return (
    <span
      role="img"
      aria-label="Vishal signature"
      onMouseEnter={() => ref.current?.replay()}
      onFocus={() => ref.current?.replay()}
      tabIndex={0}
      className={`inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--color-pink)] ${className}`.trim()}
      style={{ lineHeight: 0 }}
    >
      <Letters
        ref={ref}
        text="Vishal"
        color={color}
        strokeWidth={2}
        autoPlay
        loop
        loopPauseMs={1200}
        className="block h-16 w-auto md:h-24"
        style={{ display: "block" }}
      />
    </span>
  );
}
