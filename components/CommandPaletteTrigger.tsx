"use client";

import { useEffect, useState } from "react";

/**
 * Fixed bottom-center pill that signals the ⌘K palette exists.
 * Click dispatches a custom event that the CommandPalette listens for.
 * Hidden on touch-only devices (where ⌘K doesn't apply).
 * Fades in shortly after page-load so it doesn't fight with the loader.
 */
export function CommandPaletteTrigger() {
  const [visible, setVisible] = useState(false);
  const [hoverable, setHoverable] = useState(false);
  const [modKey, setModKey] = useState("⌘");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect hover-capable device (skip on touch)
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHoverable(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setHoverable(e.matches);
    mq.addEventListener?.("change", onChange);

    // Mac vs Windows/Linux label
    const isMac = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
    setModKey(isMac ? "⌘" : "Ctrl");

    // Fade in after the loader settles
    const t = setTimeout(() => setVisible(true), 1800);

    return () => {
      mq.removeEventListener?.("change", onChange);
      clearTimeout(t);
    };
  }, []);

  const openPalette = () => {
    window.dispatchEvent(new Event("command-palette:toggle"));
  };

  if (!hoverable) return null;

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Open command palette"
      aria-keyshortcuts="Meta+K Control+K"
      className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 select-none"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translate(-50%, ${visible ? "0" : "8px"})`,
        transition:
          "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <span className="group flex items-center gap-2 rounded-full border border-line-soft bg-bg/85 py-1.5 pl-3 pr-1.5 shadow-[0_1px_0_rgba(0,0,0,0.015),0_8px_24px_-12px_rgba(20,15,10,0.12)] backdrop-blur-md transition-colors hover:border-line">
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-[6px] w-[6px] rounded-full"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
          <span className="text-[11.5px] uppercase tracking-[0.14em] text-ink-soft transition-colors group-hover:text-ink">
            Menu
          </span>
        </span>
        <span className="flex items-center gap-1 rounded-full border border-line-soft bg-bg-elevated px-2 py-1">
          <kbd className="text-[10.5px] tabular-nums text-ink-soft">
            {modKey}
          </kbd>
          <kbd className="text-[10.5px] font-medium uppercase tracking-[0.04em] text-ink-soft">
            K
          </kbd>
        </span>
      </span>
    </button>
  );
}
