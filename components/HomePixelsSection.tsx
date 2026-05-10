"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import {
  type PixelsImage,
  type PixelsItem,
} from "@/components/PixelsTile";
import { isVideoSrc, LazyVideo } from "@/components/LazyVideo";

type Props = { items: PixelsItem[] };

/**
 * Pixels section on the home page: an auto-scrolling marquee that
 * flattens every image of every pixels item into its own tile. Pauses
 * on hover. Section header carries the chunky yellow All button that
 * deep-links to the curated /pixels page.
 */
export function HomePixelsSection({ items }: Props) {
  return (
    <Reveal as="section" className="pt-36 md:pt-48">
      <Container>
        <SectionHeader
          title="Pixels"
          meta={
            <Button
              variant="yellow"
              href="/pixels"
              className="btn--sm"
            >
              View all
            </Button>
          }
        />
      </Container>

      <PixelsMarquee items={items} />
    </Reveal>
  );
}

type MarqueeTile = { item: PixelsItem; image: PixelsImage };

/** Fisher-Yates in place. Returns the same array for chaining. */
function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function PixelsMarquee({ items }: { items: PixelsItem[] }) {
  // Flatten every image of every item into its own tile so the marquee
  // shows the full sketchbook, not just one cover per project.
  const baseTiles: MarqueeTile[] = items.flatMap((item) =>
    (item.images ?? []).map((image) => ({ item, image })),
  );

  // SSR renders the deterministic flat order so server/client markup
  // matches on first paint. After mount we re-order via round-robin
  // interleaving by project: each project's images get shuffled within
  // themselves, then we pull one image at a time from each project in
  // turn. This guarantees images from the same project (e.g. all 3 DSP
  // shots) never sit back-to-back even when one project has more
  // images than the others.
  const [tiles, setTiles] = useState<MarqueeTile[]>(baseTiles);
  useEffect(() => {
    // Group tiles by project slug, shuffle within each group, then
    // shuffle the project order itself so the lead changes per visit.
    const groups = new Map<string, MarqueeTile[]>();
    for (const t of baseTiles) {
      const arr = groups.get(t.item.slug) ?? [];
      arr.push(t);
      groups.set(t.item.slug, arr);
    }
    for (const arr of groups.values()) shuffleInPlace(arr);
    const projectOrder = shuffleInPlace([...groups.keys()]);

    // Round-robin pull one tile per project until all groups empty.
    const interleaved: MarqueeTile[] = [];
    let drained = false;
    while (!drained) {
      drained = true;
      for (const slug of projectOrder) {
        const arr = groups.get(slug);
        if (arr && arr.length > 0) {
          interleaved.push(arr.shift()!);
          drained = false;
        }
      }
    }
    setTiles(interleaved);
    // baseTiles is derived from `items` prop; re-shuffle if items change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const doubled = [...tiles, ...tiles];

  return (
    <div className="pixels-marquee-mask mt-12 overflow-hidden md:mt-20">
      <ul
        className="pixels-marquee-track flex items-stretch"
        aria-label="Pixels showcase"
      >
        {doubled.map(({ item, image }, i) => {
          const isPortrait = image.height > image.width;
          const frameAspect = isPortrait ? "3 / 4" : "4 / 3";
          const isVideo = isVideoSrc(image.src);
          return (
            <li
              key={`${item.slug}-${i}`}
              aria-hidden={i >= tiles.length}
              className="shrink-0 px-2 md:px-4"
            >
              <Link
                href="/pixels"
                className="group block h-[312px] md:h-[468px]"
                aria-label={`${item.title}: ${item.kind}`}
              >
                <div
                  className="relative h-full overflow-hidden rounded-md bg-bg-elevated p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-active:translate-y-0 md:p-5"
                  style={{ aspectRatio: frameAspect }}
                >
                  <div className="relative h-full w-full">
                    {isVideo ? (
                      <LazyVideo
                        src={image.src}
                        alt={image.alt}
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    ) : (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 768px) 480px, 70vw"
                        quality={92}
                        className="object-contain"
                      />
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
