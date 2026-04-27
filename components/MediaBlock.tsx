"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Media, MediaItem } from "@/lib/works";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";
import { ScrollingDeviceFrame } from "@/components/ScrollingDeviceFrame";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

export function MediaBlock({ media }: { media: Media }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (media.kind === "deviceScroll") {
    return (
      <figure>
        <ScrollingDeviceFrame
          tabs={media.tabs}
          thumbnail={media.thumbnail}
          frameAspect={media.frameAspect}
        />
        {media.caption && <Caption>{media.caption}</Caption>}
      </figure>
    );
  }

  if (media.kind === "slider") {
    return (
      <BeforeAfterSlider
        before={{ src: media.before.src, alt: media.before.alt ?? "" }}
        after={{ src: media.after.src, alt: media.after.alt ?? "" }}
        aspect={media.aspect}
        caption={media.caption}
      />
    );
  }

  // Flatten the block into a list of real images, preserving order. Videos
  // are excluded — they play inline and never open the lightbox. Index of
  // any clicked image maps 1:1 into this list so the lightbox opens on it.
  const realItems: MediaItem[] = collectItems(media).filter(
    (i): i is MediaItem & { src: string } =>
      typeof i.src === "string" && !/\.(mp4|webm|mov)$/i.test(i.src),
  );
  const lightboxImages: LightboxImage[] = realItems.map((i) => ({
    src: i.src!,
    alt: i.alt ?? "",
  }));

  const openAt = (item: MediaItem) => {
    if (!item.src) return;
    const idx = realItems.findIndex((r) => r.src === item.src);
    if (idx >= 0) setLightboxIdx(idx);
  };

  return (
    <>
      {media.kind === "single" && (
        <figure>
          <MediaFrame
            item={media.item}
            defaultAspect="16/10"
            onClick={openAt}
          />
          {media.caption && <Caption>{media.caption}</Caption>}
        </figure>
      )}

      {media.kind === "pair" && (
        <figure>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {media.items.map((item, i) => (
              <MediaFrame
                key={i}
                item={item}
                defaultAspect="4/3"
                onClick={openAt}
              />
            ))}
          </div>
          {media.caption && <Caption>{media.caption}</Caption>}
        </figure>
      )}

      {(media.kind === "triptych" || media.kind === "row") && (
        <figure>
          <div className="flex flex-col gap-5 md:gap-6">
            {media.items.map((item, i) => (
              <MediaFrame
                key={i}
                item={item}
                defaultAspect="16/10"
                onClick={openAt}
              />
            ))}
          </div>
          {media.caption && <Caption>{media.caption}</Caption>}
        </figure>
      )}

      {lightboxIdx !== null && (
        <Lightbox
          images={lightboxImages}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}

function collectItems(media: Media): MediaItem[] {
  if (media.kind === "single") return [media.item];
  if (media.kind === "deviceScroll") return [];
  if (media.kind === "slider") return [media.before, media.after];
  return media.items;
}

function MediaFrame({
  item,
  defaultAspect,
  onClick,
}: {
  item: MediaItem;
  defaultAspect: string;
  onClick: (item: MediaItem) => void;
}) {
  if (item.src) {
    const isVideo = /\.(mp4|webm|mov)$/i.test(item.src);

    // Video: lazy-play. preload=none until the video lands near the viewport;
    // IntersectionObserver triggers .play() on enter and .pause() on exit so a
    // page with five inline videos doesn't run five decoders simultaneously.
    if (isVideo) {
      const aspect = item.aspect ?? defaultAspect;
      return (
        <div
          className="relative w-full overflow-hidden bg-bg-elevated"
          style={{ aspectRatio: aspect }}
          aria-label={item.alt}
        >
          <LazyVideo src={item.src} alt={item.alt ?? ""} />
        </div>
      );
    }

    // Image: click opens the lightbox. Width/height are intrinsic placeholders
    // so the layout reserves space; CSS overrides to fluid 100% width.
    return (
      <button
        type="button"
        onClick={() => onClick(item)}
        data-cursor="view-case-study"
        data-cursor-label="Full size"
        className="group block w-full cursor-zoom-in overflow-hidden"
        aria-label={item.alt ? `${item.alt}, click to view full size` : "View full size"}
      >
        <Image
          src={item.src}
          alt={item.alt ?? ""}
          width={2400}
          height={1500}
          sizes="(min-width: 1024px) 720px, (min-width: 768px) 90vw, 100vw"
          className="block h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.01]"
          draggable={false}
        />
      </button>
    );
  }

  // Placeholder: use the specified aspect so the section still has visual weight.
  const aspect = item.aspect ?? defaultAspect;
  return (
    <div
      className="relative overflow-hidden bg-bg-elevated"
      style={{ aspectRatio: aspect }}
    >
      <div className="absolute inset-0 flex flex-col items-start justify-end p-4">
        <span className="text-[11.5px] text-muted">
          Placeholder
        </span>
        {item.alt && (
          <span className="mt-1 max-w-[32ch] text-[12.5px] leading-[1.4] text-ink-soft">
            {item.alt}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Inline-playing video that defers loading until it's about to enter the
 * viewport, then plays/pauses based on visibility. Saves bandwidth and CPU
 * on case studies that stack multiple videos in a single column.
 */
function LazyVideo({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: leave it paused on the first frame, never autoplay.
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
          // First time entering the viewport, swap preload up so bytes start
          // arriving, then play. .play() returns a promise that can reject if
          // the browser blocks autoplay; swallow it.
          if (el.preload === "none") el.preload = "auto";
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.2, rootMargin: "240px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="mt-3 text-pretty text-[12.5px] text-muted">
      {children}
    </figcaption>
  );
}
