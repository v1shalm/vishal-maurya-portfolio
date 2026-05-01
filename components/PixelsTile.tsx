import Image from "next/image";
import { Carousel } from "@/components/Carousel";

export type PixelsImage = {
  src: string;
  alt: string;
  /** Intrinsic pixel width. Drives the tile's aspect. */
  width: number;
  /** Intrinsic pixel height. Drives the tile's aspect. */
  height: number;
};

export type PixelsItem = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  images?: PixelsImage[];
  /** Fallback aspect when there are no images yet (e.g. "3/2"). */
  fallbackAspect?: string;
};

type Props = {
  item: PixelsItem;
  /** Forwarded to next/image for non-carousel tiles. */
  sizes?: string;
  /** Mark the single-image tile as LCP-eligible: preloads and sets fetchPriority="high". */
  priority?: boolean;
};

export function PixelsTile({
  item,
  sizes = "(min-width: 1024px) 700px, (min-width: 768px) 50vw, 100vw",
  priority = false,
}: Props) {
  return (
    <div className="group flex flex-col">
      <TileMedia item={item} sizes={sizes} priority={priority} />

      <div className="mt-5 flex flex-col md:mt-7">
        <p className="text-[18px] font-bold leading-[1.3] tracking-[-0.012em] text-ink md:text-[20px]">
          {item.title}.
        </p>

        <p className="mt-2 max-w-[52ch] text-pretty text-[16px] leading-[1.5] text-ink-soft transition-colors duration-300 ease-out group-hover:text-ink md:mt-2.5 md:text-[17px]">
          {item.kind}.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-1.5 text-[13px] text-muted md:text-[14px]">
          <span className="tabular-nums">{item.year}</span>
        </div>
      </div>
    </div>
  );
}

function TileMedia({
  item,
  sizes,
  priority,
}: {
  item: PixelsItem;
  sizes: string;
  priority: boolean;
}) {
  const { images } = item;

  if (images && images.length > 1) {
    return <Carousel images={images} sizes={sizes} />;
  }

  if (images && images.length === 1) {
    const img = images[0];
    return (
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-bg-elevated shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"
        style={{ aspectRatio: `${img.width} / ${img.height}` }}
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  // No images: placeholder with a fallback aspect so the grid stays rhythmic.
  return (
    <div
      className="relative w-full overflow-hidden bg-bg-elevated"
      style={{ aspectRatio: item.fallbackAspect ?? "3 / 2" }}
    >
      <div className="absolute inset-0 flex items-end p-10">
        <span className="text-[12.5px] text-muted">
          {item.title} · thumbnail pending
        </span>
      </div>
    </div>
  );
}
