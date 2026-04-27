"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { isVideoSrc } from "@/components/LazyVideo";

export type LightboxImage = {
  src: string;
  alt: string;
};

type Props = {
  images: LightboxImage[];
  startIndex: number;
  onClose: () => void;
};

export function Lightbox({ images, startIndex, onClose }: Props) {
  const [idx, setIdx] = useState(startIndex);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Defer visibility one frame so the fade-in transition runs
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIdx((i) => Math.max(0, i - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIdx((i) => Math.min(images.length - 1, i + 1));
      }
    };
    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [images.length, onClose]);

  if (!mounted) return null;

  const current = images[idx];
  const hasPrev = idx > 0;
  const hasNext = idx < images.length - 1;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: visible ? "rgba(10, 10, 12, 0.82)" : "rgba(10, 10, 12, 0)",
        backdropFilter: visible ? "blur(6px)" : "blur(0px)",
        WebkitBackdropFilter: visible ? "blur(6px)" : "blur(0px)",
        transition:
          "background-color 240ms cubic-bezier(0.16,1,0.3,1), backdrop-filter 240ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Close */}
      <button
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/90 backdrop-blur-md transition-colors hover:bg-white/20 md:right-6 md:top-6 md:h-10 md:w-10"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
        >
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          type="button"
          aria-label="Previous image"
          disabled={!hasPrev}
          onClick={(e) => {
            e.stopPropagation();
            if (hasPrev) setIdx((i) => i - 1);
          }}
          className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/90 backdrop-blur-md transition-opacity hover:bg-white/20 disabled:pointer-events-none disabled:opacity-30 md:left-6 md:flex md:h-12 md:w-12"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M10 2L4 8L10 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          type="button"
          aria-label="Next image"
          disabled={!hasNext}
          onClick={(e) => {
            e.stopPropagation();
            if (hasNext) setIdx((i) => i + 1);
          }}
          className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/90 backdrop-blur-md transition-opacity hover:bg-white/20 disabled:pointer-events-none disabled:opacity-30 md:right-6 md:flex md:h-12 md:w-12"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M6 2L12 8L6 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Image frame */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full max-w-[1400px] flex-col items-center gap-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.98)",
          transition:
            "opacity 280ms cubic-bezier(0.16,1,0.3,1), transform 280ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {isVideoSrc(current.src) ? (
          // Keyed on src so navigating to a different video remounts the
          // element and restarts playback from the start.
          <video
            key={current.src}
            src={current.src}
            controls
            autoPlay
            loop
            muted
            playsInline
            aria-label={current.alt}
            className="max-h-[82vh] w-auto max-w-full rounded-sm object-contain shadow-2xl"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={current.src}
            alt={current.alt}
            className="max-h-[82vh] w-auto max-w-full rounded-sm object-contain shadow-2xl"
            draggable={false}
          />
        )}

        {images.length > 1 && (
          <div
            role="tablist"
            aria-label="Image page control"
            className="flex items-center gap-1.5"
          >
            {images.map((_, i) => {
              const active = i === idx;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Go to image ${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdx(i);
                  }}
                  className="h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    width: active ? 18 : 6,
                    backgroundColor: active
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.35)",
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
