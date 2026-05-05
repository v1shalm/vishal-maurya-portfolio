"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

const digits = ["4", "0", "4"] as const;

const restingTilts = [-1.5, 0, 3.2];

const ENTER_MS = 720;
const STAGGER_MS = 110;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function NotFoundDigits() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setMounted(true);
      return;
    }
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [reducedMotion]);

  return (
    <span
      aria-hidden
      className="inline-flex items-baseline gap-[0.02em] select-none font-medium leading-[0.82] tracking-[-0.055em]"
      style={{
        fontSize: "clamp(9rem, 18vw, 16rem)",
        color: "var(--color-line)",
      }}
    >
      {digits.map((d, i) => {
        const targetRotate = reducedMotion ? 0 : restingTilts[i];
        const style: React.CSSProperties = reducedMotion
          ? {}
          : {
              display: "inline-block",
              transformOrigin: "50% 70%",
              opacity: mounted ? 1 : 0,
              transform: mounted
                ? `translate3d(0, 0, 0) rotate(${targetRotate}deg)`
                : "translate3d(0, 28px, 0) rotate(-6deg)",
              transition: `opacity ${ENTER_MS}ms ${EASE} ${i * STAGGER_MS}ms, transform ${ENTER_MS}ms ${EASE} ${i * STAGGER_MS}ms`,
              willChange: mounted ? "auto" : "opacity, transform",
            };
        return (
          <span key={i} style={style}>
            {d}
          </span>
        );
      })}
    </span>
  );
}

export function GotAwayBlock() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setMounted(true);
      return;
    }
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [reducedMotion]);

  const style: React.CSSProperties = reducedMotion
    ? {}
    : {
        display: "inline-block",
        transformOrigin: "0% 100%",
        transform: mounted
          ? "translate3d(0, 0, 0) rotate(0deg)"
          : "translate3d(-6px, 0, 0) rotate(-2.5deg)",
        opacity: mounted ? 1 : 0,
        transition: `opacity 620ms ${EASE} 280ms, transform 760ms ${EASE} 280ms`,
        willChange: mounted ? "auto" : "opacity, transform",
      };

  return (
    <span className="hero-block hero-block--magenta" style={style}>
      got away.
    </span>
  );
}
