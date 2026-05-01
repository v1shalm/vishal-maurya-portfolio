"use client";

import { useState } from "react";
import Image from "next/image";
import { LazyVideo, isVideoSrc } from "@/components/LazyVideo";
import { Lightbox } from "@/components/Lightbox";
import type { PixelsItem } from "@/components/PixelsTile";

type FlatTile = {
  item: PixelsItem;
  imageIndex: number;
};

type LightboxState = {
  slug: string;
  index: number;
};

export function PixelsMasonry({ items }: { items: PixelsItem[] }) {
  const [open, setOpen] = useState<LightboxState | null>(null);

  const tiles: FlatTile[] = items.flatMap((item) =>
    (item.images ?? []).map((_, idx) => ({ item, imageIndex: idx })),
  );

  const openItem = open
    ? items.find((i) => i.slug === open.slug)
    : null;

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
        {tiles.map((tile) => {
          const img = tile.item.images![tile.imageIndex];
          const isVideo = isVideoSrc(img.src);
          const isPortrait = img.height > img.width;
          const frameAspect = isPortrait ? "3 / 4" : "4 / 3";
          return (
            <button
              key={`${tile.item.slug}-${tile.imageIndex}`}
              type="button"
              onClick={() =>
                setOpen({ slug: tile.item.slug, index: tile.imageIndex })
              }
              aria-label={`Open ${tile.item.title}: ${img.alt}`}
              className="group mb-4 block w-full break-inside-avoid text-left active:scale-[0.99]"
              style={{ transition: "transform 200ms cubic-bezier(0.16,1,0.3,1)" }}
            >
              <div
                className="relative overflow-hidden rounded-md bg-bg-elevated p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-active:translate-y-0 md:p-9"
                style={{ aspectRatio: frameAspect }}
              >
                <div className="relative h-full w-full">
                  {isVideo ? (
                    <LazyVideo
                      src={img.src}
                      alt={img.alt}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                      quality={92}
                      className="object-contain transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                    />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {open && openItem?.images && (
        <Lightbox
          images={openItem.images}
          startIndex={open.index}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
