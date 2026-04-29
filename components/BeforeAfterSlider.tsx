"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  /** CSS aspect ratio for the frame, e.g. "16/10". Defaults to 16/10. */
  aspect?: string;
  /** Initial reveal position, 0–100. Defaults to 50. */
  initial?: number;
  caption?: string;
};

export function BeforeAfterSlider({
  before,
  after,
  aspect = "16/10",
  initial = 50,
  caption,
}: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(initial);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const next = Math.max(0, Math.min(100, ratio * 100));
    setPos(next);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };

  const endDrag = () => setDragging(false);

  // Keyboard: arrows nudge by 2, shift+arrows by 10, Home/End jump.
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(100);
    }
  };

  // Cancel an accidental text selection while dragging.
  useEffect(() => {
    if (!dragging) return;
    const prev = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.userSelect = prev;
    };
  }, [dragging]);

  return (
    <figure>
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative w-full select-none overflow-hidden bg-bg-elevated cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: aspect, touchAction: "none" }}
      >
        {/* After (bottom layer, always fully visible) */}
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes="(min-width: 1024px) 720px, (min-width: 768px) 90vw, 100vw"
          className="object-cover"
          draggable={false}
          priority
        />

        {/* Before (top layer, clipped to slider position) */}
        <div
          className="absolute inset-0 h-full w-full"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image
            src={before.src}
            alt={before.alt}
            fill
            sizes="(min-width: 1024px) 720px, (min-width: 768px) 90vw, 100vw"
            className="object-cover"
            draggable={false}
          />
        </div>

        {/* Corner labels */}
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center rounded-full bg-y-ink/70 px-2.5 py-[3px] text-[10.5px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm md:left-4 md:top-4">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center rounded-full bg-y-ink/70 px-2.5 py-[3px] text-[10.5px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm md:right-4 md:top-4">
          After
        </span>

        {/* Divider line + draggable knob */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `${pos}%`, transform: "translateX(-1px)" }}
        >
          <div className="h-full w-[2px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.18)]" />
        </div>

        <button
          type="button"
          aria-label="Drag to reveal before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          role="slider"
          onKeyDown={onKeyDown}
          className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full bg-white text-ink shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.06)] transition-transform duration-200 ease-out hover:scale-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2 active:cursor-grabbing"
          style={{ left: `${pos}%` }}
        >
          {/* Two vertical bars as the grip — no arrow glyphs. */}
          <span aria-hidden className="flex items-center gap-[3px]">
            <span className="block h-3.5 w-[2px] rounded-full bg-ink" />
            <span className="block h-3.5 w-[2px] rounded-full bg-ink" />
          </span>
        </button>
      </div>

      {caption && (
        <figcaption className="mt-3 text-pretty text-[12.5px] text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
