"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

/**
 * Brief signature loader. Shows the name + accent dot with a loading bar,
 * then fades to reveal the page. Only on first paint, not on every route change
 * (page-transition template handles those).
 */
export function Loader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);

  useGSAP(
    () => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) {
        // Skip the loader entirely for reduced-motion users: no flash, no delay.
        setMounted(false);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => setMounted(false),
      });

      tl.fromTo(
        "[data-loader-line]",
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.9, ease: "expo.out" },
        0
      )
        .fromTo(
          "[data-loader-name]",
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.45, ease: "expo.out" },
          0.1
        )
        .fromTo(
          "[data-loader-dot]",
          { opacity: 0, scale: 0.2 },
          { opacity: 1, scale: 1, duration: 0.35, ease: "expo.out" },
          0.3
        )
        .fromTo(
          "[data-loader-meta]",
          { opacity: 0, y: 4 },
          { opacity: 1, y: 0, duration: 0.35, ease: "expo.out" },
          0.4
        )
        .to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "+=0.35"
        );
    },
    { scope: containerRef }
  );

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-bg p-6 md:p-10"
      style={{ pointerEvents: "none" }}
    >
      {/* Top-left: name + dot */}
      <div className="flex items-baseline gap-2">
        <span
          data-loader-name
          className="text-[14px] text-ink"
          style={{ opacity: 0 }}
        >
          Vishal Maurya
        </span>
        <span
          data-loader-dot
          className="inline-block h-[6px] w-[6px] translate-y-[-1px] rounded-full bg-[var(--color-accent)]"
          style={{ opacity: 0 }}
        />
      </div>

      {/* Bottom: hairline that draws across the full viewport + label */}
      <div className="flex items-end justify-between">
        <span
          data-loader-meta
          className="text-[10.5px] text-muted"
          style={{ opacity: 0 }}
        >
          Portfolio · 2026
        </span>
        <span
          data-loader-meta
          className="text-[10.5px] text-muted"
          style={{ opacity: 0 }}
        >
          Mumbai
        </span>
      </div>

      {/* Draw-in hairline at the very bottom edge */}
      <span
        aria-hidden
        data-loader-line
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-ink"
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}
