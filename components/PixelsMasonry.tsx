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
      <div className="columns-1 gap-x-6 sm:columns-2 lg:columns-3 lg:gap-x-8">
        {tiles.map((tile) => {
          const img = tile.item.images![tile.imageIndex];
          const isVideo = isVideoSrc(img.src);
          return (
            <button
              key={`${tile.item.slug}-${tile.imageIndex}`}
              type="button"
              onClick={() =>
                setOpen({ slug: tile.item.slug, index: tile.imageIndex })
              }
              aria-label={`Open ${tile.item.title}: ${img.alt}`}
              className="group mb-6 block w-full break-inside-avoid text-left active:scale-[0.99] md:mb-8"
              style={{ transition: "transform 200ms cubic-bezier(0.16,1,0.3,1)" }}
            >
              <div
                className="relative w-full overflow-hidden rounded-2xl bg-bg-elevated shadow-[0_0_0_1px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-active:translate-y-0"
                style={{ aspectRatio: `${img.width} / ${img.height}` }}
              >
                {isVideo ? (
                  <LazyVideo
                    src={img.src}
                    alt={img.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                  />
                )}
              </div>
              <div className="mt-4 flex flex-col gap-1.5">
                <p className="text-pretty text-[15px] leading-[1.4] text-ink md:text-[16px]">
                  {tile.item.kind}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  {tile.item.title} · {tile.item.year}
                </p>
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
