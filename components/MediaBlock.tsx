"use client";

import { useState } from "react";
import type { Media, MediaItem } from "@/lib/works";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";
import { ScrollingDeviceFrame } from "@/components/ScrollingDeviceFrame";

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

  // Flatten the block into a list of real images, preserving order. Index of
  // any clicked image maps 1:1 into this list so the lightbox opens on it.
  const realItems: MediaItem[] = collectItems(media).filter(
    (i): i is MediaItem & { src: string } => typeof i.src === "string",
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
  // Real image: click opens the lightbox.
  if (item.src) {
    return (
      <button
        type="button"
        onClick={() => onClick(item)}
        data-cursor="view-case-study"
        data-cursor-label="Full size"
        className="group block w-full cursor-zoom-in overflow-hidden"
        aria-label={item.alt ? `${item.alt}, click to view full size` : "View full size"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.alt ?? ""}
          loading="lazy"
          decoding="async"
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

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="mt-3 text-pretty text-[12.5px] text-muted">
      {children}
    </figcaption>
  );
}
