"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

type StickerKind = "code" | "cursor" | "pineapple" | "crosshair" | "moon";

const TILTS: Record<StickerKind, number> = {
  code: -7,
  cursor: 6,
  pineapple: -5,
  crosshair: 8,
  moon: -6,
};

const CHIP_COLOR: Record<StickerKind, "yellow" | "pink"> = {
  code: "yellow",
  cursor: "pink",
  pineapple: "yellow",
  crosshair: "yellow",
  moon: "pink",
};

export function StickerWord({
  children,
  sticker,
}: {
  children: ReactNode;
  sticker: StickerKind;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [open]);

  const tilt = TILTS[sticker];
  const tone = CHIP_COLOR[sticker];

  const chipBg =
    tone === "yellow" ? "var(--color-yellow)" : "var(--color-accent)";
  const chipEdge =
    tone === "yellow"
      ? "var(--color-yellow-edge)"
      : "var(--color-accent-ink)";

  return (
    <span
      ref={ref}
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
    >
      <span
        className="relative inline cursor-pointer rounded-[4px] font-bold text-ink"
        style={{
          background: chipBg,
          padding: "0.5px 4px",
          margin: "0 -1px",
          boxShadow: `0 0 0 1px ${chipEdge}, inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.10), 0 1.5px 3px -1.5px rgba(0,0,0,0.18)`,
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
        }}
      >
        {children}
      </span>

      <AnimatePresence>
        {open && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -top-3 left-1/2 z-30 block"
            style={{ transform: "translate(-50%, -100%)" }}
            initial={{ opacity: 0, y: 10, scale: 0.65, rotate: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: tilt }}
            exit={{ opacity: 0, y: 6, scale: 0.85, rotate: 0 }}
            transition={{
              duration: 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Sticker kind={sticker} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function Sticker({ kind }: { kind: StickerKind }) {
  switch (kind) {
    case "code":
      return <CodeSticker />;
    case "cursor":
      return <CursorSticker />;
    case "pineapple":
      return <PineappleSticker />;
    case "crosshair":
      return <CrosshairSticker />;
    case "moon":
      return <MoonSticker />;
  }
}

const DROP_SHADOW =
  "drop-shadow(0 8px 14px rgba(0,0,0,0.25)) drop-shadow(0 2px 4px rgba(0,0,0,0.18))";

const RING_PADDING = 4;

function StickerFrame({
  size,
  children,
  shape = "circle",
}: {
  size: number;
  children: ReactNode;
  shape?: "circle" | "rounded";
}) {
  const radius = shape === "circle" ? "9999px" : "14px";
  return (
    <span
      className="relative inline-block"
      style={{
        width: size + RING_PADDING * 2,
        height: size + RING_PADDING * 2,
        background: "#ffffff",
        borderRadius: radius,
        padding: RING_PADDING,
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 0 rgba(0,0,0,0.08)",
        filter: DROP_SHADOW,
      }}
    >
      <span
        className="relative block overflow-hidden"
        style={{ width: size, height: size, borderRadius: radius }}
      >
        {children}
      </span>
    </span>
  );
}

function CodeSticker() {
  const size = 60;
  return (
    <StickerFrame size={size} shape="rounded">
      <span
        className="absolute inset-0 flex flex-col"
        style={{
          background:
            "linear-gradient(180deg, var(--color-yellow) 0%, #efd900 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -2px 0 rgba(0,0,0,0.10)",
        }}
      >
        {/* Title bar */}
        <span
          className="flex items-center gap-[3px] px-[6px]"
          style={{
            height: 12,
            background: "rgba(0,0,0,0.06)",
            borderBottom: "1px solid rgba(0,0,0,0.10)",
          }}
        >
          <span
            className="block rounded-full"
            style={{ width: 4, height: 4, background: "#ff5f56" }}
          />
          <span
            className="block rounded-full"
            style={{ width: 4, height: 4, background: "#ffbd2e" }}
          />
          <span
            className="block rounded-full"
            style={{ width: 4, height: 4, background: "#28c840" }}
          />
        </span>
        {/* Code glyph */}
        <span className="relative flex flex-1 items-center justify-center">
          <span
            className="font-mono font-black leading-none text-ink"
            style={{ fontSize: 22, letterSpacing: "-0.04em" }}
          >
            &lt;/&gt;
          </span>
        </span>
      </span>
    </StickerFrame>
  );
}

function CursorSticker() {
  const size = 56;
  return (
    <StickerFrame size={size}>
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, #ff5cc1 0%, var(--color-accent) 55%, #d11589 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -2px 4px rgba(0,0,0,0.15)",
        }}
      />
      {/* Frame outline (Figma-style) */}
      <svg
        className="absolute"
        style={{ left: 8, top: 8 }}
        width="24"
        height="20"
        viewBox="0 0 24 20"
        fill="none"
      >
        <rect
          x="1"
          y="1"
          width="22"
          height="18"
          rx="2"
          stroke="#0a0a0a"
          strokeWidth="1.5"
          fill="rgba(255,255,255,0.18)"
        />
        <line x1="6" y1="1" x2="6" y2="19" stroke="#0a0a0a" strokeWidth="1" opacity="0.4" />
        <line x1="1" y1="6" x2="23" y2="6" stroke="#0a0a0a" strokeWidth="1" opacity="0.4" />
      </svg>
      {/* Cursor on top */}
      <svg
        className="absolute"
        style={{ right: 6, bottom: 6 }}
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M3 2L18 10L11 11.5L8.5 18L3 2Z"
          fill="#ffffff"
          stroke="#0a0a0a"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </StickerFrame>
  );
}

function PineappleSticker() {
  const size = 60;
  return (
    <StickerFrame size={size}>
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #fff7a8 0%, #fff196 35%, #ffe85c 100%)",
        }}
      />
      <svg
        className="absolute"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        width="44"
        height="56"
        viewBox="0 0 44 56"
        fill="none"
      >
        {/* Crown leaves (back layer) */}
        <path
          d="M22 4L16 16L13 11L11 17L7 14L10 20L22 22L34 20L37 14L33 17L31 11L28 16L22 4Z"
          fill="#5fb851"
          stroke="#0a0a0a"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Crown leaves (front highlight) */}
        <path
          d="M22 6L19 14L22 12L25 14L22 6Z"
          fill="#7bd06a"
        />
        {/* Body */}
        <ellipse
          cx="22"
          cy="36"
          rx="14"
          ry="17"
          fill="var(--color-yellow)"
          stroke="#0a0a0a"
          strokeWidth="1.4"
        />
        {/* Diamond pattern */}
        <g stroke="#0a0a0a" strokeWidth="0.9" strokeLinecap="round" opacity="0.55" fill="none">
          <path d="M14 28L22 33L30 28" />
          <path d="M12 35L22 41L32 35" />
          <path d="M14 43L22 49L30 43" />
          <path d="M14 28L14 43" />
          <path d="M22 33L22 49" />
          <path d="M30 28L30 43" />
        </g>
        {/* Highlight */}
        <ellipse cx="16" cy="30" rx="3" ry="4.5" fill="rgba(255,255,255,0.55)" />
      </svg>
    </StickerFrame>
  );
}

