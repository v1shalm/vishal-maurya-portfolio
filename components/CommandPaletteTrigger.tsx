"use client";

import { useEffect, useState } from "react";
import { useIsApplePlatform, useMediaQuery } from "@/lib/useMediaQuery";

type Variant = "yellow" | "chrome";

/**
 * Fixed bottom-center pill that signals the ⌘K palette exists.
 * Click dispatches a custom event that the CommandPalette listens for.
 * Hidden on touch-only devices (where ⌘K doesn't apply).
 *
 * Two visual variants: solid yellow (default) and Y2K chrome.
 * Toggle via ?cmd=yellow or ?cmd=chrome on any URL.
 */
export function CommandPaletteTrigger() {
  const hoverable = useMediaQuery("(hover: hover) and (pointer: fine)");
  const isMac = useIsApplePlatform();
  const modKey = isMac ? "⌘" : "Ctrl";
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<Variant>("yellow");

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    const params = new URLSearchParams(window.location.search);
    const v = params.get("cmd");
    if (v === "chrome" || v === "yellow") setVariant(v);
    return () => clearTimeout(t);
  }, []);

  const openPalette = () => {
    window.dispatchEvent(new Event("command-palette:toggle"));
  };

  if (!hoverable) return null;

  // Halo color matches each variant: yellow drops a yellow shadow,
  // chrome keeps the existing pink halo for brand continuity.
  const halo =
    variant === "chrome"
      ? "drop-shadow-[0_4px_12px_rgba(249,28,169,0.15)] hover:drop-shadow-[0_6px_16px_rgba(249,28,169,0.25)]"
      : "drop-shadow-[0_4px_12px_rgba(219,208,9,0.20)] hover:drop-shadow-[0_6px_18px_rgba(219,208,9,0.40)]";

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label={`Open command menu. Shortcut: ${modKey} K`}
      aria-haspopup="dialog"
      aria-keyshortcuts="Meta+K Control+K"
      className={`group fixed bottom-6 left-1/2 z-[80] select-none transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.96] ${halo}`}
      style={{
        opacity: visible ? 1 : 0,
        translate: `-50% ${visible ? "0" : "8px"}`,
        transition:
          "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), translate 600ms cubic-bezier(0.16, 1, 0.3, 1), filter 300ms ease-out",
      }}
    >
      {variant === "yellow" ? <YellowFace modKey={modKey} /> : <ChromeFace modKey={modKey} />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant A: Solid yellow pill, darker-yellow inset kbd chip        */
/* ------------------------------------------------------------------ */

function YellowFace({ modKey }: { modKey: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full py-1.5 pl-5 pr-1.5"
      style={{
        backgroundColor: "var(--color-yellow)",
        border: "1px solid var(--color-yellow-edge)",
        // Soft 3D pill: bright highlight along the top rim, gentle shadow
        // pooling at the bottom-inside. Reads as a chunky chiclet, not flat.
        boxShadow: [
          "inset 0 1.5px 0 rgba(255, 255, 255, 0.55)",
          "inset 0 -3px 6px rgba(0, 0, 0, 0.14)",
        ].join(", "),
      }}
    >
      <span className="mr-3 text-[15px] font-bold tracking-tight text-ink">
        Menu
      </span>
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 leading-none text-ink"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          fontWeight: 600,
          // Stays in the yellow family, just a touch deeper than the pill so
          // the recess reads as depth rather than a different colour patch.
          backgroundImage:
            "linear-gradient(180deg, #d4c308 0%, #dfd008 100%)",
          // Pronounced top inset + faint bottom highlight = the chip sits
          // inside the surface, not on top of it.
          boxShadow: [
            "inset 0 2px 3px rgba(0, 0, 0, 0.22)",
            "inset 0 -0.5px 0 rgba(255, 255, 255, 0.32)",
          ].join(", "),
        }}
      >
        <kbd className="tabular-nums">{modKey}</kbd>
        <span aria-hidden style={{ opacity: 0.55 }}>
          +
        </span>
        <kbd>K</kbd>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant B: Y2K chrome — silver gradient with hot-pink kbd chip    */
/* ------------------------------------------------------------------ */

function ChromeFace({ modKey }: { modKey: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full pl-4 pr-1.5 py-2 text-[14px] font-bold tracking-tight text-ink"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #f4f4f6 38%, #d4d4d9 64%, #b9b9c0 100%)",
        border: "1px solid rgba(0,0,0,0.18)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      <span>Menu</span>
      <span
        className="ml-1.5 flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-bold leading-none text-white"
        style={{
          backgroundColor: "var(--color-accent)",
          boxShadow:
            "inset 0 2px 4px rgba(0,0,0,0.32), inset 0 0.5px 0 rgba(0,0,0,0.25), inset 0 -1px 0 rgba(255,255,255,0.32)",
        }}
      >
        <kbd className="tabular-nums">{modKey}</kbd>
        <span aria-hidden className="font-medium text-white/65">+</span>
        <kbd>K</kbd>
      </span>
    </span>
  );
}
