"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "motion/react";

type Swatch = { id: string; label: string; hex: string; ink: string };

const SWATCHES: Swatch[] = [
  { id: "accent", label: "Accent", hex: "#FF4A05", ink: "#FFFFFF" },
  { id: "sage", label: "Sage", hex: "#B8C5B8", ink: "#1E2A20" },
  { id: "beige", label: "Beige", hex: "#E8DDC9", ink: "#3A2F1F" },
  { id: "rust", label: "Rust", hex: "#B05E3D", ink: "#FFF7EE" },
  { id: "terracotta", label: "Terracotta", hex: "#C98063", ink: "#27160F" },
  { id: "mustard", label: "Mustard", hex: "#C9A961", ink: "#2B2010" },
  { id: "lavender", label: "Lavender", hex: "#9A94BE", ink: "#1E1A36" },
  { id: "slate", label: "Slate", hex: "#5A7490", ink: "#F0F3F7" },
  { id: "ivory", label: "Ivory", hex: "#EFE7D8", ink: "#2A2418" },
];

type PatternId = "none" | "dots" | "lines" | "grid" | "waves";

const PATTERNS: { id: PatternId; label: string }[] = [
  { id: "none", label: "None" },
  { id: "dots", label: "Dots" },
  { id: "lines", label: "Lines" },
  { id: "grid", label: "Grid" },
  { id: "waves", label: "Waves" },
];

function patternSvg(id: PatternId, ink: string): string | null {
  const c = ink;
  switch (id) {
    case "dots":
      return `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><circle cx='3' cy='3' r='1' fill='${c}' opacity='0.28'/></svg>`;
    case "lines":
      return `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14'><path d='M0 13 L14 -1' stroke='${c}' stroke-width='1' opacity='0.22'/></svg>`;
    case "grid":
      return `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><path d='M0 0 H20 M0 0 V20' stroke='${c}' stroke-width='0.9' opacity='0.18' fill='none'/></svg>`;
    case "waves":
      return `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='14'><path d='M0 7 Q 7 0 14 7 T 28 7' stroke='${c}' stroke-width='1' fill='none' opacity='0.22'/></svg>`;
    default:
      return null;
  }
}

