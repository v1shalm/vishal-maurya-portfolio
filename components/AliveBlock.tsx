"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Pink "alive" hero block. Wraps the existing `.hero-block--pink` so the
 * infinite breathing animation can be paused via `animation-play-state`
 * once the hero leaves the viewport — saves idle GPU/battery.
 *
 * The entrance animation runs unconditionally on mount; the observer
 * only attaches after the entrance has completed, so we never pause
 * the drop-in mid-animation.
 */
export function AliveBlock({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let obs: IntersectionObserver | null = null;

    const t = setTimeout(() => {
      obs = new IntersectionObserver(
        ([entry]) => {
          el.style.animationPlayState = entry.isIntersecting
            ? "running"
            : "paused";
        },
        { threshold: 0.05 },
      );
      obs.observe(el);
    }, 1700);

    return () => {
      clearTimeout(t);
      obs?.disconnect();
    };
  }, []);

  return (
    <span ref={ref} className="hero-block hero-block--pink">
      {children}
    </span>
  );
}
