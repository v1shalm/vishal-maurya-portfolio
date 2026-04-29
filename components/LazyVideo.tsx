"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  /** Optional still frame shown while the video data loads. */
  poster?: string;
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
 * Fades in once the first frame is decoded so consumers don't see a flash
 * of empty container while the network call resolves. Honors
 * prefers-reduced-motion (stays paused on the first frame, no fade).
 */
export function LazyVideo({
  src,
  alt,
  poster,
  className = "absolute inset-0 h-full w-full object-cover",
  rootMargin = "240px 0px",
}: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const handleReady = () => setReady(true);
    el.addEventListener("loadeddata", handleReady, { once: true });

    if (prefersReduced) {
      el.preload = "metadata";
      return () => el.removeEventListener("loadeddata", handleReady);
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
    return () => {
      io.disconnect();
      el.removeEventListener("loadeddata", handleReady);
    };
  }, [rootMargin]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      disablePictureInPicture
      controls={false}
      preload="none"
      aria-label={alt}
      className={className}
      style={{
        opacity: ready ? 1 : 0,
        transition: "opacity 280ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
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
