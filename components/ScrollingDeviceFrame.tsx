"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { DeviceScrollTab } from "@/lib/works";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { play } from "@/lib/sounds";

type Props = {
  tabs: DeviceScrollTab[];
  thumbnail?: { src: string; alt?: string };
  frameAspect?: string;
};

// SSR-safe layout-effect — on the server this falls back to useEffect so
// React doesn't warn; on the client it runs synchronously before paint.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Pill-tab style: rounded-full track + a single sliding yellow pill that
// jumps to the active button's rect. Track has subtle inset depth so it
// reads as a chunky segmented control.
const ACTIVE_PILL_STYLE: React.CSSProperties = {
  background: "var(--color-yellow)",
  border: "1px solid var(--color-yellow-edge)",
  boxShadow: [
    "inset 0 1px 0 rgba(255,255,255,0.32)",
    "inset 0 -2px 4px rgba(0,0,0,0.14)",
  ].join(", "),
};

const TAB_CONTAINER_STYLE: React.CSSProperties = {
  boxShadow:
    "inset 0 1px 2px rgba(12,12,16,0.06), 0 1px 0 rgba(255,255,255,0.9)",
};

export function ScrollingDeviceFrame({
  tabs,
  thumbnail,
  frameAspect = "9 / 19.5",
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pill, setPill] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const reduceMotion = useReducedMotion();

  // Position the sliding pill to cover the active button's full rect.
  // Use offsetLeft/offsetTop (scroll-independent) so the pill stays aligned
  // when the tablist itself is horizontally scrolled on narrow viewports.
  useIsoLayoutEffect(() => {
    const measure = () => {
      const tab = tabRefs.current[active];
      if (!tab) return;
      setPill({
        x: tab.offsetLeft,
        y: tab.offsetTop,
        w: tab.offsetWidth,
        h: tab.offsetHeight,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  // When the active tab changes, bring it into view inside the horizontally
  // scrolling tablist on mobile. We scroll only the tablist (not the page)
  // so tapping a tab doesn't jolt the document vertically.
  useEffect(() => {
    const tab = tabRefs.current[active];
    const tablist = tablistRef.current;
    if (!tab || !tablist) return;
    const target =
      tab.offsetLeft - (tablist.clientWidth - tab.offsetWidth) / 2;
    const max = tablist.scrollWidth - tablist.clientWidth;
    tablist.scrollTo({
      left: Math.max(0, Math.min(max, target)),
      behavior: "smooth",
    });
  }, [active]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const total = el.scrollHeight - el.clientHeight;
    setProgress(total > 0 ? el.scrollTop / total : 0);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = 0;
    setProgress(0);
  }, [active]);

  const activeTab = tabs[active];

  return (
    <section
      aria-label="Scrollable device mockup"
      className="relative"
    >
      <div className="relative flex w-full flex-col items-center rounded-[20px] bg-bg-elevated px-5 py-10 md:rounded-[28px] md:px-10 md:py-14">
        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Device mockup views"
          className="relative flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-line bg-bg p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={TAB_CONTAINER_STYLE}
        >
          {/* Sliding yellow pill. Always-mounted, positioned by computed
              rect so it animates left/top/width/height between tabs. */}
          {pill && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 rounded-full"
              style={ACTIVE_PILL_STYLE}
              initial={false}
              animate={{
                x: pill.x,
                y: pill.y,
                width: pill.w,
                height: pill.h,
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      type: "tween",
                      duration: 0.34,
                      ease: [0.32, 0.72, 0, 1],
                    }
              }
            />
          )}

          {tabs.map((tab, i) => {
            const isActive = active === i;
            return (
              <button
                key={tab.label}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`device-scroll-panel-${i}`}
                onClick={() => {
                  if (i !== active) {
                    play("tabSwitch");
                    setActive(i);
                  }
                }}
                className="relative z-10 shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated"
              >
                <span
                  className={`transition-colors duration-200 ${
                    isActive ? "text-black" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <div
          aria-live="polite"
          className="mt-5 min-h-[1.5em] max-w-[42ch] text-center text-[14px] leading-[1.5] text-ink-soft"
        >
          {activeTab?.caption}
        </div>

        <div
          className="relative mt-6 overflow-hidden rounded-[22px] border border-line bg-bg shadow-[0_30px_60px_-30px_rgba(12,12,16,0.22)] md:mt-8"
          style={{
            aspectRatio: frameAspect,
            height: "clamp(360px, 58vh, 600px)",
          }}
        >
          <div
            ref={scrollerRef}
            id={`device-scroll-panel-${active}`}
            role="tabpanel"
            aria-label={activeTab?.label}
            data-lenis-prevent
            onScroll={handleScroll}
            className="device-frame-scroller h-full w-full overflow-y-auto overflow-x-hidden"
          >
            {activeTab?.src ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={activeTab.src}
                src={activeTab.src}
                alt={activeTab.alt ?? ""}
                loading="eager"
                decoding="async"
                draggable={false}
                className="block w-full select-none"
              />
            ) : (
              <div className="flex aspect-[9/30] w-full items-center justify-center bg-bg-elevated text-[12px] text-muted">
                Placeholder · {activeTab?.label}
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute right-1.5 top-8 bottom-8 z-20 w-[1.5px]">
            <ScrollIndicator progress={progress} tone="muted" />
          </div>
        </div>

        {thumbnail && (
          <div className="mt-5 overflow-hidden rounded-md border border-line bg-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail.src}
              alt={thumbnail.alt ?? ""}
              className="block h-[76px] w-auto md:h-[92px]"
              draggable={false}
            />
          </div>
        )}

        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.18em] text-muted md:right-6"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll to explore
        </span>
      </div>
    </section>
  );
}
