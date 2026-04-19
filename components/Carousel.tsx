"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

type CarouselImage = LightboxImage & {
  /** Intrinsic pixel width of the source image. Used to derive track aspect. */
  width?: number;
  /** Intrinsic pixel height of the source image. Used to derive track aspect. */
  height?: number;
};

type Props = {
  images: CarouselImage[];
  /** Fallback aspect if the first image lacks intrinsic dimensions. */
  aspect?: string;
  /** Sizes attribute forwarded to next/image. */
  sizes?: string;
  className?: string;
};

type DragState = {
  startX: number;
  startScroll: number;
  moved: boolean;
};

const DRAG_THRESHOLD = 5; // px before a mousedown counts as a drag

export function Carousel({
  images,
  aspect,
  sizes = "(min-width: 1024px) 700px, (min-width: 768px) 50vw, 100vw",
  className = "",
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const [active, setActive] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Track aspect = first image's intrinsic aspect, so the frame matches the
  // content and slides don't need cropping. Falls back to an explicit prop,
  // then to 3/2.
  const first = images[0];
  const trackAspect =
    first?.width && first?.height
      ? `${first.width} / ${first.height}`
      : aspect ?? "3 / 2";

  // Sync the active dot to scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = track.querySelectorAll<HTMLElement>("[data-slide]");
    if (!slides.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        for (const entry of entries) {
          const idx = Number(
            (entry.target as HTMLElement).dataset.slideIdx ?? "0",
          );
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { idx, ratio: entry.intersectionRatio };
          }
        }
        if (best && best.ratio > 0.55) setActive(best.idx);
      },
      { root: track, threshold: [0.55, 0.75, 1] },
    );

    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [images.length]);

  const goTo = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelectorAll<HTMLElement>("[data-slide]")[idx];
    if (!slide) return;
    track.scrollTo({
      left: slide.offsetLeft,
      behavior: "smooth",
    });
  }, []);

  const snapToNearest = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = track.querySelectorAll<HTMLElement>("[data-slide]");
    let nearest = 0;
    let minDist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - track.scrollLeft);
      if (d < minDist) {
        minDist = d;
        nearest = i;
      }
    });
    goTo(nearest);
  }, [goTo]);

  // Mouse drag (mouse + pen). Touch uses native scroll-snap.
  // Window-level move/up listeners let the drag continue even if the cursor
  // leaves the track. No pointer capture so the slide <button> click still fires.
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // left-click only
    const track = trackRef.current;
    if (!track) return;

    dragRef.current = {
      startX: e.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    };

    const onMove = (ev: MouseEvent) => {
      const s = dragRef.current;
      if (!s) return;
      const dx = ev.clientX - s.startX;
      if (!s.moved && Math.abs(dx) > DRAG_THRESHOLD) {
        s.moved = true;
        track.style.scrollBehavior = "auto";
      }
      if (s.moved) {
        ev.preventDefault();
        track.scrollLeft = s.startScroll - dx;
      }
    };

    const onUp = () => {
      const s = dragRef.current;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      dragRef.current = null;
      if (!s) return;
      if (s.moved) {
        suppressClickRef.current = true;
        track.style.scrollBehavior = "smooth";
        snapToNearest();
        // Reset the click suppressor on the next microtask, after the click
        // event (if any) has been swallowed.
        setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onSlideClick = (i: number) => {
    if (suppressClickRef.current) return;
    setLightboxIdx(i);
  };

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(Math.min(images.length - 1, active + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(Math.max(0, active - 1));
    }
  };

  const canPrev = active > 0;
  const canNext = active < images.length - 1;

  return (
    <div className={className}>
      <div className="relative">
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${images.length} images`}
          tabIndex={0}
          onKeyDown={onKey}
          onMouseDown={onMouseDown}
          className="no-scrollbar flex cursor-pointer snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-bg-elevated outline-none select-none"
          style={{ aspectRatio: trackAspect, scrollBehavior: "smooth" }}
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              data-slide
              data-slide-idx={i}
              aria-roledescription="slide"
              aria-label={`${img.alt} (${i + 1} of ${images.length}), click to expand`}
              onClick={() => onSlideClick(i)}
              className="relative w-full flex-none cursor-pointer snap-start overflow-hidden"
              style={{ aspectRatio: trackAspect }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={sizes}
                className="pointer-events-none object-contain"
                priority={i === 0}
                draggable={false}
              />
            </button>
          ))}
        </div>

        {/* Prev arrow */}
        <NavArrow
          direction="prev"
          disabled={!canPrev}
          onClick={() => goTo(active - 1)}
        />
        {/* Next arrow */}
        <NavArrow
          direction="next"
          disabled={!canNext}
          onClick={() => goTo(active + 1)}
        />
      </div>

      {/* iOS-style page control: small pills, active expands */}
      <div
        role="tablist"
        aria-label="Carousel page control"
        className="mt-4 flex items-center justify-center gap-1.5"
      >
        {images.map((_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className="h-1.5 rounded-full transition-[width,background-color] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: isActive ? 18 : 6,
                backgroundColor: isActive
                  ? "var(--color-ink)"
                  : "var(--color-line)",
              }}
            />
          );
        })}
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  );
}

function NavArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      disabled={disabled}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      className={`absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink backdrop-blur-sm transition-[opacity,transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)] disabled:pointer-events-none disabled:opacity-0 md:h-10 md:w-10 ${
        isPrev ? "left-3 md:left-4" : "right-3 md:right-4"
      }`}
      style={{
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        cursor: "pointer",
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden
      >
        <path
          d={isPrev ? "M7.5 2L3.5 6L7.5 10" : "M4.5 2L8.5 6L4.5 10"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
