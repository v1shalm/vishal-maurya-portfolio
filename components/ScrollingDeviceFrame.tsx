"use client";

import { useEffect, useRef, useState } from "react";
import type { DeviceScrollTab } from "@/lib/works";
import { ScrollIndicator } from "@/components/ScrollIndicator";

type Props = {
  tabs: DeviceScrollTab[];
  thumbnail?: { src: string; alt?: string };
  frameAspect?: string;
};

const ACTIVE_PILL_STYLE: React.CSSProperties = {
  background:
    "linear-gradient(180deg, #ff7a3c 0%, #ff4a05 55%, #e8400a 100%)",
  boxShadow: [
    "inset 0 1px 0 rgba(255,255,255,0.38)",
    "inset 0 -1px 0 rgba(0,0,0,0.14)",
    "0 1px 2px rgba(199,58,3,0.18)",
    "0 8px 16px -6px rgba(255,74,5,0.5)",
  ].join(", "),
  textShadow: "0 1px 1px rgba(0,0,0,0.14)",
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
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

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
          role="tablist"
          aria-label="Device mockup views"
          className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-line bg-bg p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={TAB_CONTAINER_STYLE}
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-controls={`device-scroll-panel-${i}`}
              onClick={() => setActive(i)}
              className={
                "relative shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-medium leading-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated md:py-1.5 " +
                (active === i ? "text-white" : "text-ink-soft hover:text-ink")
              }
              style={active === i ? ACTIVE_PILL_STYLE : undefined}
            >
              {tab.label}
            </button>
          ))}
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
          className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 text-[11px] uppercase tracking-[0.18em] text-muted md:right-6 md:inline-block"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll to explore ↓
        </span>
      </div>
    </section>
  );
}
