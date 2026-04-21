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
      aria-label={`Open command menu. Shortcut: ${modKey} K`}
      aria-haspopup="dialog"
      aria-keyshortcuts="Meta+K Control+K"
      className="group fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 select-none rounded-full transition-[scale] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.96]"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translate(-50%, ${visible ? "0" : "8px"})`,
        transition:
          "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/*
        Nested corner-radius formula: inner_radius + padding = outer_radius.
        Outer is pill (rounded-full). With uniform p-1.5 (6px), the inner chip
        is inset 6px on every side; giving the inner chip rounded-full makes
        its ends into semicircles of half its height, which ends up equal to
        (outer_radius - 6px) and reads concentric.
      */}
      <span
        className="flex items-center gap-2 rounded-full p-1.5 pl-3 transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[1px] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(0,0,0,0.14),0_1px_2px_rgba(199,58,3,0.2),0_14px_28px_-10px_rgba(255,74,5,0.6)]"
        style={{
          background:
            "linear-gradient(180deg, #ff7a3c 0%, #ff4a05 55%, #e8400a 100%)",
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.38)",
            "inset 0 -1px 0 rgba(0,0,0,0.14)",
            "0 1px 2px rgba(199,58,3,0.18)",
            "0 10px 22px -8px rgba(255,74,5,0.5)",
          ].join(", "),
        }}
      >
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-[6px] w-[6px] rounded-full bg-white"
            style={{
              boxShadow: "0 0 0 1px rgba(255,255,255,0.35)",
            }}
          />
          <span
            className="text-[12.5px] font-medium text-white"
            style={{ textShadow: "0 1px 1px rgba(0,0,0,0.14)" }}
          >
            Menu
          </span>
        </span>
        <span
          className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5"
          style={{
            boxShadow:
              "inset 0 -1px 0 rgba(12,12,16,0.06), 0 1px 1px rgba(12,12,16,0.08)",
          }}
        >
          <kbd className="text-[10.5px] tabular-nums text-ink">{modKey}</kbd>
          <kbd className="text-[10.5px] font-medium text-ink">K</kbd>
        </span>
      </span>
    </button>
  );
}