function patternCss(id: PatternId, ink: string): string | undefined {
  const svg = patternSvg(id, ink);
  if (!svg) return undefined;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function formatIssued(d: Date): string {
  const mo = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const yr = String(d.getFullYear()).slice(-2);
  return `${String(d.getDate()).padStart(2, "0")} ${mo} '${yr}`;
}

type Stage = "closed" | "open" | "sent";

const NAME_MAX = 60;
const MSG_MAX = 60;

export function GuestCard() {
  const [stage, setStage] = useState<Stage>("closed");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [swatchId, setSwatchId] = useState("accent");
  const [patternId, setPatternId] = useState<PatternId>("dots");
  const [hasSignature, setHasSignature] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [issued] = useState(() => formatIssued(new Date()));

  // Per-field explicit confirmation. Drag unlocks only when all three are
  // ticked, so signing never fights the drag gesture.
  const [nameDone, setNameDone] = useState(false);
  const [messageDone, setMessageDone] = useState(false);
  const [signatureDone, setSignatureDone] = useState(false);

  const swatch = SWATCHES.find((s) => s.id === swatchId) ?? SWATCHES[0];
  const pattern = patternCss(patternId, swatch.ink);

  const canConfirmName = name.trim().length > 0;
  const canConfirmMessage = message.trim().length > 0;
  const canConfirmSignature = hasSignature;
  const isComplete = nameDone && messageDone && signatureDone;

  /**
   * Fire a short haptic pulse on devices that support it (Android + Chromium).
   * iOS Safari and desktop browsers silently ignore. Skipped for users with
   * reduced-motion preference. Duration in ms, or a pattern array.
   */
  function haptic(pattern: number | number[]) {
    if (typeof navigator === "undefined") return;
    if (typeof navigator.vibrate !== "function") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;
    navigator.vibrate(pattern);
  }

  function toggleNameDone() {
    if (nameDone) return setNameDone(false);
    if (canConfirmName) {
      setNameDone(true);
      haptic(12);
    }
  }
  function toggleMessageDone() {
    if (messageDone) return setMessageDone(false);
    if (canConfirmMessage) {
      setMessageDone(true);
      haptic(12);
    }
  }
  function toggleSignatureDone() {
    if (signatureDone) return setSignatureDone(false);
    if (canConfirmSignature) {
      setSignatureDone(true);
      haptic(12);
    }
  }

  // When the third confirmation completes, fire a brief double-tap so the
  // "now draggable" state has its own tactile signature.
  useEffect(() => {
    if (isComplete) haptic([18, 40, 18]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  // Drag motion values. Used by visual transforms for realism.
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  // Pronounced tilt on drag so the card feels like paper moving in 3D.
  const rotateX = useTransform(y, [-40, 0, 240, 520], [3, 0, -8, -14]);
  const rotateY = useTransform(x, [-200, 0, 200], [6, 0, -6]);
  const cardRotateZ = useTransform(x, [-200, 0, 200], [-3, 0, 3]);

  // Refs for hit-testing drag against the drop bar.
  const cardShellRef = useRef<HTMLDivElement>(null);
  const dropBarRef = useRef<HTMLButtonElement>(null);

  function openCard() {
    setStage("open");
  }

  function closeModal() {
    // In the sent state, clicking outside the success panel resets the card
    // entirely: fresh fields, unticked, ready for the next visitor.
    if (stage === "sent") {
      setName("");
      setMessage("");
      sigClear();
      setNameDone(false);
      setMessageDone(false);
      setSignatureDone(false);
      y.set(0);
    }
    setStage("closed");
  }

  // Body scroll lock while modal is on screen.
  useEffect(() => {
    if (stage === "closed") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [stage]);

  // ESC to close while open.
  useEffect(() => {
    if (stage !== "open") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setStage("closed");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage]);

  /* ===========================================================================
     Signature pad: HTML canvas, pointer events, preserved across color changes.
     =========================================================================== */
  const sigRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const signatureDataRef = useRef<string>("");

  useEffect(() => {
    const canvas = sigRef.current;
    if (!canvas) return;

    const setup = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const prev = canvas.toDataURL();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = swatch.ink;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (hasSignature) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
        img.src = prev;
      }
    };

    setup();
    const ro = new ResizeObserver(setup);
    ro.observe(canvas);
    return () => ro.disconnect();
    // swatch.ink intentional so new strokes take new ink color
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swatch.ink, stage]);

  function sigPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = sigRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function sigStart(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    lastPoint.current = sigPoint(e);
    sigRef.current!.setPointerCapture(e.pointerId);
  }

  function sigMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !lastPoint.current) return;
    const p = sigPoint(e);
    const ctx = sigRef.current!.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = swatch.ink;
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastPoint.current = p;
    if (!hasSignature) setHasSignature(true);
  }

  function sigEnd() {
    if (!drawing.current) return;
    drawing.current = false;
    lastPoint.current = null;
    if (sigRef.current) signatureDataRef.current = sigRef.current.toDataURL();
  }

  function sigClear() {
    const c = sigRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    signatureDataRef.current = "";
    setHasSignature(false);
  }

  /* ===========================================================================
     Drag to send: hit-test card bottom against the bar on drag end.
     =========================================================================== */
  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (!cardShellRef.current || !dropBarRef.current) return;

      if (!isComplete) {
        if (info.offset.y > 40) {
          flashHint("Tick all three fields to confirm first.");
          haptic([6, 40, 6]);
        }
        y.set(0);
        return;
      }

      const cardRect = cardShellRef.current.getBoundingClientRect();
      const barRect = dropBarRef.current.getBoundingClientRect();

      const overlap =
        cardRect.bottom >= barRect.top && cardRect.top <= barRect.bottom;
      const draggedDown = info.offset.y > 60;

      if (overlap || draggedDown) {
        haptic(28);
        triggerSend(barRect.top - cardRect.top);
      } else {
        y.set(0);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isComplete],
  );

  function flashHint(msg: string) {
    setHint(msg);
    window.setTimeout(() => setHint(null), 2400);
  }

  function triggerSend(distanceDown: number) {
    // Animate card toward bar, then transition to sent state.
    // Motion will interpolate from current y to target y.
    const target = Math.max(distanceDown, 120);
    y.set(0); // reset baseline
    // Use a small timeout so the animation runs cleanly on the next frame.
    requestAnimationFrame(() => {
      y.set(target);
      window.setTimeout(() => setStage("sent"), 350);
    });
  }

  function sendAnother() {
    setName("");
    setMessage("");
    sigClear();
    setNameDone(false);
    setMessageDone(false);
    setSignatureDone(false);
    y.set(0);
    setStage("open");
  }

  // "Edit card" after sending: return to the form with all values intact and
  // every field unlocked so the user can tweak anything immediately.
  function editCard() {
    setNameDone(false);
    setMessageDone(false);
    setSignatureDone(false);
    y.set(0);
    setStage("open");
  }

  /* ===========================================================================
     PNG download: render current card state as an SVG, rasterize to PNG.
     =========================================================================== */
  function buildSvg(): string {
    const W = 420;
    const H = 560;
    const sig = signatureDataRef.current;
    const bg = swatch.hex;
    const ink = swatch.ink;
    const patBody = patternSvg(patternId, ink);

    const patW = { dots: 16, lines: 14, grid: 20, waves: 28, none: 1 }[
      patternId
    ];
    const patH = { dots: 16, lines: 14, grid: 20, waves: 14, none: 1 }[
      patternId
    ];

    const patDef = patBody
      ? `<defs><pattern id="p" patternUnits="userSpaceOnUse" width="${patW}" height="${patH}">${patBody.replace(/<svg[^>]*>|<\/svg>/g, "")}</pattern></defs>`
      : "";

    const esc = (s: string) =>
      s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

    const lines: string[] = [];
    const words = message.split(/\s+/);
    let line = "";
    const maxChars = 36;
    for (const w of words) {
      if ((line + " " + w).trim().length > maxChars) {
        lines.push(line.trim());
        line = w;
      } else line = (line + " " + w).trim();
    }
    if (line) lines.push(line);

    const sigImg =
      sig && hasSignature
        ? `<image href="${sig}" x="40" y="430" width="340" height="54" preserveAspectRatio="xMidYMid meet"/>`
        : "";

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" rx="20" ry="20" fill="${bg}"/>
  ${patDef}
  ${patBody ? `<rect width="${W}" height="${H}" rx="20" ry="20" fill="url(#p)"/>` : ""}
  <g fill="${ink}" font-family="-apple-system, Segoe UI, sans-serif">
    <text x="40" y="50" font-size="11" letter-spacing="2" opacity="0.78">GUEST CARD</text>
    <text x="40" y="94" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="24">Thank you for visiting!</text>
    <text x="40" y="150" font-size="10" letter-spacing="2" opacity="0.7">NAME</text>
    <text x="40" y="180" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="18">${esc(name || "Anonymous")}</text>
    <line x1="40" y1="192" x2="260" y2="192" stroke="${ink}" stroke-width="1" opacity="0.35"/>
    <text x="300" y="150" font-size="10" letter-spacing="2" opacity="0.7">ISSUED</text>
    <text x="300" y="180" font-size="15">${esc(issued)}</text>
    <text x="40" y="240" font-size="10" letter-spacing="2" opacity="0.7">MESSAGE</text>
    ${lines
      .slice(0, 4)
      .map(
        (ln, i) =>
          `<text x="40" y="${270 + i * 26}" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="16">${esc(ln)}</text>`,
      )
      .join("")}
    <line x1="40" y1="386" x2="380" y2="386" stroke="${ink}" stroke-width="1" opacity="0.35"/>
    <text x="40" y="420" font-size="10" letter-spacing="2" opacity="0.7">SIGNATURE</text>
    ${sigImg}
    <line x1="40" y1="494" x2="380" y2="494" stroke="${ink}" stroke-width="1" opacity="0.35"/>
  </g>
</svg>`;
  }

  async function downloadPng() {
    const svgString = buildSvg();
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("SVG load failed"));
      img.src = svgUrl;
    });
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = 420 * scale;
    canvas.height = 560 * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(svgUrl);
    const pngUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = pngUrl;
    const safe = (name || "guest").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    a.download = `guest-card-${safe}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /* ===========================================================================
     Render
     =========================================================================== */
  return (
    <>
      {/* Resting state: peek card tucked above the pill.
          Hidden once the modal takes over so there's no duplicate. */}
      {stage === "closed" && (
        <PeekSlot
          onClick={openCard}
          swatchHex={swatch.hex}
          swatchInk={swatch.ink}
          pattern={pattern}
        />
      )}

      {/* Reveal: card rises from the bar. No centered-modal framing. */}
      <AnimatePresence>
        {(stage === "open" || stage === "sent") && (
          <motion.div
            key="guest-reveal"
            aria-label="Guest card"
            className="fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* No backdrop: page stays fully visible behind. Outside clicks close. */}
            <div
              aria-hidden
              onClick={closeModal}
              className="absolute inset-0"
            />

            {/* Content sits above the pill, anchored to the bottom of the viewport.
                On tall content it scrolls; on short content it hugs the pill. */}
            <div
              className="absolute inset-0 overflow-y-auto overscroll-contain"
              onClick={closeModal}
            >
              <div
                className="flex min-h-full flex-col justify-end px-4 pb-28 pt-12 md:pb-32 md:pt-16"
              >
              <div
                className="relative mx-auto w-full max-w-[440px]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Hint toast */}
                <AnimatePresence>
                  {hint && (
                    <motion.div
                      aria-live="polite"
                      className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-full pb-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                    >
                      <span className="rounded-full bg-ink px-3 py-1.5 text-[12px] text-bg">
                        {hint}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card: form OR sent panel. Perspective wrapper gives depth
                    to drag-tilt and ready-state lift. */}
                {stage === "open" && (
                  <div
                    style={{ perspective: "1400px" }}
                    className="mx-auto w-full"
                  >
                  <motion.div
                    ref={cardShellRef}
                    drag={isComplete ? "y" : false}
                    dragConstraints={{ top: -12, bottom: 520 }}
                    dragElastic={0.18}
                    dragMomentum={false}
                    style={{
                      x,
                      y,
                      rotateX,
                      rotateY,
                      rotateZ: cardRotateZ,
                      transformStyle: "preserve-3d",
                      touchAction: "none",
                    }}
                    onDragEnd={handleDragEnd}
                    initial={{ y: 340, opacity: 0, rotateX: -12 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: 380, opacity: 0, rotateX: -8 }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 22,
                      mass: 1,
                    }}
                    className="relative mx-auto w-full rounded-[18px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.12),0_4px_10px_-2px_rgba(0,0,0,0.14),0_18px_36px_-12px_rgba(0,0,0,0.28),0_42px_80px_-28px_rgba(0,0,0,0.34)]"
                    whileDrag={{
                      scale: 1.02,
                      cursor: "grabbing",
                    }}
                  >
                    <CardSurface
                      swatchHex={swatch.hex}
                      swatchInk={swatch.ink}
                      pattern={pattern}
                      isReady={isComplete}
                    />
                    <div className="relative z-[1]" style={{ color: swatch.ink }}>
                      {/* Drag handle / header */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] uppercase tracking-[0.22em] opacity-80">
                          Guest card
                        </span>
                        <span
                          aria-hidden
                          className="text-[10px] uppercase tracking-[0.2em] opacity-70"
                        >
                          {isComplete
                            ? "Drag to send"
                            : "Tick each field"}
                        </span>
                      </div>
                      <h3
                        className="mt-3 text-[22px] leading-[1.15] md:text-[24px]"
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontStyle: "italic",
                          fontWeight: 500,
                        }}
                      >
                        Thank you for visiting!
                      </h3>

                      {/* Fields */}
                      <div className="mt-6 grid grid-cols-[1fr_auto] gap-x-5 gap-y-5">
                        <Field
                          label="Name"
                          canConfirm={canConfirmName}
                          confirmed={nameDone}
                          onToggle={toggleNameDone}
                        >
                          <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                              setName(e.target.value.slice(0, NAME_MAX))
                            }
                            placeholder="Your name"
                            aria-label="Your name"
                            disabled={nameDone}
                            className="w-full bg-transparent italic placeholder:opacity-50 focus:outline-none disabled:cursor-default"
                            style={{ color: swatch.ink }}
                          />
                        </Field>
                        <Field label="Issued" compact>
                          <span className="tabular-nums text-[13.5px] not-italic opacity-90">
                            {issued}
                          </span>
                        </Field>

                        <div className="col-span-2">
                          <Field
                            label="Message"
                            canConfirm={canConfirmMessage}
                            confirmed={messageDone}
                            onToggle={toggleMessageDone}
                            counter={`${message.length}/${MSG_MAX}`}
                          >
                            <textarea
                              value={message}
                              onChange={(e) =>
                                setMessage(e.target.value.slice(0, MSG_MAX))
                              }
                              placeholder="Leave a short note"
                              rows={1}
                              aria-label="Your message"
                              disabled={messageDone}
                              className="w-full resize-none bg-transparent italic placeholder:opacity-50 focus:outline-none disabled:cursor-default"
                              style={{ color: swatch.ink }}
                              onInput={(e) => {
                                const el = e.currentTarget;
                                el.style.height = "auto";
                                el.style.height = el.scrollHeight + "px";
                              }}
                            />
                          </Field>
                        </div>

                        <div className="col-span-2">
                          <Field
                            label="Signature"
                            canConfirm={canConfirmSignature}
                            confirmed={signatureDone}
                            onToggle={toggleSignatureDone}
                          >
                            <div className="relative h-[110px] w-full">
                              <canvas
                                ref={sigRef}
                                onPointerDown={signatureDone ? undefined : sigStart}
                                onPointerMove={signatureDone ? undefined : sigMove}
                                onPointerUp={signatureDone ? undefined : sigEnd}
                                onPointerLeave={signatureDone ? undefined : sigEnd}
                                onPointerCancel={signatureDone ? undefined : sigEnd}
                                className={`h-full w-full ${signatureDone ? "cursor-default" : "cursor-crosshair"}`}
                                style={{
                                  touchAction: "none",
                                  pointerEvents: signatureDone ? "none" : undefined,
                                }}
                                aria-label="Sign here"
                              />
                              {!hasSignature && (
                                <span className="pointer-events-none absolute inset-0 flex items-center italic opacity-50">
                                  Sign here
                                </span>
                              )}
                              {hasSignature && !signatureDone && (
                                <button
                                  type="button"
                                  onClick={sigClear}
                                  className="absolute right-0 top-0 rounded-full border border-current/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] opacity-70 transition-opacity hover:opacity-100"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </Field>
                        </div>
                      </div>

                      {/* Ready indicator */}
                      <div className="mt-5 flex items-center justify-center gap-2 text-[10.5px] uppercase tracking-[0.2em] opacity-60">
                        {isComplete ? (
                          <>
                            <ReadyDot />
                            Ready to send
                          </>
                        ) : (
                          <span>Tick each field to confirm</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  </div>
                )}

                {/* Sent panel */}
                <AnimatePresence>
                  {stage === "sent" && (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 24,
                      }}
                      className="mx-auto flex w-full flex-col items-center rounded-[22px] border border-bg/15 bg-bg px-8 py-10 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 18,
                          delay: 0.08,
                        }}
                        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: swatch.hex,
                          color: swatch.ink,
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <polyline points="4 12 10 18 20 6" />
                        </svg>
                      </motion.div>
                      <h3 className="text-[22px] font-medium tracking-[-0.01em] text-ink">
                        Sent ✓
                      </h3>
                      <p className="mt-2 max-w-[36ch] text-pretty text-[14.5px] leading-[1.55] text-ink-soft">
                        Thanks for the note,{" "}
                        {name.split(" ")[0] || "friend"}. Keep a copy of your
                        card if you like.
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button
                          type="button"
                          onClick={editCard}
                          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[13.5px] font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
                        >
                          Edit card
                        </button>
                        <button
                          type="button"
                          onClick={downloadPng}
                          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium"
                          style={{
                            backgroundColor: swatch.hex,
                            color: swatch.ink,
                          }}
                        >
                          Download card <span aria-hidden>↓</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pickers fade out once the card is ready to send, replaced
                    by a focused drag prompt so the drop zone gets full
                    attention. */}
                {stage === "open" && isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 240,
                      damping: 24,
                      delay: 0.08,
                    }}
                    className="mt-10 flex flex-col items-center gap-2 text-center"
                  >
                    <span className="text-[11px] uppercase tracking-[0.22em] text-muted">
                      That&rsquo;s it
                    </span>
                    <span
                      className="text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.3] text-ink"
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontStyle: "italic",
                        fontWeight: 500,
                      }}
                    >
                      Drag the card down into the bar to send
                    </span>
                    <motion.span
                      aria-hidden
                      animate={{ y: [0, 6, 0] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mt-2 text-[14px] text-muted"
                    >
                      ↓
                    </motion.span>
                  </motion.div>
                )}

                {/* Pickers (only while the card is still being filled out) */}
                {stage === "open" && !isComplete && (
                  <div className="mt-8 space-y-6">
                    <Carousel label="Pick a card color">
                      {SWATCHES.map((s) => {
                        const active = s.id === swatchId;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSwatchId(s.id)}
                            aria-label={s.label}
                            aria-pressed={active}
                            className="relative shrink-0"
                          >
                            <motion.span
                              layout
                              animate={{
                                scale: active ? 1.18 : 1,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 360,
                                damping: 22,
                              }}
                              className="block h-9 w-9 rounded-full ring-1 ring-line"
                              style={{ backgroundColor: s.hex }}
                            />
                            {active && (
                              <motion.span
                                layoutId="swatch-ring"
                                className="pointer-events-none absolute -inset-[5px] rounded-full"
                                style={{
                                  boxShadow: `0 0 0 1.5px ${s.hex}`,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 24,
                                }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </Carousel>

                    <Carousel label="Pick a pattern">
                      {PATTERNS.map((p) => {
                        const active = p.id === patternId;
                        const css = patternCss(p.id, swatch.ink);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPatternId(p.id)}
                            aria-label={p.label}
                            aria-pressed={active}
                            className="group flex shrink-0 flex-col items-center gap-1.5"
                          >
                            <motion.span
                              animate={{
                                scale: active ? 1.06 : 1,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 22,
                              }}
                              className="block h-14 w-14 rounded-md"
                              style={{
                                backgroundColor: swatch.hex,
                                backgroundImage: css,
                                backgroundRepeat: "repeat",
                                boxShadow: active
                                  ? `0 0 0 2px var(--color-ink)`
                                  : `0 0 0 1px var(--color-line)`,
                              }}
                            />
                            <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
                              {p.label}
                            </span>
                          </button>
                        );
                      })}
                    </Carousel>
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* Pill drop target. Visual anchor + drop zone + tap-to-close. */}
            <motion.button
              ref={dropBarRef}
              type="button"
              onClick={closeModal}
              aria-label={
                stage === "sent"
                  ? "Sealed"
                  : isComplete
                    ? "Drop card here to send"
                    : "Close"
              }
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="absolute bottom-0 left-1/2 z-[1] flex h-16 -translate-x-1/2 items-center justify-center md:h-20"
            >
              <motion.span
                aria-hidden
                animate={{
                  width: isComplete && stage === "open" ? 240 : 200,
                  backgroundColor:
                    isComplete && stage === "open"
                      ? swatch.hex
                      : "var(--color-ink)",
                }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="block h-2 rounded-full"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ===========================================================================
   Sub-components
   =========================================================================== */

function PeekSlot({
  onClick,
  swatchHex,
  swatchInk,
  pattern,
}: {
  onClick: () => void;
  swatchHex: string;
  swatchInk: string;
  pattern: string | undefined;
}) {
  return (
    <div className="flex flex-col items-center">
      {/* Peek card: tucked into the slot. Idle float + hover lift.
          Flush with the pill below (no gap); pill overlaps the card bottom
          to sell the "tucked into a slot" illusion. */}
      <motion.button
        type="button"
        onClick={onClick}
        aria-label="Open guest card"
        initial={false}
        animate={{ y: [0, -2.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{
          y: -6,
          transition: { type: "spring", stiffness: 280, damping: 22 },
        }}
        whileTap={{ y: -2 }}
        className="group relative z-[1] block w-[320px] overflow-hidden rounded-t-[18px] text-left shadow-[0_6px_14px_-6px_rgba(0,0,0,0.22),0_18px_34px_-18px_rgba(0,0,0,0.3)] transition-shadow duration-300 hover:shadow-[0_10px_22px_-6px_rgba(0,0,0,0.28),0_28px_46px_-20px_rgba(0,0,0,0.38)] sm:w-[360px] md:w-[400px]"
        style={{
          height: 96,
          backgroundColor: swatchHex,
          color: swatchInk,
        }}
      >
        {pattern && (
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: pattern,
              backgroundRepeat: "repeat",
            }}
          />
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
          style={{
            backgroundImage: PAPER_GRAIN,
            backgroundSize: "160px 160px",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[40%]"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.16), rgba(255,255,255,0))",
          }}
        />
        <span className="relative z-[1] block px-6 pt-5">
          <span className="block text-[10.5px] uppercase tracking-[0.22em] opacity-80">
            Guest card
          </span>
          <span
            className="mt-2.5 block text-[20px] leading-[1.15] md:text-[22px]"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            Thank you for visiting!
          </span>
        </span>
      </motion.button>

      {/* Slot pill: slightly wider than the card and flush with its bottom edge
          so the peek reads as tucked into a shelf rather than floating. */}
      <motion.span
        aria-hidden
        className="pointer-events-none relative z-[2] -mt-2 block h-2 w-[340px] rounded-full bg-ink sm:w-[380px] md:w-[420px]"
        animate={{ scaleX: [1, 1.02, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />

      <span aria-hidden className="sr-only" style={{ color: swatchInk }} />
    </div>
  );
}

const PAPER_GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='7' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0.25 0'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.5'/></svg>`,
)}")`;

function CardSurface({
  swatchHex,
  swatchInk,
  pattern,
  isReady,
}: {
  swatchHex: string;
  swatchInk: string;
  pattern: string | undefined;
  isReady: boolean;
}) {
  return (
    <>
      {/* Base color */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[18px]"
        style={{ backgroundColor: swatchHex }}
      />
      {/* Pattern */}
      {pattern && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-[18px]"
          style={{
            backgroundImage: pattern,
            backgroundRepeat: "repeat",
          }}
        />
      )}
      {/* Paper grain: very subtle noise texture for realism */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[18px] opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage: PAPER_GRAIN,
          backgroundSize: "160px 160px",
        }}
      />
      {/* Top-edge paper highlight: hints at light from above, card thickness */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28%] rounded-t-[18px]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.14), rgba(255,255,255,0))",
        }}
      />
      {/* Bottom-edge subtle shade: anchors the card to the surface */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] rounded-b-[18px]"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(0,0,0,0.08), rgba(0,0,0,0))",
        }}
      />
      {/* Ready-state inner ring */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 rounded-[18px]"
        style={{
          boxShadow: `inset 0 0 0 1.5px ${swatchInk}22`,
        }}
      />
    </>
  );
}

function Field({
  label,
  children,
  canConfirm,
  confirmed,
  onToggle,
  counter,
  compact,
}: {
  label: string;
  children: React.ReactNode;
  canConfirm?: boolean;
  confirmed?: boolean;
  onToggle?: () => void;
  counter?: string;
  compact?: boolean;
}) {
  const showButton = onToggle !== undefined;
  const clickable = showButton && (confirmed || canConfirm);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[9.5px] uppercase tracking-[0.22em] opacity-75">
          {label}
        </span>
        {counter && (
          <span className="text-[9.5px] tabular-nums opacity-55">
            {counter}
          </span>
        )}
      </div>
      <div className="mt-1 flex items-end gap-2 border-b border-current/30 pb-1">
        <div className={compact ? "" : "flex-1"}>{children}</div>
        {showButton && (
          <button
            type="button"
            onClick={onToggle}
            disabled={!clickable}
            aria-label={
              confirmed ? `Edit ${label.toLowerCase()}` : `Confirm ${label.toLowerCase()}`
            }
            className="mb-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current/40 transition-[transform,border-color,opacity,background-color] duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-25 enabled:hover:scale-[1.08] enabled:hover:border-current"
            style={{
              backgroundColor: confirmed ? "currentColor" : "transparent",
            }}
          >
            {confirmed ? (
              /* Edit (pencil) glyph, rendered in the inverse ink so it reads
                 against the filled button background. */
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--pencil-ink, #fff)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                style={{ mixBlendMode: "difference", opacity: 0.95 }}
              >
                <path d="M14 4l6 6-11 11H3v-6L14 4z" />
              </svg>
            ) : (
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <polyline points="5 12 10 17 19 7" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Carousel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(dx: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: "smooth" });
  }

  return (
    <div>
      <div
        className="mb-3 text-center text-[11.5px] font-normal text-muted/85"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          letterSpacing: "0.005em",
        }}
      >
        {label}
      </div>
      <div className="relative flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollBy(-160)}
          aria-label="Scroll left"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div
          ref={trackRef}
          className="no-scrollbar flex max-w-[280px] items-center gap-3 overflow-x-auto scroll-smooth pb-2 pt-2 sm:max-w-[320px]"
        >
          {children}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(160)}
          aria-label="Scroll right"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ReadyDot() {
  return (
    <motion.span
      aria-hidden
      animate={{
        scale: [1, 1.25, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="inline-block h-1.5 w-1.5 rounded-full bg-current"
    />
  );
}
