"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

type Props = {
  /** Main heading text. */
  title: ReactNode;
  /** Optional right-side meta (year, an "All" link, etc). */
  meta?: ReactNode;
  className?: string;
};

/**
 * Scroll-triggered section header used by home-page sections (Selected
 * Work, Pixels). The h2 wipes in left → right via clip-path; the right
 * meta fades up just behind it. Once shown, observer disconnects.
 */
export function SectionHeader({ title, meta, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [intersected, setIntersected] = useState(false);
  const shown = reduce || intersected;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setIntersected(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduce]);

  return (
    <div
      ref={ref}
      className={`flex items-baseline justify-between ${className}`}
    >
      <h2
        className="section-header-h2 text-balance text-[28px] font-bold tracking-tight text-ink"
        data-shown={shown}
      >
        {title}
      </h2>
      {meta && (
        <div
          className="section-header-meta text-[13px] text-muted"
          data-shown={shown}
        >
          {meta}
        </div>
      )}
    </div>
  );
}