function CrosshairSticker() {
  const size = 56;
  return (
    <StickerFrame size={size}>
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, #2a2a2e 0%, #0a0a0a 70%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -2px 4px rgba(0,0,0,0.4)",
        }}
      />
      <svg
        className="absolute"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
      >
        {/* Outer ring */}
        <circle cx="19" cy="19" r="14" stroke="var(--color-yellow)" strokeWidth="1.5" opacity="0.4" />
        {/* Inner ring */}
        <circle cx="19" cy="19" r="9" stroke="var(--color-yellow)" strokeWidth="1.8" />
        {/* Tick marks */}
        <path
          d="M19 1V8M19 30V37M1 19H8M30 19H37"
          stroke="var(--color-yellow)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx="19" cy="19" r="2" fill="var(--color-yellow)" />
        <circle cx="19" cy="19" r="0.8" fill="#0a0a0a" />
      </svg>
    </StickerFrame>
  );
}

function MoonSticker() {
  const size = 56;
  return (
    <StickerFrame size={size}>
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, #2a1a4a 0%, #1a0f3a 60%, #0d0824 100%)",
        }}
      />
      {/* Stars */}
      <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 56 56" fill="none">
        <circle cx="10" cy="12" r="0.8" fill="#ffffff" opacity="0.9" />
        <circle cx="46" cy="18" r="0.6" fill="#ffffff" opacity="0.7" />
        <circle cx="44" cy="44" r="0.9" fill="#ffffff" opacity="0.85" />
        <circle cx="14" cy="42" r="0.5" fill="#ffffff" opacity="0.6" />
        <circle cx="38" cy="8" r="0.4" fill="#ffffff" opacity="0.5" />
      </svg>
      {/* Moon */}
      <svg
        className="absolute"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
      >
        <path
          d="M27 22C25.3 23.7 23 24.5 20.5 24.5C15 24.5 10.5 20 10.5 14.5C10.5 12 11.3 9.7 13 8C8.5 9.5 5 14 5 19.2C5 25.4 10 30.5 16.3 30.5C21.5 30.5 26 27 27 22Z"
          fill="var(--color-yellow)"
          stroke="#0a0a0a"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        {/* Crater */}
        <circle cx="20" cy="26" r="1.2" fill="#0a0a0a" opacity="0.25" />
        <circle cx="15" cy="22" r="0.8" fill="#0a0a0a" opacity="0.2" />
      </svg>
    </StickerFrame>
  );
}
