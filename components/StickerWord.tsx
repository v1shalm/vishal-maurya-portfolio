"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Shared hover/tap interaction. On mouse devices it tracks pointer
 * enter/leave. On touch devices, tap toggles "hover" on/off so the
 * animation can play (since :hover doesn't fire reliably on touch).
 * Tap outside the chip clears it.
 */
function useChipInteraction() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active) return;
    const onDoc = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setActive(false);
      }
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [active]);

  const handlers = {
    onMouseEnter: () => setActive(true),
    onMouseLeave: () => setActive(false),
    onClick: (e: React.MouseEvent) => {
      // Tap-to-toggle for touch. Mouse already handled by enter/leave;
      // this only meaningfully fires on touch where there's no enter/leave.
      e.stopPropagation();
      setActive((v) => !v);
    },
  };

  return { active, ref, handlers };
}

/** Hook to detect prefers-reduced-motion */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Inline chunky chip — Ditto-style annotated highlight.
 *
 * Each chip is always visible as a chunky color block within the prose.
 * Hover triggers a chip-specific animation (no separate popup sticker).
 * The 5 sticker keys map to 5 chip variants:
 *   code      → gray "{{ }}" code chip with blinking caret on hover
 *   cursor    → yellow uppercase chip, triple-stack on hover  ✦
 *   pineapple → blue chunky chip, confident scale-up on hover
 *   crosshair → black chip with white text, RGB glitch on hover
 *   moon      → purple chip, word-shuffle on hover
 */

type StickerKind =
  | "code"
  | "cursor"
  | "pineapple"
  | "crosshair"
  | "moon"
  | "ai";

export function StickerWord({
  children,
  sticker,
}: {
  children: ReactNode;
  sticker: StickerKind;
}) {
  const chip = (() => {
    switch (sticker) {
      case "code":
        return <CodeChip>{children}</CodeChip>;
      case "cursor":
        return <StackChip>{children}</StackChip>;
      case "pineapple":
        return <PoppyChip>{children}</PoppyChip>;
      case "crosshair":
        return <GlitchChip>{children}</GlitchChip>;
      case "moon":
        return <ShuffleChip>{children}</ShuffleChip>;
      case "ai":
        return <ClaudeChip>{children}</ClaudeChip>;
    }
  })();

  // Consistent breathing room around every chip so they don't crash
  // into surrounding punctuation/words. Applied once at the root so
  // each chip variant picks it up automatically.
  return (
    <span style={{ display: "inline-block", margin: "0 0.18em" }}>
      {chip}
    </span>
  );
}

/* ── 1. Code chip — {{ }} braces, blinking caret on hover ─────── */

/* Code chip — chunky electric-indigo block in our family style.
   Body: deep indigo with hairline edge + inset highlight.
   Mark: </> angle brackets on the left as the "code" signifier.
   Hover: brackets re-type left-to-right (snap in one char at a time)
   like text being written. */

const CODE_INDIGO = "#3a3aff";
const CODE_INDIGO_DEEP = "#2a2dd6";

