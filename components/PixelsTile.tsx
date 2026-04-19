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
};

export function PixelsTile({
  item,
  sizes = "(min-width: 1024px) 700px, (min-width: 768px) 50vw, 100vw",
}: Props) {
  return (
    <div className="group flex flex-col">
      <TileMedia item={item} sizes={sizes} />

      <div className="mt-5 flex items-baseline justify-between gap-5 md:mt-6 md:gap-8">
        <p className="max-w-[40ch] text-pretty text-[16px] leading-[1.45] text-ink transition-colors duration-300 ease-out group-hover:text-ink-soft md:text-[17px]">
          {item.title}
        </p>
        <span className="shrink-0 text-[10.5px] uppercase tracking-[0.14em] text-muted tabular-nums">
          <span className="text-ink-soft">{item.kind}</span>
          <span aria-hidden className="mx-1.5 text-line">
            ·
          </span>
          {item.year}
        </span>
      </div>
    </div>
  );
}

function TileMedia({ item, sizes }: { item: PixelsItem; sizes: string }) {
  const { images } = item;

  if (images && images.length > 1) {
    return <Carousel images={images} sizes={sizes} />;
  }

  if (images && images.length === 1) {
    const img = images[0];
    return (
      <div
        className="relative w-full overflow-hidden bg-bg-elevated"
        style={{ aspectRatio: `${img.width} / ${img.height}` }}
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
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
