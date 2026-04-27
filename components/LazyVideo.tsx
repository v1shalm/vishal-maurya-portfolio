"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  alt: string;
  /** Forwarded to the underlying <video> element. */
  className?: string;
  /** Distance from viewport (in px) to start preloading. Defaults to 240. */
  rootMargin?: string;
};

/**
 * Inline-playing video that defers loading until it's about to enter the
 * viewport, then plays/pauses based on visibility. Saves bandwidth and CPU
 * on case studies and grids that stack multiple videos in one column.
 *
 * Honors prefers-reduced-motion (stays paused on the first frame).
 */
export function LazyVideo({
  src,
  alt,
  className = "absolute inset-0 h-full w-full object-cover",
  rootMargin = "240px 0px",
}: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      el.preload = "metadata";
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el.preload === "none") el.preload = "auto";
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.2, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      disablePictureInPicture
      controls={false}
      preload="none"
      aria-label={alt}
      className={className}
    />
  );
}

/**
 * Returns true if the given media source path looks like a video the browser
 * can autoplay inline (mp4 / webm / mov).
 */
export function isVideoSrc(src: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(src);
}