function CodeChip({ children }: { children: ReactNode }) {
  const { active: hover, ref, handlers } = useChipInteraction();
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(3); // 0..3, how many chars revealed

  // On hover, re-type the brackets one by one
  useEffect(() => {
    if (!hover) {
      setStep(3);
      return;
    }
    if (reducedMotion) {
      setStep(3);
      return;
    }
    setStep(0);
    const timers = [80, 160, 240].map((delay, i) =>
      window.setTimeout(() => setStep(i + 1), delay)
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [hover, reducedMotion]);

  return (
    <span
      ref={ref}
      {...handlers}
      className="relative inline-flex items-center font-bold"
      style={{
        background: CODE_INDIGO,
        color: "#ffffff",
        padding: "0.05em 0.55em 0.05em 0.45em",
        borderRadius: 3,
        boxShadow: `0 0 0 1px ${CODE_INDIGO_DEEP}, inset 0 1px 0 rgba(255,255,255,0.22), 0 1px 2px rgba(58,58,255,0.20)`,
        verticalAlign: "baseline",
        fontSize: "max(14px, 0.92em)",
        whiteSpace: "nowrap",
        gap: "0.4em",
        letterSpacing: "0.005em",
        cursor: "pointer",
      }}
    >
      {/* </> mark — three characters that "type in" on hover */}
      <span
        aria-hidden
        className="font-mono"
        style={{
          color: "rgba(255,255,255,0.85)",
          fontWeight: 700,
          fontSize: "0.85em",
          letterSpacing: "-0.04em",
          fontVariantLigatures: "none",
          // Stable width so chars don't reflow when revealed
          minWidth: "2.4ch",
          display: "inline-block",
          textAlign: "left",
        }}
      >
        <span style={{ opacity: step >= 1 ? 1 : 0, transition: "opacity 60ms" }}>{"<"}</span>
        <span style={{ opacity: step >= 2 ? 1 : 0, transition: "opacity 60ms" }}>{"/"}</span>
        <span style={{ opacity: step >= 3 ? 1 : 0, transition: "opacity 60ms" }}>{">"}</span>
      </span>

      <span>{children}</span>
    </span>
  );
}

/* ── 2. Selection chip — white fill, Figma-style selection frame
       with corner handles + dimension label on hover ────────── */

const SELECTION_BLUE = "#0c8ce9";

function StackChip({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  // Measure once on mount so the dimension label reflects the real chip size.
  // Re-measure on resize so the label stays accurate at any viewport.
  useEffect(() => {
    if (!wrapRef.current) return;
    const measure = () => {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      setDims({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children]);

  const handleSize = 6;

  return (
    <span
      ref={wrapRef}
      className="relative inline-block font-semibold"
      style={{
        background: "#ffffff",
        color: "var(--color-ink)",
        padding: "0.05em 0.4em",
        borderRadius: 2,
        boxShadow: `0 0 0 1.5px ${SELECTION_BLUE}`,
        verticalAlign: "baseline",
        fontSize: "max(15px, 0.95em)",
        whiteSpace: "nowrap",
        // Reserve a hair of space below for the dimension label so the
        // next line of prose never collides with it.
        marginBottom: "0.6em",
      }}
    >
      {children}

      {/* Four corner handles (always visible) */}
      {(["tl", "tr", "bl", "br"] as const).map((corner) => {
        const pos: Record<string, React.CSSProperties> = {
          tl: { top: -handleSize / 2, left: -handleSize / 2 },
          tr: { top: -handleSize / 2, right: -handleSize / 2 },
          bl: { bottom: -handleSize / 2, left: -handleSize / 2 },
          br: { bottom: -handleSize / 2, right: -handleSize / 2 },
        };
        return (
          <span
            key={corner}
            aria-hidden
            className="absolute"
            style={{
              ...pos[corner],
              width: handleSize,
              height: handleSize,
              background: "#ffffff",
              boxShadow: `0 0 0 1.5px ${SELECTION_BLUE}`,
              borderRadius: 1,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Dimension label below the chip (always visible) */}
      <span
        aria-hidden
        className="absolute font-mono font-medium"
        style={{
          top: "calc(100% + 6px)",
          left: "50%",
          transform: "translate(-50%, 0)",
          padding: "1px 5px",
          background: SELECTION_BLUE,
          color: "#ffffff",
          fontSize: 10,
          lineHeight: "14px",
          letterSpacing: "0.01em",
          borderRadius: 2,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {dims ? `${dims.w}×${dims.h}` : ""}
      </span>
    </span>
  );
}

/* ── 3. Pineapple sticker chip — chunky yellow with pineapple
       diamond cross-hatch texture. On hover, a dramatic diagonal
       peel sweeps across the chip, revealing a gold underside across
       most of the block. */

const PINEAPPLE_TEXTURE = `
  linear-gradient(45deg, transparent 46%, rgba(0,0,0,0.10) 47%, rgba(0,0,0,0.10) 53%, transparent 54%),
  linear-gradient(-45deg, transparent 46%, rgba(0,0,0,0.10) 47%, rgba(0,0,0,0.10) 53%, transparent 54%),
  radial-gradient(circle at 50% 50%, rgba(0,0,0,0.18) 0.8px, transparent 1.4px)
`;
const PINEAPPLE_TEXTURE_SIZE = "10px 10px, 10px 10px, 10px 10px";

function PoppyChip({ children }: { children: ReactNode }) {
  const { active: hover, ref, handlers } = useChipInteraction();

  // Dramatic peel: covers the full top-right diagonal of the block.
  // At rest, a small corner peel hints at the sticker.
  // On hover, the peel sweeps across the entire chip.
  const restClip =
    "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)";
  const peelClip =
    "polygon(0 0, 30% 0, 0 80%, 0 100%, 0 100%)";

  return (
    <span
      ref={ref}
      {...handlers}
      className="relative inline-block font-bold"
      style={{
        verticalAlign: "baseline",
        fontSize: "max(14px, 0.92em)",
        padding: "0 2px 0 0",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      {/* Underside layer — pineapple crown leaf texture exposed by the peel.
         Built from layered conic + linear gradients to fake spiky leaf
         shapes with two-tone shading. */}
      <span
        aria-hidden
        className="absolute inset-0 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #6cc25c 0%, #3d8e34 70%, #2a6824 100%)",
          borderRadius: 3,
          boxShadow: hover
            ? "inset 2px -2px 6px rgba(0,0,0,0.22), 0 6px 14px -4px rgba(0,0,0,0.28)"
            : "inset 1px -1px 2px rgba(0,0,0,0.12), 0 2px 5px -2px rgba(0,0,0,0.10)",
          transition:
            "box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: "none",
        }}
      >
        {/* Leaf blades — repeating sharp triangles using conic gradients.
           Two passes at slight horizontal offset and different scales to
           feel hand-stacked rather than mathematically tiled. */}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-conic-gradient(
                from 0deg at 50% 100%,
                rgba(255,255,255,0.18) 0deg 4deg,
                transparent 4deg 8deg,
                rgba(0,0,0,0.16) 8deg 12deg,
                transparent 12deg 16deg
              )
            `,
            backgroundSize: "10px 100%",
            backgroundRepeat: "repeat-x",
          }}
        />
        {/* Second pass — finer blades in the opposite tone for depth */}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                92deg,
                transparent 0px,
                transparent 2px,
                rgba(255,255,255,0.14) 2px,
                rgba(255,255,255,0.14) 3px,
                transparent 3px,
                transparent 5px,
                rgba(0,0,0,0.18) 5px,
                rgba(0,0,0,0.18) 6px
              )
            `,
            mixBlendMode: "soft-light",
          }}
        />
        {/* Sharp leaf-tip darkening at the bottom edge */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.20) 100%)",
          }}
        />
      </span>

      {/* Top sticker face — pineapple yellow with diamond cross-hatch
         texture and dot specks. Decorative only: the clip-path peels
         it back to reveal the green underside. Text lives in a separate
         layer above so it's never clipped. */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "var(--color-yellow)",
          borderRadius: 3,
          boxShadow: `0 0 0 1px var(--color-yellow-edge), inset 0 1px 0 rgba(255,255,255,0.55)`,
          backgroundImage: PINEAPPLE_TEXTURE,
          backgroundSize: PINEAPPLE_TEXTURE_SIZE,
          backgroundColor: "var(--color-yellow)",
          clipPath: hover ? peelClip : restClip,
          transition:
            "clip-path 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          transform: hover
            ? "translate(-1px, 1px) rotate(-1.2deg)"
            : "translate(0, 0) rotate(0)",
          transformOrigin: "0 100%",
          pointerEvents: "none",
        }}
      />

      {/* Text layer — always present, switches color based on which
         layer it sits over (yellow at rest, green on hover). */}
      <span
        className="relative inline-block"
        style={{
          padding: "0.05em 0.5em",
          color: hover ? "#ffffff" : "var(--color-ink)",
          textShadow: hover
            ? "0 1px 0 rgba(0,0,0,0.18)"
            : "none",
          transition: "color 200ms ease, text-shadow 200ms ease",
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* ── 4. Killfeed chip — black chip with white text. On hover, a
       Valorant-style killfeed entry slides in below: a red attacker
       name + a weapon icon + the victim (Vishal). Reads as "you keep
       dying," matching the about-copy joke. */

function GlitchChip({ children }: { children: ReactNode }) {
  const { active: hover, ref, handlers } = useChipInteraction();
  return (
    <span
      ref={ref}
      {...handlers}
      className="relative inline-block font-bold"
      style={{
        background: "#ff4655",
        color: "#ffffff",
        padding: "0.05em 0.5em",
        borderRadius: 3,
        boxShadow:
          "0 0 0 1px #c93644, inset 0 1px 0 rgba(255,255,255,0.20), 0 1px 2px rgba(201,54,68,0.25)",
        verticalAlign: "baseline",
        fontSize: "max(14px, 0.92em)",
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      {children}

      {/* Killfeed entry — appears on hover, runs the kill animation,
         then fades out on mouse leave. Float above the line so it
         doesn't overlap the next line of prose. Right-anchored to
         the chip on desktop, but on narrow viewports it shifts to
         left-anchored so it doesn't overflow the screen edge. */}
      <span
        aria-hidden
        className="absolute font-mono right-0 max-md:left-0 max-md:right-auto"
        style={{
          // Float above the chip instead of below to avoid colliding
          // with the next paragraph line.
          bottom: "calc(100% + 6px)",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "2px 6px",
          background: "rgba(10,10,10,0.95)",
          borderLeft: "2px solid #ff4655",
          color: "#ffffff",
          fontSize: 10,
          lineHeight: "12px",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          opacity: hover ? 1 : 0,
          // Hide from layout entirely when not hovered so it never
          // affects neighboring lines, even on narrow viewports.
          visibility: hover ? "visible" : "hidden",
          transform: hover ? "translateX(0)" : "translateX(8px)",
          transition:
            "opacity 160ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1), visibility 0s linear " +
            (hover ? "0s" : "160ms"),
          pointerEvents: "none",
          boxShadow: "0 6px 14px -4px rgba(0,0,0,0.45)",
          animation: hover ? "ssw-killshake 0.5s ease 80ms" : "none",
          zIndex: 5,
        }}
      >
        <span style={{ color: "#ff4655", fontWeight: 700 }}>JETT</span>

        {/* Weapon + muzzle flash on hover */}
        <span
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <ValorantWeaponIcon />
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: -5,
              top: "50%",
              transform: "translateY(-50%)",
              width: 10,
              height: 10,
              background:
                "radial-gradient(circle, #ffea00 0%, #ff8a00 50%, transparent 75%)",
              borderRadius: "50%",
              opacity: 0,
              animation: hover ? "ssw-flash 0.5s ease" : "none",
              pointerEvents: "none",
            }}
          />
        </span>

        {/* VISHAL with kill-flash + strikethrough */}
        <span
          style={{
            position: "relative",
            color: "#bfbfbf",
            fontWeight: 700,
            animation: hover ? "ssw-killflash 0.5s ease" : "none",
          }}
        >
          VISHAL
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              height: 1.4,
              background: "#ff4655",
              transformOrigin: "left center",
              transform: hover ? "scaleX(1)" : "scaleX(0)",
              width: "100%",
              transition: "transform 220ms cubic-bezier(0.65,0,0.35,1) 140ms",
              pointerEvents: "none",
            }}
          />
        </span>

        <span
          aria-hidden
          style={{
            color: "#ff4655",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.06em",
            transform: hover ? "scale(1)" : "scale(0.6)",
            opacity: hover ? 1 : 0.55,
            transition:
              "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1) 280ms, opacity 180ms ease 280ms",
            display: "inline-block",
          }}
        >
          HS
        </span>
      </span>

      <style>{`
        @keyframes ssw-flash {
          0% { opacity: 0; transform: translateY(-50%) scale(0.4); }
          20% { opacity: 1; transform: translateY(-50%) scale(1.6); }
          50% { opacity: 0.6; transform: translateY(-50%) scale(1.1); }
          100% { opacity: 0; transform: translateY(-50%) scale(0.6); }
        }
        @keyframes ssw-killflash {
          0%, 30% { color: #bfbfbf; }
          35%, 55% { color: #ff4655; }
          100% { color: #bfbfbf; }
        }
        @keyframes ssw-killshake {
          0% { transform: translate(0, 0); }
          14% { transform: translate(1px, -1px); }
          28% { transform: translate(-1px, 1px); }
          42% { transform: translate(0.5px, 0); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </span>
  );
}

/* Valorant-style Vandal/AK silhouette. Tiny enough to read at killfeed
   scale: barrel + receiver + magazine + stock. */
function ValorantWeaponIcon() {
  return (
    <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden>
      {/* Stock */}
      <rect x="0.5" y="3.5" width="3" height="3" rx="0.4" fill="#e8e8e8" />
      {/* Receiver */}
      <rect x="3" y="3" width="11" height="4" rx="0.4" fill="#e8e8e8" />
      {/* Magazine */}
      <path
        d="M6 7L7 9.5H9L9.6 7"
        stroke="#e8e8e8"
        strokeWidth="1.6"
        fill="#e8e8e8"
        strokeLinejoin="round"
      />
      {/* Sight */}
      <rect x="9" y="2" width="2" height="1.2" fill="#e8e8e8" />
      {/* Barrel */}
      <rect x="14" y="4" width="6.5" height="2" rx="0.2" fill="#e8e8e8" />
      {/* Muzzle */}
      <rect x="20.5" y="3.5" width="1.2" height="3" fill="#e8e8e8" />
    </svg>
  );
}

/* ── 5. Flip-clock chip — realistic split-flap timer.
       Two side-by-side panels (HH | MM), dark slate body with rim highlight,
       white tabular numbers, a horizontal hinge bar with two rivets across
       the middle. Time advances slowly at rest; on hover the minutes panel
       does a fast flip animation. */

const HOUR = "01";

function ShuffleChip({ children: _children }: { children: ReactNode }) {
  const { active: hover, ref, handlers } = useChipInteraction();
  const reducedMotion = useReducedMotion();
  const [minute, setMinute] = useState(0);
  const [flipKey, setFlipKey] = useState(0);

  // Slow auto-advance: tick the minute every 6s so the clock feels alive
  // without being a distraction. Disabled when reduced-motion is on.
  useEffect(() => {
    if (hover || reducedMotion) return;
    const id = window.setInterval(() => {
      setMinute((m) => (m + 1) % 60);
      setFlipKey((k) => k + 1);
    }, 6000);
    return () => window.clearInterval(id);
  }, [hover, reducedMotion]);

  // On hover, fast-flip 5 minutes in a burst, then settle.
  useEffect(() => {
    if (!hover || reducedMotion) return;
    let count = 0;
    const id = window.setInterval(() => {
      count++;
      setMinute((m) => (m + 1) % 60);
      setFlipKey((k) => k + 1);
      if (count >= 5) window.clearInterval(id);
    }, 140);
    return () => window.clearInterval(id);
  }, [hover, reducedMotion]);

  const mm = String(minute).padStart(2, "0");

  return (
    <span
      ref={ref}
      {...handlers}
      className="relative inline-flex items-center font-bold"
      style={{
        // Pull up so the clock body sits on the text baseline rather
        // than sinking below it.
        verticalAlign: "-0.32em",
        fontSize: "max(14px, 0.92em)",
        // Reserve a touch of space so the rim shadow doesn't crop
        padding: "0 1px",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      <span
        className="inline-flex items-center"
        style={{
          background: "linear-gradient(180deg, #2a2c33 0%, #1c1d22 100%)",
          padding: "3px",
          borderRadius: 6,
          boxShadow: [
            // Outer rim
            "0 0 0 1px #0d0e11",
            // Lift on the page
            "0 2px 6px -2px rgba(0,0,0,0.40)",
            // Top edge highlight
            "inset 0 1px 0 rgba(255,255,255,0.10)",
            // Bottom edge darkening
            "inset 0 -1px 0 rgba(0,0,0,0.45)",
          ].join(", "),
          gap: 2,
        }}
      >
        <FlipPanel value={HOUR} />
        <FlipPanel value={mm} flipKey={flipKey} />
      </span>
    </span>
  );
}

function FlipPanel({
  value,
  flipKey,
}: {
  value: string;
  flipKey?: number;
}) {
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const flipKeyRef = useRef(flipKey);

  useEffect(() => {
    if (flipKey === undefined || flipKey === flipKeyRef.current) return;
    flipKeyRef.current = flipKey;
    setFlipping(true);
    const t = window.setTimeout(() => {
      setPrev(value);
      setFlipping(false);
    }, 320);
    return () => window.clearTimeout(t);
  }, [flipKey, value]);

  const W = 24;
  const H = 24;
  const FONT = 17;

  return (
    <span
      className="relative inline-block"
      style={{
        width: W,
        height: H,
        // Two-stop gradient that gives each half its own light fall:
        // top half lit from above, bottom half darker, but no hard band.
        background:
          "linear-gradient(180deg, #1d1e22 0%, #0e0f12 49%, #0a0b0e 51%, #1a1b20 100%)",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: [
          // Outer rim
          "0 0 0 1px #000",
          // Lift on the page
          "0 2px 5px -2px rgba(0,0,0,0.45)",
          // Top edge highlight
          "inset 0 1px 0 rgba(255,255,255,0.18)",
          // Bottom edge darken
          "inset 0 -1px 0 rgba(0,0,0,0.7)",
          // Side bevels
          "inset 1px 0 0 rgba(255,255,255,0.04)",
          "inset -1px 0 0 rgba(0,0,0,0.4)",
        ].join(", "),
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{
          color: "#ffffff",
          fontWeight: 900,
          fontSize: FONT,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          textShadow: "0 1px 0 rgba(0,0,0,0.85)",
        }}
      >
        {flipping ? prev : value}
      </span>

      {flipping && (
        <span
          aria-hidden
          className="absolute left-0 right-0 top-0 overflow-hidden"
          style={{
            height: "50%",
            background: "linear-gradient(180deg, #1f2025 0%, #16171b 100%)",
            transformOrigin: "bottom",
            animation:
              "ssw-flipDown 320ms cubic-bezier(0.55, 0, 0.55, 1) forwards",
            backfaceVisibility: "hidden",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
          }}
        >
          <span
            className="absolute inset-0 flex items-end justify-center"
            style={{
              color: "#ffffff",
              fontWeight: 800,
              fontSize: FONT,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              transform: "translateY(50%)",
            }}
          >
            {prev}
          </span>
        </span>
      )}

      {/* Hairline split at the middle — single dark line + faint
         highlight below for a subtle fold cue, no band. */}
      <span
        aria-hidden
        className="absolute left-0 right-0"
        style={{
          top: "calc(50% - 0.5px)",
          height: 1,
          background: "rgba(0,0,0,0.85)",
          boxShadow: "0 0.5px 0 rgba(255,255,255,0.05)",
        }}
      />
      {/* Inset rivets — small, sit on the seam */}
      <span
        aria-hidden
        className="absolute"
        style={{
          left: 1.5,
          top: "calc(50% - 1px)",
          width: 2,
          height: 2,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #4a4c52 0%, #1a1b20 70%, #050507 100%)",
          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.30)",
        }}
      />
      <span
        aria-hidden
        className="absolute"
        style={{
          right: 1.5,
          top: "calc(50% - 1px)",
          width: 2,
          height: 2,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #4a4c52 0%, #1a1b20 70%, #050507 100%)",
          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.30)",
        }}
      />

      <style>{`
        @keyframes ssw-flipDown {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
      `}</style>
    </span>
  );
}

/* ── 6. Claude chip — Anthropic-branded chunky chip.
       Cream paper body, coral sparkle on the left, coral hairline edge.
       At rest, the sparkle does a slow rotation. On hover, the sparkle
       spins faster, the chip background gets a soft coral wash, and
       the text picks up a subtle coral tint. */

const CLAUDE = {
  paper: "#f0eee6",
  paperEdge: "#e2dfd2",
  coral: "#cc785c",
  coralDeep: "#a85d44",
  ink: "#191919",
};

function ClaudeChip({ children }: { children: ReactNode }) {
  const { active: hover, ref, handlers } = useChipInteraction();
  const reducedMotion = useReducedMotion();
  return (
    <span
      ref={ref}
      {...handlers}
      className="relative inline-flex items-center font-bold"
      style={{
        background: CLAUDE.paper,
        color: hover ? CLAUDE.coralDeep : CLAUDE.ink,
        padding: "0.05em 0.55em 0.05em 0.45em",
        borderRadius: 3,
        boxShadow: hover
          ? `0 0 0 1px ${CLAUDE.coral}, inset 0 1px 0 rgba(255,255,255,0.7), 0 4px 14px -6px rgba(204,120,92,0.45)`
          : `0 0 0 1px ${CLAUDE.paperEdge}, inset 0 1px 0 rgba(255,255,255,0.7)`,
        verticalAlign: "baseline",
        fontSize: "max(14px, 0.92em)",
        whiteSpace: "nowrap",
        gap: "0.35em",
        transition:
          "color 220ms ease, box-shadow 220ms ease",
        cursor: "pointer",
      }}
    >
      {/* Soft coral wash that fades in on hover, behind the text */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 16% 50%, rgba(204,120,92,0.20), transparent 65%)`,
          opacity: hover ? 1 : 0,
          transition: "opacity 260ms ease",
          borderRadius: 3,
          pointerEvents: "none",
        }}
      />

      {/* Anthropic-style sparkle ✦ in coral, rotates slowly at rest,
         spins faster on hover. */}
      <span
        aria-hidden
        className="relative inline-flex flex-shrink-0 items-center justify-center"
        style={{
          width: "0.95em",
          height: "0.95em",
          color: CLAUDE.coral,
          animation: reducedMotion
            ? "none"
            : hover
            ? "ssw-claudeSpark 1.2s linear infinite"
            : "ssw-claudeSpark 9s linear infinite",
          transition: "color 220ms ease",
        }}
      >
        <ClaudeSparkle />
      </span>

      <span className="relative">{children}</span>

      <style>{`
        @keyframes ssw-claudeSpark {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  );
}

function ClaudeSparkle() {
  // Anthropic ✦ — four-point asterisk-sparkle.
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      style={{ display: "block" }}
    >
      <path
        d="M6 0.5 L6.7 5.3 L11.5 6 L6.7 6.7 L6 11.5 L5.3 6.7 L0.5 6 L5.3 5.3 Z"
        fill="currentColor"
      />
    </svg>
  );
}
