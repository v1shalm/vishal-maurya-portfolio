"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export type AboutStripItem = {
  src?: string;
  alt: string;
  /** "width/height" ratio for the tile, e.g. "3/4", "4/5", "3/2". */
  aspect: string;
};

type Props = {
  items: AboutStripItem[];
};

/**
 * Horizontal photo strip. Native scroll only — no drag, no click.
 * Wheel events anywhere on the page (not just over the strip) translate to
 * horizontal scroll on md+, where the About page is viewport-locked. On
 * mobile the page scrolls vertically normally, so wheel is left alone.
 * Trackpad + touch users already get native horizontal scroll.
 */
export function AboutStrip({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const mq = window.matchMedia("(min-width: 768px)");

    const onWheel = (e: WheelEvent) => {
      // Only hijack wheel on md+ where the page is viewport-locked.
      if (!mq.matches) return;
      // Let horizontal trackpad flicks pass through.
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      // Don't steal wheel from open overlays (CommandPalette, Lightbox).
      const target = e.target as HTMLElement | null;
      if (target?.closest('[role="dialog"]')) return;
      e.preventDefault();
      track.scrollLeft += e.deltaY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={trackRef}
      className="no-scrollbar flex h-full items-stretch gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain md:gap-5"
    >
      {items.map((item, i) => (
        <figure
          key={i}
          className="relative h-full flex-none overflow-hidden bg-bg-elevated"
          style={{ aspectRatio: item.aspect }}
        >
          {item.src ? (
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 80vw, 40vw"
              className="pointer-events-none object-cover"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-start justify-end p-4 md:p-5">
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted">
                Photo — pending
              </span>
              <span className="mt-1 text-[12.5px] leading-[1.4] text-ink-soft">
                {item.alt}
              </span>
            </div>
          )}
        </figure>
      ))}
    </div>
  );
}
